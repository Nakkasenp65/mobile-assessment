// src\app\my-assessments\page.tsx

"use client";

import React, { useEffect, useState } from "react";
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
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileWarning, setShowTurnstileWarning] = useState(false); // Add state for Turnstile warning

  const env = (process.env.NODE_ENV ?? "").toLowerCase();
  const isDevEnv = env === "development" || env === "dev";

  useEffect(() => {
    console.log(`[Env] NODE_ENV=${env}`);
    if (isDevEnv) {
      console.warn("[Turnstile] Development bypass ACTIVE — submissions allowed without token.");
    } else {
      console.log("[Turnstile] Production mode — Turnstile verification REQUIRED.");
    }
  }, [env, isDevEnv]);

  const {
    data: assessmentsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<AssessmentRecord[], Error>({
    queryKey: ["assessmentsByPhone", phoneNumber],
    queryFn: () => fetchAssessmentsByPhone(phoneNumber),
    enabled: step === "show-results" && !!phoneNumber && (isDevEnv || !!turnstileToken), // Enable only if token is present or in dev mode
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handlePhoneSubmit = (phone: string) => {
    if (!turnstileToken && !isDevEnv) {
      setShowTurnstileWarning(true); // Set warning to true if token is missing and not in dev env
      console.error("[Turnstile] No token present in production — blocking submit.");
      return;
    } else if (!turnstileToken && isDevEnv) {
      console.warn("[Turnstile] Bypassing Turnstile verification in development mode.");
    }
    setShowTurnstileWarning(false); // Clear warning if token is present or in dev env
    setPhoneNumber(phone);
    setStep("show-results"); // Set step to show-results after successful submission
    refetch(); // Refetch data
  };

  const handleBack = () => {
    setPhoneNumber("");
    setTurnstileToken(null); // Clear turnstile token on back navigation
    setShowTurnstileWarning(false); // Clear warning on back navigation
    setStep("enter-phone"); // Set step back to enter-phone
  };

  const renderContent = () => {
    switch (step) {
      case "enter-phone":
        return (
          <InputPhoneNumber
            onPhoneNumberChange={setPhoneNumberInput}
            onPhoneSubmit={handlePhoneSubmit}
            phoneNumber={phoneNumberInput}
            onTurnstileVerify={setTurnstileToken}
            isLoading={isLoading}
            showTurnstileWarning={showTurnstileWarning}
            isDevEnv={isDevEnv} // Pass isDevEnv prop
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
          <ResultsView assessments={assessmentsData} onBack={handleBack} />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col items-center justify-start sm:pt-8">
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
