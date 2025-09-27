"use client";

import React, {
  useState,
  FormEvent,
  type ComponentType,
  useMemo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  KeyRound,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Wrench,
  Clock,
  Banknote,
  Shield,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  Search as SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "../../components/Layout/Layout";
import clsx from "clsx";

// --- Icon Component Type ---
type IconComponent = ComponentType<{ className?: string }>;

// --- Service Options ---
interface ServiceOption {
  id: string;
  title: string;
  icon: IconComponent;
  colorClass: string;
  bgColorClass: string;
}

const ALL_SERVICES: ServiceOption[] = [
  {
    id: "sell",
    title: "ขายทันที",
    icon: Banknote,
    colorClass: "text-pink-600",
    bgColorClass: "bg-pink-50",
  },
  {
    id: "pawn",
    title: "บริการจำนำ",
    icon: Shield,
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-50",
  },
  {
    id: "tradein",
    title: "แลกซื้อเครื่องใหม่",
    icon: RefreshCw,
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-50",
  },
  {
    id: "consignment",
    title: "ฝากขาย",
    icon: ShoppingBag,
    colorClass: "text-sky-600",
    bgColorClass: "bg-sky-50",
  },
  {
    id: "installment",
    title: "ผ่อนชำระ",
    icon: CreditCard,
    colorClass: "text-red-600",
    bgColorClass: "bg-red-50",
  },
];

// --- Interface และ Mock Data ---
type AssessmentStatus =
  | "completed"
  | "pending"
  | "in-progress";

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
      imageUrl:
        "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
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
      imageUrl:
        "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
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
      imageUrl:
        "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
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
      imageUrl:
        "https://lh3.googleusercontent.com/d/1rbMNIqDEUFbrVwTsuHAjk5VijnFXvns6",
    },
    status: "pending",
    estimatedValue: 21000,
    selectedServiceId: "tradein",
  },
];

// --- StatusBadge Component ---
const StatusBadge = ({
  status,
}: {
  status: AssessmentStatus;
}) => {
  const statusConfig = {
    completed: {
      label: "ประเมินเสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
      label: "รอการประเมิน",
      icon: Clock,
      color:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "in-progress": {
      label: "กำลังดำเนินการ",
      icon: Wrench,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.color,
        "border",
        "min-w-[100px]",
        "justify-center",
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

// --- AssessmentCard Component ---
const AssessmentCard = ({
  assessment,
  index,
}: {
  assessment: AssessmentRecord;
  index: number;
}) => {
  const service = ALL_SERVICES.find(
    (s) => s.id === assessment.selectedServiceId,
  );
  const ServiceIcon = service?.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.05,
      }}
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      }}
      className="w-full"
    >
      <Link
        href={`/my-assessment-details/${assessment.id}`}
        className="group block h-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-orange-300"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Image
                src={assessment.device.imageUrl}
                alt={`${assessment.device.brand} ${assessment.device.model}`}
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {assessment.device.brand}{" "}
                {assessment.device.model}
              </h3>
              <p className="text-sm text-slate-500">
                {assessment.device.storage}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
        </div>
        {/* Divider */}
        <div className="my-4 h-px bg-slate-200" />
        {/* Card Body */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">สถานะ:</span>
            <StatusBadge status={assessment.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">บริการ:</span>
            {service && ServiceIcon && (
              <div
                className={clsx(
                  "flex items-center space-x-1.5 font-medium",
                  service.colorClass,
                )}
              >
                <ServiceIcon className="h-4 w-4 flex-shrink-0" />
                <span>{service.title}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              วันที่ประเมิน:
            </span>
            <span className="font-medium text-slate-700">
              {assessment.assessmentDate}
            </span>
          </div>
        </div>
        {/* Divider */}
        <div className="my-4 h-px bg-slate-200" />
        {/* Card Footer */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">
              ราคาประเมิน
            </p>
            <p className="text-xl font-bold text-orange-600">
              {assessment.estimatedValue.toLocaleString(
                "th-TH",
                {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                },
              )}
            </p>
          </div>
          <div className="inline-flex items-center text-sm font-semibold text-orange-600 group-hover:text-orange-700">
            ดูรายละเอียด
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- ResultsView Component ---
const ResultsView = ({
  assessments,
  email,
  onReset,
}: {
  assessments: AssessmentRecord[];
  email: string;
  onReset: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    AssessmentStatus | "all"
  >("all");

  const statusFilters: {
    label: string;
    value: AssessmentStatus | "all";
  }[] = [
    { label: "ทั้งหมด", value: "all" },
    { label: "เสร็จสิ้น", value: "completed" },
    { label: "กำลังดำเนินการ", value: "in-progress" },
    { label: "รอประเมิน", value: "pending" },
  ];

  const filteredAssessments = useMemo(() => {
    return assessments
      .filter((assessment) => {
        if (filterStatus === "all") return true;
        return assessment.status === filterStatus;
      })
      .filter((assessment) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const deviceName =
          `${assessment.device.brand} ${assessment.device.model}`.toLowerCase();
        return deviceName.includes(searchLower);
      });
  }, [assessments, searchTerm, filterStatus]);

  return (
    <motion.div
      key="show-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container w-full"
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">
          รายการประเมินของคุณ
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#78716c] md:text-lg">
          แสดงผลการประเมินทั้งหมด {assessments.length}{" "}
          รายการ
        </p>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="mx-auto my-8 w-full rounded-2xl border border-slate-200 bg-white/60 p-2 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex flex-1 items-center md:col-span-3">
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </span>
            <Input
              type="text"
              placeholder="ค้นหาอุปกรณ์... (เช่น iPhone 15 Pro)"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="h-12 w-full rounded-lg border-slate-300 bg-white pr-5 pl-10"
              style={{
                paddingLeft: 40,
              }}
            />
          </div>
          <div className="flex items-center md:col-span-2">
            <div className="flex h-full w-full items-center justify-end gap-2 rounded-sm bg-slate-100 p-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setFilterStatus(filter.value)
                  }
                  className={clsx(
                    "w-max rounded-sm px-1 py-2 text-center text-sm font-medium transition-colors",
                    filterStatus === filter.value
                      ? "border border-orange-200 bg-white text-orange-600 shadow"
                      : "text-slate-600 hover:bg-slate-200",
                  )}
                  style={{
                    minWidth: 92,
                    display: "inline-block",
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="mt-8">
        <AnimatePresence>
          {filteredAssessments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.map(
                (assessment, index) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    index={index}
                  />
                ),
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <SearchIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                ไม่พบรายการที่ตรงกัน
              </h3>
              <p className="mt-1 text-slate-500">
                ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองของคุณ
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 text-center">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="rounded-full px-6 py-3 text-base"
        >
          ค้นหาด้วยอีเมลอื่น
        </Button>
      </div>
    </motion.div>
  );
};

export default function MyAssessmentsPage() {
  const [step, setStep] = useState<
    "enter-email" | "enter-code" | "show-results"
  >("enter-email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAssessments, setUserAssessments] = useState<
    AssessmentRecord[]
  >([]);

  // [ปรับปรุง] ทำให้การส่งอีเมลสำเร็จเสมอ
  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setStep("enter-code");
      setIsLoading(false);
    }, 1500);
  };

  // [ปรับปรุง] ทำให้การยืนยันรหัสสำเร็จเสมอ และแสดงข้อมูลทั้งหมด
  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // แสดงข้อมูล mock ทั้งหมดเสมอ
      setUserAssessments(mockUserAssessments);
      setStep("show-results");
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToEmail = () => {
    setStep("enter-email");
    setError(null);
    setVerificationCode("");
    setUserAssessments([]);
  };

  const renderContent = () => {
    switch (step) {
      case "enter-email":
        return (
          <motion.div
            key="enter-email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">
              ตรวจสอบรายการประเมินของคุณ
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#78716c] md:text-lg">
              กรอกอีเมลที่ท่านใช้ในการประเมินเพื่อดูรายการทั้งหมด
            </p>
            <form
              onSubmit={handleEmailSubmit}
              className="mx-auto mt-8 w-full max-w-md pb-32"
            >
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#78716c]" />
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-full border-2 border-[#e3dace] bg-white pr-32 pl-12 text-base shadow-lg focus:border-[#f97316] focus:ring-[#f97316]/20"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="btn-hero absolute top-1/2 right-2 h-11 -translate-y-1/2 rounded-full px-6 font-semibold sm:px-8"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  ) : (
                    "ต่อไป"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        );
      case "enter-code":
        return (
          <motion.div
            key="enter-code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">
              ยืนยันตัวตน
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#78716c] md:text-lg">
              กรอกรหัส 6 หลักที่ส่งไปยัง{" "}
              <span className="font-semibold text-orange-600">
                {email}
              </span>
            </p>
            <form
              onSubmit={handleCodeSubmit}
              className="mx-auto mt-8 w-full max-w-md"
            >
              <div className="relative">
                <KeyRound className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#78716c]" />
                <Input
                  type="text"
                  placeholder="กรอกรหัสยืนยัน 6 หลัก"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value)
                  }
                  className="h-14 w-full rounded-full border-2 border-[#e3dace] bg-white pr-32 pl-12 text-base shadow-lg focus:border-[#f97316] focus:ring-[#f97316]/20"
                  maxLength={6}
                  required
                />
                <Button
                  type="submit"
                  disabled={
                    isLoading || verificationCode.length < 6
                  }
                  className="btn-hero absolute top-1/2 right-2 h-11 -translate-y-1/2 rounded-full px-6 font-semibold sm:px-8"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  ) : (
                    "ยืนยัน"
                  )}
                </Button>
              </div>
              <Button
                type="button"
                variant="link"
                onClick={handleBackToEmail}
                className="mt-4 text-slate-500"
              >
                เปลี่ยนอีเมล
              </Button>
            </form>
          </motion.div>
        );
      case "show-results":
        return (
          <ResultsView
            assessments={userAssessments}
            email={email}
            onReset={handleBackToEmail}
          />
        );
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#fed7aa] opacity-20 blur-3xl" />
          <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-[#fbcfe8] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#ddd6fe] opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>

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
