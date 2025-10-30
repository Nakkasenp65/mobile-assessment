// src/app/line-assessments/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Assessment, RawAssessmentRecord } from "@/types/assessment";
import Loading from "@/components/ui/Loading";
import AssessmentsList from "./components/AssessmentsList";

const ITEMS_PER_PAGE = 12;

type AssessmentStatus = Assessment["status"];

interface SearchApiResponse {
  success: boolean;
  data: RawAssessmentRecord[];
}

// Helper function to transform raw assessment data
function transformAssessmentData(rec: RawAssessmentRecord): Assessment {
  const dev = rec.deviceInfo ?? rec.device ?? { brand: "", model: "", storage: "" };
  const created = rec.createdAt ?? rec.updatedAt ?? "";
  const assessmentDate = created
    ? new Date(created).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Extract type from service info if not present at root level (for backward compatibility)
  let type = rec.type;
  if (!type) {
    // Check which service info exists and infer the type
    if (rec.sellNowServiceInfo) {
      type = "SELL_NOW";
    } else if (rec.consignmentServiceInfo) {
      type = "CONSIGNMENT";
    } else if (rec.refinanceServiceInfo) {
      type = "REFINANCE";
    } else if (rec.iphoneExchangeServiceInfo) {
      type = "IPHONE_EXCHANGE";
    } else if (rec.tradeInServiceInfo) {
      type = "TRADE_IN";
    }
  }

  return {
    id: rec._id ?? rec.docId ?? Math.random().toString(36).slice(2),
    docId: rec.docId,
    email: "",
    phoneNumber: rec.phoneNumber ?? "",
    customerName: rec.customerName,
    assessmentDate,
    deviceInfo: {
      brand: dev.brand ?? "",
      model: dev.model ?? "",
      storage: dev.storage ?? "",
      productType: undefined,
    },
    conditionInfo: rec.conditionInfo ?? {
      cosmetic: "",
      functional: "",
      accessories: "",
    },
    status: (rec.status as AssessmentStatus) ?? "pending",
    estimatedValue: typeof rec.estimatedValue === "number" ? rec.estimatedValue : 0,
    ...(type && { type }),
  } as Assessment;
}

// Step 1: Search by phone number (gets ALL assessments - LINE + Web)
async function fetchAssessmentsByPhone(phone: string): Promise<Assessment[]> {
  const endpoint = `https://assessments-api-ten.vercel.app/api/assessments/search?phoneNumber=${encodeURIComponent(phone)}`;
  console.log("[LINE Assessments] Step 2: Fetching by phone number:", phone);

  const { data } = await axios.get<SearchApiResponse>(endpoint);

  if (!data || !data.success || !Array.isArray(data.data)) {
    throw new Error("รูปแบบข้อมูลไม่ถูกต้องจาก API");
  }

  return data.data.map(transformAssessmentData);
}

// Step 2: Main fetch function - uses 2-step search
async function fetchAssessmentsByLineUserId(lineUserId: string): Promise<Assessment[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const endpoint = `${backendUrl}/api/assessments/usersearch?line_user_id=${encodeURIComponent(lineUserId)}`;

  console.log("[LINE Assessments] Step 1: Fetching by LINE user ID:", lineUserId);

  try {
    // Step 1: Get assessment by LINE user ID
    const { data } = await axios.get<SearchApiResponse>(endpoint);

    if (!data || !data.success || !Array.isArray(data.data)) {
      throw new Error("ไม่พบข้อมูลการประเมินจาก LINE user ID");
    }

    // If no assessments found, return empty array
    if (data.data.length === 0) {
      console.log("[LINE Assessments] No assessments found for this LINE user");
      return [];
    }

    // Get phone number from first assessment
    const firstAssessment = data.data[0];
    const phoneNumber = firstAssessment.phoneNumber;

    console.log("[LINE Assessments] Found phone number:", phoneNumber);

    // If no phone number, return only the LINE assessments
    if (!phoneNumber) {
      console.warn("[LINE Assessments] No phone number found, returning LINE assessments only");
      return data.data.map(transformAssessmentData);
    }

    // Step 2: Search by phone number to get ALL assessments (LINE + Web)
    const allAssessments = await fetchAssessmentsByPhone(phoneNumber);

    console.log("[LINE Assessments] Total assessments found:", allAssessments.length);

    return allAssessments;
  } catch (error) {
    console.error("[LINE Assessments] API Error:", error);

    if (axios.isAxiosError(error)) {
      console.error("[LINE Assessments] Response Status:", error.response?.status);
      console.error("[LINE Assessments] Response Data:", error.response?.data);

      if (error.response?.status === 400) {
        throw new Error("Backend ยังไม่รองรับการค้นหาด้วย LINE User ID หรือ parameter ไม่ถูกต้อง");
      } else if (error.response?.status === 404) {
        throw new Error("ไม่พบ API endpoint สำหรับค้นหาด้วย LINE User ID");
      } else if (error.response?.status === 500) {
        throw new Error("เกิดข้อผิดพลาดที่ backend server");
      }
    }

    throw error;
  }
}

export default function LineAssessmentsPage() {
  const router = useRouter();
  const [lineUserId, setLineUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Initialize LIFF and get LINE user ID
    const initializeLiff = async () => {
      try {
        const liff = (await import("@line/liff")).default;

        if (!liff.isInClient()) {
          // Not in LINE app, redirect to normal assessment search
          console.warn("Not in LINE app, redirecting to my-assessments page");
          router.push("/my-assessments");
          return;
        }

        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        // Get LINE user ID
        const profile = await liff.getProfile();
        setLineUserId(profile.userId);
        setIsInitializing(false);
      } catch (error) {
        console.error("LIFF initialization error:", error);
        // Fallback to normal assessment search
        router.push("/my-assessments");
      }
    };

    initializeLiff();
  }, [router]);

  // Fetch assessments when lineUserId is available
  const {
    data: assessmentsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Assessment[], Error>({
    queryKey: ["assessmentsByLineUserId", lineUserId],
    queryFn: () => fetchAssessmentsByLineUserId(lineUserId!),
    enabled: !!lineUserId && !isInitializing,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Pagination logic
  const totalPages = Math.ceil(assessmentsData.length / ITEMS_PER_PAGE);

  const paginatedAssessments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return assessmentsData.slice(startIndex, endIndex);
  }, [assessmentsData, currentPage]);

  // Effect to reset to page 1 if data changes and current page becomes invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [assessmentsData, currentPage, totalPages]);

  const handleBack = () => {
    router.push("/liff-welcome");
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">กำลังเตรียมความพร้อม...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 active:scale-95"
            aria-label="กลับ"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">รายการประเมินของคุณ</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Loading />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex w-full items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลจากระบบ"}</span>
              </motion.div>
            ) : (
              <AssessmentsList
                assessments={paginatedAssessments}
                onRefresh={refetch}
                totalCount={assessmentsData.length}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
