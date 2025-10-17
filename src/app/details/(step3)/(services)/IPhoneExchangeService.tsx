// src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateTimeSelect from "@/components/ui/DateTimeSelect";
import { DeviceInfo } from "../../../../types/device";
import { Store, User, Phone, Train, Briefcase, Sparkles, Check, FileUp, Pencil } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useBtsStations } from "@/hooks/useBtsStations";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
import type { IPhoneExchangeServiceInfo } from "@/types/service";
import Swal from "sweetalert2";
import { mergeTrainDataWithApi } from "@/util/trainLines"; // ✨ Merge API + static MRT/SRT

// Interface for Component Props
interface IPhoneExchangeServiceProps {
  assessmentId: string;
  deviceInfo: DeviceInfo;
  exchangePrice: number;
  phoneNumber: string;
  onSuccess?: () => void;
}

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];
const SERVICE_FEE_RATE = 0.15; // 15%

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

export default function IPhoneExchangeService({
  assessmentId,
  deviceInfo,
  exchangePrice,
  phoneNumber,
  onSuccess,
}: IPhoneExchangeServiceProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [locationType, setLocationType] = useState<"store" | "bts" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const { data: btsData, isLoading: isLoadingBts, error: btsError } = useBtsStations();
  const merged = mergeTrainDataWithApi(btsData);

  const [formState, setFormState] = useState({
    customerName: "",
    phone: phoneNumber,
    btsStation: "",
    storeLocation: storeLocations[0],
    date: "",
    time: "",
    occupation: "",
    documentFile: null as File | null,
  });

  // Keep phone in sync if prop changes
  useEffect(() => {
    setFormState((prev) => ({ ...prev, phone: phoneNumber || "" }));
  }, [phoneNumber]);

  const handleInputChange = (field: keyof typeof formState, value: string | Date | undefined) => {
    if (field === "phone") {
      const numericValue = (value as string).replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
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

  const handleLocationTypeChange = (newLocationType: "store" | "bts") => {
    setLocationType(newLocationType);
    setFormState((prev) => ({
      ...prev,
      btsStation: "",
    }));
    setSelectedBtsLine("");
  };

  const handleEditPhoneClick = async () => {
    const result = await Swal.fire({
      title: "แก้ไขเบอร์โทรศัพท์",
      text: "กรุณากรอกเบอร์ 10 หลัก เช่น 0987654321",
      input: "tel",
      inputValue: formState.phone,
      inputAttributes: {
        maxlength: "10",
        inputmode: "numeric",
        pattern: "[0-9]*",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      preConfirm: (value) => {
        const sanitized = (value || "").replace(/[^0-9]/g, "");
        if (!/^\d{10}$/.test(sanitized)) {
          Swal.showValidationMessage("กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก");
          return;
        }
        return sanitized;
      },
    });
    if (result.value) {
      handleInputChange("phone", result.value);
    }
  };

  const { feeAmount, netAmount } = useMemo(() => {
    const fee = exchangePrice * SERVICE_FEE_RATE;
    const net = exchangePrice - fee;
    return { feeAmount: fee, netAmount: net };
  }, [exchangePrice]);

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

  const isFormComplete =
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.date &&
    formState.time &&
    locationType !== null &&
    (locationType === "bts" ? formState.btsStation : locationType === "store" ? true : false) &&
    !!formState.occupation &&
    !!formState.documentFile;

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const updateAssessment = useUpdateAssessment(assessmentId);

  const handleConfirmExchange = () => {
    const base = {
      customerName: formState.customerName,
      phone: formState.phone,
      locationType: (locationType as "store" | "bts") ?? "store",
      appointmentDate: String(formState.date),
      appointmentTime: String(formState.time),
      occupation: formState.occupation as "salaried" | "freelance" | "",
      documentFile: formState.documentFile,
    };

    const payload: IPhoneExchangeServiceInfo =
      locationType === "bts"
        ? { ...base, btsStation: formState.btsStation }
        : { ...base, storeLocation: formState.storeLocation };

    updateAssessment.mutate(
      { iphoneExchangeServiceInfo: payload },
      {
        onSuccess: () => {
          void Swal.fire({ icon: "success", title: "ยืนยันข้อมูลสำเร็จ", text: "เราจะติดต่อคุณเร็วๆ นี้" });
          onSuccess?.();
        },
        onError: () => {
          void Swal.fire({ icon: "error", title: "บันทึกข้อมูลไม่สำเร็จ", text: "กรุณาลองใหม่อีกครั้ง" });
        },
      },
    );
  };

  return (
    <main className="w-full space-y-6">
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
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">ราคาประเมินเพื่อแลกเปลี่ยน iPhone</h3>
            <p className="mt-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-green-400 dark:to-emerald-400">
              {THB(exchangePrice)}
            </p>
            <p className="mt-2 text-sm text-green-800/80 dark:text-green-200/80">รับเครื่องใหม่พร้อมส่วนต่างทันที</p>
          </div>
        </motion.div>

        <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
          {/* Customer Info */}
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>
            <div className="space-y-2">
              <Label htmlFor={`customerName-exchange`}>ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input id={`customerName-exchange`} placeholder="กรอกชื่อ-นามสกุล" value={formState.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} className="h-12 pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-exchange`}>เบอร์โทรศัพท์ติดต่อ</Label>
              <div className="relative">
                <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input id={`phone-exchange`} type="tel" placeholder="0xx-xxx-xxxx" value={formState.phone} readOnly inputMode="numeric" pattern="[0-9]{10}" maxLength={10} className="h-12 pr-12 pl-10" />
                <button type="button" onClick={() => {
                  void Swal.fire({
                    title: "แก้ไขเบอร์โทรศัพท์",
                    text: "กรุณากรอกเบอร์ 10 หลัก เช่น 0987654321",
                    input: "tel",
                    inputValue: formState.phone,
                    inputAttributes: { maxlength: "10", inputmode: "numeric", pattern: "[0-9]*", autocapitalize: "off", autocorrect: "off" },
                    showCancelButton: true,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: "ยกเลิก",
                    preConfirm: (value) => {
                      const sanitized = (value || "").replace(/[^0-9]/g, "");
                      if (!/^\d{10}$/.test(sanitized)) {
                        Swal.showValidationMessage("กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก");
                        return;
                      }
                      return sanitized;
                    },
                  }).then((result) => {
                    if (result.value) handleInputChange("phone", result.value);
                  });
                }} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md border bg-white p-2 text-slate-600 hover:bg-slate-50" aria-label="แก้ไขเบอร์โทรศัพท์">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Location Selection */}
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">เลือกรูปแบบสถานที่รับบริการ</Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button type="button" onClick={() => setLocationType("bts")} className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow-sm transition ${locationType === "bts" ? "border-primary bg-primary/5 text-primary" : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50"}`}>
                <Train className="h-6 w-6" />
                <span className="font-semibold">นัดรับที่สถานีรถไฟ</span>
              </motion.button>
              <motion.button type="button" onClick={() => setLocationType("store")} className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow-sm transition ${locationType === "store" ? "border-primary bg-primary/5 text-primary" : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50"}`}>
                <Store className="h-6 w-6" />
                <span className="font-semibold">รับบริการที่สาขา</span>
              </motion.button>
            </div>

            {/* รายละเอียดสถานที่ */}
            {locationType === "bts" && (
              <motion.div key="bts-form" variants={formVariants} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bts-line-exchange">สายรถไฟ</Label>
                  <Select onValueChange={setSelectedBtsLine} disabled={isLoadingBts || !!btsError}>
                    <SelectTrigger id="bts-line-exchange" className="w-full">
                      <SelectValue placeholder={isLoadingBts ? "กำลังโหลด..." : btsError ? "เกิดข้อผิดพลาด" : "เลือกสายรถไฟ"} />
                    </SelectTrigger>
                    <SelectContent>
                      {merged.lines.map((line) => (
                        <SelectItem key={line.LineId} value={line.LineName_TH}>
                          {line.LineName_TH}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bts-station-exchange">ระบุสถานี</Label>
                  <Select disabled={!selectedBtsLine} onValueChange={(value) => handleInputChange("btsStation", value)}>
                    <SelectTrigger id="bts-station-exchange" className="w-full">
                      <SelectValue placeholder="เลือกสถานี" />
                    </SelectTrigger>
                    <SelectContent>
                      {(merged.stationsByLine[selectedBtsLine] || []).map((station) => (
                        <SelectItem key={station.StationId} value={station.StationNameTH}>
                          {station.StationNameTH}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {locationType === "store" && (
              <motion.div key="store-form" variants={formVariants} className="space-y-2">
                <Label htmlFor="store-branch-exchange">สาขา</Label>
                <Select value={formState.storeLocation} onValueChange={(value) => handleInputChange("storeLocation", value)}>
                  <SelectTrigger id="store-branch-exchange" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {storeLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </motion.div>

          {/* เลือกวันและเวลา */}
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">เลือกวันและเวลา</Label>
            <div className="grid grid-cols-1 gap-4">
              <DateTimeSelect
                serviceType="บริการแลกเปลี่ยน iPhone"
                serviceData={{ ...formState, locationType }}
                dateValue={formState.date}
                onDateChange={(value) => handleInputChange("date", value)}
                timeValue={formState.time}
                onTimeChange={(value) => handleInputChange("time", value)}
                className="w-full"
                labelDate="วัน"
                labelTime="เวลา"
              />
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
                className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-6 shadow transition ${formState.documentFile ? "border-green-400" : "border-dashed border-green-300 hover:border-green-500"} cursor-pointer`}
                tabIndex={0}
                role="button"
                aria-label="อัปโหลดไฟล์"
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormState((prev) => ({ ...prev, documentFile: null }))}
                    >
                      ลบไฟล์
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1 text-xs">{documentUploadDetails.description}</p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirmation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4">
          <FramerButton size="lg" disabled={!isFormComplete || updateAssessment.isPending} className="h-14 w-full" onClick={handleConfirmExchange}>
            {updateAssessment.isPending ? "กำลังบันทึก..." : "ยืนยันการแลกเปลี่ยน iPhone"}
          </FramerButton>
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
            การคลิก &quot;ยืนยันการแลกเปลี่ยน iPhone&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน{" "}
            <a href="#" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 underline hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              ข้อตกลงและเงื่อนไขการใช้บริการ
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
