// src\app\my-assessments\page.tsx

"use client";

import React, { useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import InputPhoneNumber from "./components/InputPhoneNumber";
import ResultsView from "./components/ResultView";

type AssessmentStatus = "completed" | "pending" | "in-progress";

interface AssessmentRecord {
  id: string;
  email: string;
  phoneNumber: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
  };
  status: AssessmentStatus;
  estimatedValue: number;
  selectedServiceId: string; // optional in API; keep empty string to hide service
}

// Raw API record shape (subset)
interface RawAssessmentRecord {
  _id: string;
  docId?: string;
  phoneNumber: string;
  status: AssessmentStatus | string;
  estimatedValue?: number;
  deviceInfo?: { brand: string; model: string; storage: string };
  device?: { brand: string; model: string; storage: string };
  createdAt?: string;
  updatedAt?: string;
}

interface SearchApiResponse {
  success: boolean;
  data: RawAssessmentRecord[];
}

async function fetchAssessmentsByPhone(phone: string): Promise<AssessmentRecord[]> {
  const endpoint = `https://assessments-api-ten.vercel.app/api/assessments/search?phoneNumber=${encodeURIComponent(
    phone,
  )}`;
  const { data } = await axios.get<SearchApiResponse>(endpoint);

  if (!data || !data.success || !Array.isArray(data.data)) {
    throw new Error("รูปแบบข้อมูลไม่ถูกต้องจาก API");
  }

  return data.data.map((rec) => {
    const dev = rec.deviceInfo ?? rec.device ?? { brand: "", model: "", storage: "" };
    const created = rec.createdAt ?? rec.updatedAt ?? "";
    const assessmentDate = created
      ? new Date(created).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
      : "";

    return {
      id: rec._id ?? rec.docId ?? Math.random().toString(36).slice(2),
      email: "",
      phoneNumber: rec.phoneNumber ?? "",
      assessmentDate,
      device: {
        brand: dev.brand ?? "",
        model: dev.model ?? "",
        storage: dev.storage ?? "",
      },
      status: (rec.status as AssessmentStatus) ?? "pending",
      estimatedValue: typeof rec.estimatedValue === "number" ? rec.estimatedValue : 0,
      selectedServiceId: "", // hide service row in card
    } as AssessmentRecord;
  });
}

export default function MyAssessmentsPage() {
  const [step, setStep] = useState<"enter-phone" | "show-results">("enter-phone");

  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    data: assessmentsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<AssessmentRecord[], Error>({
    queryKey: ["assessmentsByPhone", phoneNumber],
    queryFn: () => fetchAssessmentsByPhone(phoneNumber),
    enabled: step === "show-results" && !!phoneNumber,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handlePhoneSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setStep("show-results");
    // useQuery will auto-run due to enabled condition; refetch optional for manual trigger
    refetch();
  };

  const handleBackToPhone = () => {
    setStep("enter-phone");
    setPhoneNumber("");
  };

  const renderContent = () => {
    switch (step) {
      case "enter-phone":
        return (
          <InputPhoneNumber
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
            onSubmit={handlePhoneSubmit}
            isLoading={false}
          />
        );
      case "show-results":
        return isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="container flex min-h-[60dvh] w-full items-center justify-center rounded-lg bg-white p-6 shadow"
          >
            <div className="text-muted-foreground text-sm">กำลังโหลดข้อมูลรายการประเมิน…</div>
          </motion.div>
        ) : (
          <ResultsView assessments={assessmentsData} onBack={handleBackToPhone} />
        );
      default:
        return null;
    }
  };

  return (
    // bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5]
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col items-center justify-start sm:pt-32">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          <AnimatePresence>
            {error && step === "show-results" && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex w-full max-w-md items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]"
              >
                <AlertCircle className="h-4 w-4" />
                {error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลจากระบบ"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  );
}
