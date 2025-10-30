// src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeviceInfo } from "../../../../types/device";
import {
  User,
  Phone,
  Briefcase,
  Sparkles,
  Check,
  FileUp,
  Pencil,
  Receipt,
  CalendarDays,
} from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { Card } from "@/components/ui/card";
import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
import Swal from "sweetalert2";
import { PhoneNumberEditModal } from "@/components/ui/PhoneNumberEditModal";
import { buildIPhoneExchangeFormData } from "@/util/servicePayloads";
import {
  validateUploadFile,
  computeIsFormComplete,
  type ExchangeFormState,
  type OccupationType,
} from "@/util/exchangeValidation";
import Image from "next/image";
import { BRANCHES } from "@/constants/queueBooking";
import PDPA from "../../../../components/ui/pdpa";
import ConfirmServiceNoDepositModal from "./ConfirmServiceNoDepositModal";
import { MoneyIcon } from "@phosphor-icons/react";

// Interface for Component Props
interface IPhoneExchangeServiceProps {
  assessmentId: string;
  deviceInfo: DeviceInfo;
  exchangePrice: number;
  phoneNumber: string;
  customerName: string;
  lineUserId?: string | null; // เพิ่ม lineUserId (optional)
  onSuccess?: () => void;
  handleShowConsent: () => void;
}

const OCCUPATION_TYPES = {
  SALARIED: "salaried" as OccupationType,
  FREELANCE: "freelance" as OccupationType,
};

const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

export default function IPhoneExchangeService({
  assessmentId,
  exchangePrice,
  phoneNumber,
  customerName,
  lineUserId,
  onSuccess,
  handleShowConsent,
}: IPhoneExchangeServiceProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [locationType, setLocationType] = useState<"store" | "bts">(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");

  const [formState, setFormState] = useState<ExchangeFormState>({
    customerName: customerName,
    phone: phoneNumber,
    occupation: "",
    documentFile: null,
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  // Keep phone in sync if prop changes
  useEffect(() => {
    setFormState((prev) => ({ ...prev, phone: phoneNumber || "" }));
  }, [phoneNumber]);

  const updateAssessment = useUpdateAssessment(assessmentId, "IPHONE_EXCHANGE", lineUserId);

  const handleInputChange = (field: keyof ExchangeFormState, value: string | Date | undefined) => {
    if (field === "phone") {
      const numericValue = ((value ?? "") as string).replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else if (field === "occupation") {
      setFormState((prev) => ({
        ...prev,
        occupation: (value as OccupationType) ?? "",
        documentFile: null,
      }));
      setUploadError(null);
    } else {
      const str = typeof value === "string" ? value : value ? String(value) : "";
      setFormState((prev) => ({ ...prev, [field]: str }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (!f) return;
    const result = validateUploadFile({ name: f.name, type: f.type, size: f.size });
    if ("error" in result) {
      setUploadError(result.error);
      setFormState((prev) => ({ ...prev, documentFile: null }));
      return;
    }
    setUploadError(null);
    setFormState((prev) => ({ ...prev, documentFile: f }));
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

  const handleLocationTypeChange = (newLocationType: "store" | "bts") => {
    setLocationType(newLocationType);
    setFormState((prev) => ({ ...prev, btsStation: "" }));
    setSelectedBtsLine("");
  };

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const handleEditPhoneClick = () => {
    setIsPhoneModalOpen(true);
  };

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

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

  const isFormComplete = computeIsFormComplete(formState);

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleConfirmExchange = () => {
    if (!formState.documentFile) {
      void Swal.fire({
        icon: "error",
        title: "กรุณาแนบเอกสาร",
        text: "โปรดเลือกไฟล์ก่อนส่งข้อมูล",
      });
      return;
    }

    // iPhone Exchange uses manual booking - no queue booking API call
    // Date/time fields kept for potential future use or record keeping
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

    const formData = buildIPhoneExchangeFormData({
      customerName: formState.customerName,
      phone: formState.phone,
      time: currentTime,
      date: currentDate,
      occupation: formState.occupation as "salaried" | "freelance" | "",
      documentFile: formState.documentFile,
      // No queue booking fields - manual booking only
    });

    updateAssessment.mutate(formData, {
      onSuccess: () => {
        void Swal.fire({
          icon: "success",
          title: "ยืนยันข้อมูลสำเร็จ",
          text: "เราจะติดต่อคุณเร็วๆ นี้",
        });
        onSuccess?.();
      },
      onError: () => {
        void Swal.fire({
          icon: "error",
          title: "บันทึกข้อมูลไม่สำเร็จ",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      },
    });
  };

  return (
    <main className="w-full space-y-6">
      <ConfirmServiceNoDepositModal
        isOpen={isShowConfirmModal}
        setIsOpen={setIsShowConfirmModal}
        title={"ยืนยันการแลกเปลี่ยน iPhone"}
        description="เมื่อยืนยันการแลกเปลี่ยนระบบจะนำคุณไปยังหน้าสรุปรายการ"
        onConfirm={handleConfirmExchange}
        isLoading={updateAssessment.isPending}
      />
      <div className="flex flex-col gap-6 dark:border-zinc-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6 text-center shadow-lg dark:border-green-400/30 dark:from-green-400/10 dark:via-emerald-400/10"
        >
          <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-green-100/50 blur-2xl dark:bg-green-400/20" />
          <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-400/20" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              ราคาประเมินเพื่อแลกเปลี่ยน iPhone
            </h3>
            <div className="mt-2 flex items-center justify-center gap-2">
              <p className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-green-400 dark:to-emerald-400">
                {THB(exchangePrice)}
              </p>
              <Image
                src={"https://lh3.googleusercontent.com/d/1X_QS-ahnw2ubo0brwEt-oZwLX64JpNiK"}
                width={100}
                height={100}
                alt="animated-coin"
                className="-m-6"
                priority
              />
            </div>
            <p className="mt-2 text-sm text-green-800/80 dark:text-green-200/80">
              รับเครื่องใหม่พร้อมส่วนต่างทันที
            </p>
          </div>
        </motion.div>

        {/* รายละเอียดการผ่อนชำระ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-green-100 bg-green-50/50 p-4 dark:border-green-400/30 dark:bg-green-400/10"
        >
          <h4 className="mb-3 text-sm font-semibold text-green-900 dark:text-green-100">
            รายละเอียดการผ่อนชำระ
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">ยอดผ่อนชำระต่อเดือน</span>
            </div>
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
              {/* TODO: ยอดเงินต่อเดืือน */}
              {(exchangePrice / 6).toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MoneyIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">หักยอดเดือนแรก</span>
            </div>
            <span className="font-semibold text-green-800 dark:text-green-200">
              {/* TODO: จำนวนเดือน */}
              ลดบริการรอบแรกทันที 10%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-800 dark:text-green-200">ระยะเวลา</span>
            </div>
            <span className="font-semibold text-green-800 dark:text-green-200">
              {/* TODO: จำนวนเดือน */}6 เดือน
            </span>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-6"
        >
          {/* Customer Info */}
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>
            <div className="space-y-2">
              <Label htmlFor={`customerName-exchange`}>ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`customerName-exchange`}
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formState.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-exchange`}>เบอร์โทรศัพท์ติดต่อ</Label>
              <div className="relative">
                <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`phone-exchange`}
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  value={formState.phone}
                  readOnly
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="h-12 pr-12 pl-10"
                />
                <button
                  type="button"
                  onClick={handleEditPhoneClick}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md border bg-white p-2 text-slate-600 hover:bg-slate-50"
                  aria-label="แก้ไขเบอร์โทรศัพท์"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <PhoneNumberEditModal
            open={isPhoneModalOpen}
            initialPhone={formState.phone}
            onCancel={() => setIsPhoneModalOpen(false)}
            onSave={(newPhone) => {
              handleInputChange("phone", newPhone);
              setIsPhoneModalOpen(false);
            }}
          />

          {/* Occupation Selection */}
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="mb-2">อาชีพของคุณ</Label>
            <div className="flex flex-row gap-4">
              {[OCCUPATION_TYPES.SALARIED, OCCUPATION_TYPES.FREELANCE].map((value) => (
                <Card
                  key={value}
                  tabIndex={0}
                  className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 transition ${
                    formState.occupation === value
                      ? "border-emerald-500 bg-emerald-50/50 shadow-lg"
                      : "border-zinc-200 bg-white/40"
                  } focus:border-emerald-400 focus:outline-none`}
                  onClick={() => handleInputChange("occupation", value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleInputChange("occupation", value);
                  }}
                  aria-checked={formState.occupation === value}
                  role="radio"
                >
                  {value === OCCUPATION_TYPES.SALARIED ? (
                    <Briefcase className="h-7 w-7 text-emerald-600" />
                  ) : (
                    <Sparkles className="h-7 w-7 text-emerald-600" />
                  )}
                  <span className="mt-1 text-base font-medium text-emerald-950">
                    {value === "salaried" ? "พนักงานเงินเดือน" : "อาชีพอิสระ"}
                  </span>
                  {formState.occupation === value && (
                    <Check className="absolute top-2 right-2 h-4 w-4 text-emerald-600" />
                  )}
                </Card>
              ))}
            </div>
          </motion.div>

          {documentUploadDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-2 overflow-hidden"
            >
              <Label htmlFor={`document-upload-exchange`} className="font-semibold">
                {documentUploadDetails.label}
              </Label>

              <div
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 px-6 py-6 shadow transition ${
                  uploadError
                    ? "border-red-400 bg-red-50"
                    : formState.documentFile
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-500"
                } cursor-pointer`}
                tabIndex={0}
                role="button"
                aria-label="อัปโหลดไฟล์"
                aria-busy={updateAssessment.isPending}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Briefcase className="h-6 w-6 text-green-600" />
                <p className="text-sm text-green-800">คลิกเพื่ออัพโหลดเอกสาร</p>
                <input
                  ref={fileRef}
                  id="document-upload-exchange"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {formState.documentFile ? (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <FileUp className="h-4 w-4 text-green-600" />
                    <span>{formState.documentFile.name}</span>
                    <FramerButton
                      variant="outline"
                      size="sm"
                      onClick={() => setFormState((prev) => ({ ...prev, documentFile: null }))}
                      disabled={updateAssessment.isPending}
                    >
                      ลบไฟล์
                    </FramerButton>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {documentUploadDetails.description}
                  </p>
                )}
              </div>
              {uploadError && (
                <p
                  className="mt-1 text-sm font-medium text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {uploadError}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-4"
        >
          <FramerButton
            size="lg"
            disabled={!isFormComplete || updateAssessment.isPending}
            className="h-12 w-full"
            onClick={() => setIsShowConfirmModal(true)}
          >
            {updateAssessment.isPending ? "กำลังบันทึก..." : "ยืนยันการแลกเปลี่ยน iPhone"}
          </FramerButton>
        </motion.div>
        <PDPA handleShowConsent={handleShowConsent} serviceName="iphone-exchange" />
      </div>
    </main>
  );
}
