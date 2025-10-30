// src\app\my-assessments\page.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../../components/Layout/Layout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import InputPhoneNumber from "./components/InputPhoneNumber";
import OTPInput from "./components/OTPInput";
import ResultsView from "./components/ResultView";
import type { Assessment, RawAssessmentRecord } from "@/types/assessment";
import Loading from "../../components/ui/Loading";
import { requestOTP, verifyOTP, OTPError } from "./lib/otp-api";
import {
  getVerifiedSession,
  persistLastPhone,
  loadLastPhone,
  clearAllSessions,
} from "./lib/session";

type AssessmentStatus = Assessment["status"];

interface SearchApiResponse {
  success: boolean;
  data: RawAssessmentRecord[];
}

async function fetchAssessmentsByPhone(phone: string): Promise<Assessment[]> {
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
      ? new Date(created).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    // Extract type from service info if not present at root level (for backward compatibility)
    // @ts-ignore - type field may exist at runtime
    let type = rec.type;
    if (!type) {
      // Check which service info exists and infer the type
      if (rec.sellNowServiceInfo) {
        type = "SELL_NOW";
      } else if (rec.pawnServiceInfo) {
        type = "PAWN";
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
      email: "",
      docId: rec.docId ?? "",
      phoneNumber: rec.phoneNumber ?? "",
      customerName: rec.customerName ?? "",
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
      // @ts-ignore - type field added for service detection
      ...(type && { type }),
    } as Assessment;
  });
}

const ITEMS_PER_PAGE = 12;

export default function MyAssessmentsPage() {
  const [step, setStep] = useState<"enter-phone" | "verify-otp" | "show-results">("enter-phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileWarning, setShowTurnstileWarning] = useState(false);

  // OTP-related state
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpRef, setOtpRef] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string>("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);

  // OTP countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

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

  // Prefill last phone and auto-verify if a valid session exists
  useEffect(() => {
    const last = loadLastPhone();
    if (last) {
      setPhoneNumberInput(last);
      getVerifiedSession(last).then((sess) => {
        if (sess) {
          setIsPhoneVerified(true);
          setPhoneNumber(last);
          if (isDevEnv || !!turnstileToken) {
            setStep("show-results");
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-transition to results when verified session and security checks are satisfied
  useEffect(() => {
    if (isPhoneVerified && phoneNumber && (isDevEnv || !!turnstileToken)) {
      setStep("show-results");
    }
  }, [isPhoneVerified, phoneNumber, isDevEnv, turnstileToken]);

  // Fetch assessments when in results step with verified phone
  const {
    data: assessmentsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Assessment[], Error>({
    queryKey: ["assessmentsByPhone", phoneNumber],
    queryFn: () => fetchAssessmentsByPhone(phoneNumber),
    enabled:
      step === "show-results" && !!phoneNumber && isPhoneVerified && (isDevEnv || !!turnstileToken),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // --- Pagination Logic ---
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

  const handlePhoneSubmit = async (phone: string) => {
    if (!turnstileToken && !isDevEnv) {
      setShowTurnstileWarning(true);
      console.error("[Turnstile] No token present in production — blocking submit.");
      return;
    } else if (!turnstileToken && isDevEnv) {
      console.warn("[Turnstile] Bypassing Turnstile verification in development mode.");
    }

    setShowTurnstileWarning(false);
    setPhoneNumber(phone);
    setOtpError("");
    persistLastPhone(phone);
    setCurrentPage(1); // Reset page on new search

    try {
      setIsOtpLoading(true);
      const existing = await getVerifiedSession(phone);
      if (existing) {
        setIsPhoneVerified(true);
        if (isDevEnv || !!turnstileToken) {
          setStep("show-results");
          refetch();
        } else {
          setStep("enter-phone");
        }
        return;
      }

      const response = await requestOTP(phone);

      if (response.success && response.data?.token) {
        setOtpToken(response.data.token ?? null);
        setOtpRef(response.data.ref ?? null);
        setOtpCountdown(120);
        setStep("verify-otp");
      } else if (response.success && !response.data?.token) {
        setIsPhoneVerified(true);
        setStep("show-results");
        refetch();
      } else {
        throw new OTPError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("[OTP] Request failed:", error);
      if (error instanceof OTPError) {
        setOtpError(error.message);
      } else {
        setOtpError("เกิดข้อผิดพลาดในการส่งรหัส OTP กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode: string) => {
    if (!otpToken || !otpCode) {
      setOtpError("ไม่พบ token สำหรับการยืนยัน กรุณาขอรหัสใหม่");
      return;
    }

    try {
      setIsOtpLoading(true);
      setOtpError("");

      const response = await verifyOTP(otpToken, otpCode, phoneNumber);

      if (response.success && response.data?.verified) {
        setIsPhoneVerified(true);
        setStep("show-results");
        refetch();
      } else {
        throw new OTPError(response.message || "รหัส OTP ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("[OTP] Verification failed:", error);
      if (error instanceof OTPError) {
        setOtpError(error.message);
      } else {
        setOtpError("เกิดข้อผิดพลาดในการยืนยันรหัส OTP กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!phoneNumber || isResendingOtp || otpCountdown > 0) return;

    try {
      setIsResendingOtp(true);
      setOtpError("");
      const existing = await getVerifiedSession(phoneNumber);
      if (existing) {
        setIsPhoneVerified(true);
        if (isDevEnv || !!turnstileToken) {
          setStep("show-results");
          refetch();
        } else {
          setStep("enter-phone");
        }
        return;
      }

      const response = await requestOTP(phoneNumber);

      if (response.success && response.data?.token) {
        setOtpToken(response.data.token ?? null);
        setOtpRef(response.data.ref ?? null);
        setOtpCountdown(120);
      } else if (response.success && !response.data?.token) {
        setIsPhoneVerified(true);
        setStep("show-results");
        refetch();
      } else {
        throw new OTPError(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("[OTP] Resend failed:", error);
      if (error instanceof OTPError) {
        setOtpError(error.message);
      } else {
        setOtpError("เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleBackFromOTP = () => {
    setStep("enter-phone");
    setOtpError("");
    setOtpToken(null);
    setOtpRef(null);
    setOtpCountdown(0);
    setIsPhoneVerified(false);
  };

  const handleBack = () => {
    setPhoneNumber("");
    setTurnstileToken(null);
    setShowTurnstileWarning(false);
    setOtpError("");
    setOtpToken(null);
    setOtpRef(null);
    setOtpCountdown(0);
    setIsPhoneVerified(false);
    setCurrentPage(1); // Reset page
    setStep("enter-phone");
  };

  const handleClearSession = () => {
    clearAllSessions();
    setIsPhoneVerified(false);
    setCurrentPage(1); // Reset page
    setStep("enter-phone");
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
            isLoading={isOtpLoading}
            showTurnstileWarning={showTurnstileWarning}
            isDevEnv={isDevEnv}
          />
        );
      case "verify-otp":
        return (
          <OTPInput
            phoneNumber={phoneNumber}
            transactionRef={otpRef ?? undefined}
            onOTPVerify={handleOTPVerify}
            onBack={handleBackFromOTP}
            onResendOTP={handleResendOTP}
            isLoading={isOtpLoading}
            isResending={isResendingOtp}
            error={otpError}
            countdown={otpCountdown}
          />
        );
      case "show-results":
        if (isLoading) return <Loading />;

        return (
          <>
            <ResultsView
              assessments={paginatedAssessments}
              onClearSession={handleClearSession}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] p-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          <AnimatePresence>
            {error && step === "show-results" && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex w-full max-w-md items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]"
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
