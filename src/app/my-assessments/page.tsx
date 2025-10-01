"use client";

import React, { useState, FormEvent, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Layout from "../../components/Layout/Layout";

// --- CHIRON: Import โครงสร้างใหม่ที่แยกออกไป ---
import InputPhoneNumber from "./components/InputPhoneNumber";
import InputOTP from "./components/InputOTP";
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
    imageUrl: string;
  };
  status: AssessmentStatus;
  estimatedValue: number;
  selectedServiceId: string;
}

const mockUserAssessments: AssessmentRecord[] = [
  {
    id: "rec001",
    email: "customer@example.com",
    phoneNumber: "0812345678",
    assessmentDate: "25 กันยายน 2568",
    device: {
      brand: "Apple",
      model: "iPhone 15 Pro",
      storage: "256GB",
      imageUrl: "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
    },
    status: "completed",
    estimatedValue: 28500,
    selectedServiceId: "pawn",
  },
  {
    id: "rec002",
    email: "customer@example.com",
    phoneNumber: "0987654321",
    assessmentDate: "24 กันยายน 2568",
    device: {
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      storage: "512GB",
      imageUrl: "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
    },
    status: "completed",
    estimatedValue: 19800,
    selectedServiceId: "sell",
  },
  {
    id: "rec003",
    email: "another.user@example.com",
    phoneNumber: "0611223344",
    assessmentDate: "20 กันยายน 2568",
    device: {
      brand: "Apple",
      model: "iPhone 13",
      storage: "128GB",
      imageUrl: "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
    },
    status: "in-progress",
    estimatedValue: 6000,
    selectedServiceId: "consignment",
  },
  {
    id: "rec004",
    email: "customer@example.com",
    phoneNumber: "0888888888",
    assessmentDate: "15 สิงหาคม 2568",
    device: {
      brand: "Google",
      model: "Pixel 8 Pro",
      storage: "256GB",
      imageUrl: "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
    },
    status: "pending",
    estimatedValue: 21000,
    selectedServiceId: "tradein",
  },
];

export default function MyAssessmentsPage() {
  const [step, setStep] = useState<"enter-phone" | "enter-otp" | "show-results">("enter-phone");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAssessments, setUserAssessments] = useState<AssessmentRecord[]>([]);

  const handlePhoneSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      setStep("enter-otp");
    }, 1500);
  };

  const handleOtpSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    const fullOtp = otp.join("");
    console.log("Verifying OTP:", fullOtp, "for number:", phoneNumber);
    setTimeout(() => {
      setUserAssessments(mockUserAssessments);
      setIsLoading(false);
      setStep("show-results");
    }, 1500);
  };

  const handleBackToPhone = () => {
    setStep("enter-phone");
    setError(null);
    setOtp(new Array(6).fill(""));
    setUserAssessments([]);
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = element.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const renderContent = () => {
    switch (step) {
      case "enter-phone":
        return (
          <InputPhoneNumber
            phoneNumber={phoneNumber}
            onPhoneNumberChange={setPhoneNumber}
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
          />
        );
      case "enter-otp":
        return (
          <InputOTP
            phoneNumber={phoneNumber}
            otp={otp}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onSubmit={handleOtpSubmit}
            onBack={handleBackToPhone}
            isLoading={isLoading}
          />
        );
      case "show-results":
        return (
          <ResultsView
            assessments={userAssessments}
            // CHIRON: Systemic Interaction - ปรับการส่ง prop ให้ตรงตามสัญญาใหม่ของ Component ลูก
            onBack={handleBackToPhone}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col items-center justify-start sm:pt-32">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          <AnimatePresence>
            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 flex w-full max-w-md items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </Layout>
  );
}
