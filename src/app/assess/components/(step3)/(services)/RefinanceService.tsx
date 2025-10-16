// src/app/assess/components/(step3)/(services)/RefinanceService.tsx

"use client";

import { useState, useMemo, useRef, useEffect, useCallback, memo } from "react";
import { motion, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DeviceInfo } from "../../../../../types/device";
import { User, Phone, Sparkles, Check, Briefcase, FileUp, Receipt, CalendarDays } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import Turnstile (SSR-safe)
const Turnstile = dynamic(() => import("@/components/Turnstile"), {
  ssr: false,
  loading: () => <div className="h-[65px] w-[300px] animate-pulse rounded-md bg-gray-200" />,
});
const StableTurnstile = memo(Turnstile);

// Interface for Component Props
interface RefinanceServiceProps {
  deviceInfo: DeviceInfo;
  refinancePrice: number;
}

const PERIOD_OPTIONS = [3, 6, 10] as const;

const OCCUPATION_TYPES = {
  SALARIED: "salaried",
  FREELANCE: "freelance",
};

// Helper function for currency formatting
const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

export default function RefinanceService({ deviceInfo, refinancePrice }: RefinanceServiceProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    // CHIRON: Forensic Linguist - ลบ `termsAccepted` ออกจาก state
    // การยอมรับเงื่อนไขจะถูกผูกกับการกระทำหลัก (Primary Action) โดยตรง
    occupation: "",
    documentFile: null as File | null,
  });

  const [selectedMonths, setSelectedMonths] = useState<(typeof PERIOD_OPTIONS)[number]>(6);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileError, setShowTurnstileError] = useState(false);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    // CHIRON: Counter-intelligence Analyst - ดักจับและกรองข้อมูลที่ไม่ใช่ตัวเลขสำหรับเบอร์โทรศัพท์ ณ จุดกำเนิด
    // ป้องกันข้อมูล "ปนเปื้อน" (Contaminated Data) ไม่ให้เข้าสู่ระบบ State
    if (field === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormState((prev) => {
        const newState = { ...prev, [field]: numericValue };
        return newState;
      });
    } else {
      setFormState((prev) => {
        const newState = { ...prev, [field]: value };
        if (field === "occupation") {
          newState.documentFile = null;
        }
        return newState;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormState((prev) => ({
        ...prev,
        documentFile: e.target.files![0],
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const monthlyPayment = useMemo(() => {
    return refinancePrice / selectedMonths;
  }, [refinancePrice, selectedMonths]);

  // CHIRON: Structural Engineer - ปรับแก้ตรรกะการตรวจสอบความสมบูรณ์ของฟอร์ม
  // โดยนำเงื่อนไขการยอมรับข้อตกลงออก และเพิ่มการตรวจสอบความยาวเบอร์โทร
  const isFormComplete =
    formState.customerName && formState.phone.length === 10 && !!formState.occupation && !!formState.documentFile;

  const documentUploadDetails = useMemo(() => {
    if (formState.occupation === OCCUPATION_TYPES.SALARIED) {
      return {
        label: "สลิปเงินเดือน",
        description: "กรุณาแนบสลิปเงินเดือนล่าสุด (PDF, JPG, PNG)",
      };
    }
    if (formState.occupation === OCCUPATION_TYPES.FREELANCE) {
      return {
        label: "Statement",
        description: "กรุณาแนบ Statement ย้อนหลัง 3 เดือน (PDF)",
      };
    }
    return null;
  }, [formState.occupation]);

  const formVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const handleTurnstileVerify = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const handleConfirmRefinance = async () => {
    if (!turnstileToken) {
      turnstileRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setShowTurnstileError(true);
      setTimeout(() => setShowTurnstileError(false), 3000);
      return;
    }
    setShowTurnstileError(false);

    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Turnstile verification failed. โปรดลองใหม่");
        return;
      }
    } catch (err) {
      console.warn("Turnstile verification request failed", err);
      alert("ไม่สามารถยืนยัน Turnstile ได้ โปรดลองอีกครั้ง");
      return;
    }

    router.push("/confirmed/1");
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full space-y-6">
      <div className="mt-2 flex flex-col gap-6 dark:border-zinc-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-violet-50 to-white p-6 text-center shadow-lg dark:border-purple-400/30 dark:from-purple-400/10 dark:via-violet-400/10"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-purple-100/50 blur-2xl dark:bg-purple-400/20" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-100/50 blur-2xl dark:bg-violet-400/20" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              วงเงินรีไฟแนนซ์ที่คุณจะได้รับ
            </h3>
            <p className="mt-2 bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-purple-400 dark:to-violet-400">
              {THB(refinancePrice)}
            </p>
            <p className="mt-2 text-sm text-purple-800/80 dark:text-purple-200/80">
              รับเงินสดทันที และแบ่งชำระคืนสบายๆ
            </p>
          </div>
        </motion.div>

        {/* ระยะเวลาการผ่อนชำระ */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
          className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-400/30 dark:bg-purple-400/10"
        >
          <Label className="mb-3 block text-sm font-semibold text-purple-900 dark:text-purple-100">
            เลือกระยะเวลาการผ่อนชำระ
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {PERIOD_OPTIONS.map((months) => {
              const isSelected = selectedMonths === months;
              const calcMonthly = refinancePrice / months;
              const total = calcMonthly * months;
              return (
                <motion.button
                  key={months}
                  type="button"
                  onClick={() => setSelectedMonths(months)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-pressed={isSelected}
                  className={`group relative flex h-28 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center text-sm font-medium transition ${
                    isSelected
                      ? "border-violet-500 bg-violet-50/50 text-violet-900 shadow-lg"
                      : "border-zinc-200 bg-white/40 text-violet-900 hover:border-violet-400 hover:bg-violet-50"
                  }`}
                >
                  <span className="text-base font-semibold">{months} เดือน</span>
                  {isSelected && <Check className="absolute top-2 right-2 h-4 w-4 text-violet-600" />}
                  <div className="mt-1 w-full px-2">
                    <div
                      className={`min-h-[32px] text-xs transition-all duration-200 ease-out ${
                        isSelected
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-violet-800">ค่างวดต่อเดือน</span>
                        <span className="font-semibold text-violet-700">{THB(calcMonthly)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-violet-800">รวมชำระทั้งหมด</span>
                        <span className="font-semibold text-violet-700">{THB(total)}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-400/30 dark:bg-purple-400/10"
        >
          <h4 className="mb-3 text-sm font-semibold text-purple-900 dark:text-purple-100">รายละเอียดการผ่อนชำระ</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-800 dark:text-purple-200">ยอดผ่อนชำระต่อเดือน</span>
            </div>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{THB(monthlyPayment)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-800 dark:text-purple-200">ระยะเวลา</span>
            </div>
            <span className="font-semibold text-purple-800 dark:text-purple-200">{selectedMonths} เดือน</span>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
          className="space-y-6"
        >
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>

            <div className="space-y-2">
              <Label htmlFor={`customerName-refinance`}>ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`customerName-refinance`}
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formState.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-refinance`}>เบอร์โทรศัพท์ติดต่อ</Label>
              <div className="relative">
                <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                {/* CHIRON: Structural Engineer - บังคับใช้ "สัญญาอินพุต" ตามกฎที่กำหนด */}
                <Input
                  id={`phone-refinance`}
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  value={formState.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  inputMode="numeric" // บังคับใช้แป้นพิมพ์ตัวเลขบนมือถือ
                  pattern="[0-9]{10}" // กำหนดรูปแบบที่เข้มงวดสำหรับ HTML5 validation
                  maxLength={10} // จำกัดความยาวสูงสุด
                  className="h-12 pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="mb-2">อาชีพของคุณ</Label>
              <div className="flex flex-row gap-4">
                {Object.values(OCCUPATION_TYPES).map((value) => (
                  <Card
                    key={value}
                    tabIndex={0}
                    className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 transition ${
                      formState.occupation === value
                        ? "border-violet-500 bg-violet-50/50 shadow-lg"
                        : "border-zinc-200 bg-white/40"
                    } focus:border-violet-400 focus:outline-none`}
                    onClick={() => handleInputChange("occupation", value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleInputChange("occupation", value);
                    }}
                    aria-checked={formState.occupation === value}
                    role="radio"
                  >
                    {value === OCCUPATION_TYPES.SALARIED ? (
                      <Briefcase className="h-7 w-7 text-violet-500" />
                    ) : (
                      <Sparkles className="h-7 w-7 text-violet-500" />
                    )}
                    <span className="mt-1 text-base font-medium text-violet-950">
                      {value === "salaried" ? "พนักงานเงินเดือน" : "อาชีพอิสระ"}
                    </span>
                    {formState.occupation === value && (
                      <Check className="absolute top-2 right-2 h-4 w-4 text-violet-600" />
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {documentUploadDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor={`document-upload-refinance`} className="font-semibold">
                  {documentUploadDetails.label}
                </Label>

                <div
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-violet-50 px-6 py-6 shadow transition ${
                    formState.documentFile
                      ? "border-green-400"
                      : "border-dashed border-violet-300 hover:border-violet-500"
                  } cursor-pointer`}
                  tabIndex={0}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
                  }}
                  role="button"
                  aria-label="อัปโหลดไฟล์"
                >
                  <FileUp className="mb-2 h-8 w-8 text-violet-600" />
                  <span className="text-center text-sm text-violet-800">
                    ลากไฟล์มาวางที่นี่ หรือ <span className="font-semibold text-violet-600 underline">เลือกไฟล์</span>
                  </span>
                  <input
                    ref={fileRef}
                    id={`document-upload-refinance`}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {formState.documentFile ? (
                    <div className="mt-2 flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <Check className="h-4 w-4" />
                      <span aria-live="polite">{formState.documentFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormState((prev) => ({
                            ...prev,
                            documentFile: null,
                          }));
                          if (fileRef.current) {
                            fileRef.current.value = "";
                          }
                        }}
                        type="button"
                        className="ml-2 font-bold text-red-500 hover:text-red-700"
                        aria-label="ลบไฟล์ที่เลือก"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground mt-1 text-xs">{documentUploadDetails.description}</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.3 },
          }}
          className="space-y-4 pt-4"
        >
          <div ref={turnstileRef}>
            {showTurnstileError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 text-sm font-medium text-red-600"
              >
                กรุณายืนยันว่าคุณไม่ใช่บอทก่อนส่งฟอร์ม
              </motion.p>
            )}
            <StableTurnstile onVerify={handleTurnstileVerify} />
          </div>
          <FramerButton
            size="lg"
            disabled={!isFormComplete}
            className="h-14 w-full"
            onClick={handleConfirmRefinance}
          >
            ยืนยันการรีไฟแนนซ์
          </FramerButton>
          {/* CHIRON: Forensic Linguist - เปลี่ยนกลไกการยอมรับเงื่อนไข */}
          {/* ลบ Checkbox และสร้างข้อความแสดงเจตจำนงที่ชัดเจนและไม่กำกวม */}
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
            การคลิก &quot;ยืนยันการรีไฟแนนซ์&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ
            และยอมรับใน{" "}
            <a
              href="#" // CHIRON: ควรเปลี่ยนเป็นลิงก์ไปยังหน้าข้อตกลงจริง
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 underline hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              ข้อตกลงและเงื่อนไขการใช้บริการ
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
