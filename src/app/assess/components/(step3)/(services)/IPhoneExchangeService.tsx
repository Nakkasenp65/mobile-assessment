// src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateSelect } from "@/components/ui/date-select";
import TimeSlotSelect from "@/components/ui/TimeSlotSelect";
import { DeviceInfo } from "../../../../../types/device";
import { Store, User, Phone, Train, Briefcase, Sparkles, Check, FileUp } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useBtsStations } from "@/hooks/useBtsStations";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Interface for Component Props
interface IPhoneExchangeServiceProps {
  deviceInfo: DeviceInfo;
  exchangePrice: number;
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

export default function IPhoneExchangeService({ deviceInfo, exchangePrice }: IPhoneExchangeServiceProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [locationType, setLocationType] = useState<"store" | "bts" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const { data: btsData, isLoading: isLoadingBts, error: btsError } = useBtsStations();

  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    btsStation: "",
    storeLocation: storeLocations[0],
    date: "",
    time: "",
    occupation: "",
    documentFile: null as File | null,
  });

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

  return (
    <main className="w-full space-y-6">
      <div className="flex flex-col gap-6 dark:border-zinc-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6 shadow-lg dark:border-green-400/30 dark:from-green-400/10 dark:via-emerald-400/10"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-green-100/50 blur-2xl dark:bg-green-400/20" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-400/20" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-center text-lg font-semibold text-green-900 dark:text-green-100">
              สรุปบริการไอโฟนแลกเงิน
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">วงเงินสูงสุด</span>
                <span className="font-semibold text-green-900 dark:text-green-100">{THB(exchangePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">ค่าบริการรอบแรก (15%)</span>
                <span className="font-semibold text-red-600 dark:text-red-400">- {THB(feeAmount)}</span>
              </div>
            </div>
            <div className="!my-3 border-t border-green-200/50 dark:border-green-400/30" />
            <div className="text-center">
              <p className="text-sm text-green-800 dark:text-green-200">ยอดเงินที่จะได้รับทันที</p>
              <p className="mt-1 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-green-400 dark:to-emerald-400">
                {THB(netAmount)}
              </p>
            </div>
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
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
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
                        ? "border-green-500 bg-green-50/50 shadow-lg"
                        : "border-zinc-200 bg-white/40"
                    } focus:border-green-400 focus:outline-none`}
                    onClick={() => handleInputChange("occupation", value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleInputChange("occupation", value);
                    }}
                    aria-checked={formState.occupation === value}
                    role="radio"
                  >
                    {value === OCCUPATION_TYPES.SALARIED ? (
                      <Briefcase className="h-7 w-7 text-green-500" />
                    ) : (
                      <Sparkles className="h-7 w-7 text-green-500" />
                    )}
                    <span className="mt-1 text-base font-medium text-green-950">
                      {value === "salaried" ? "พนักงานเงินเดือน" : "อาชีพอิสระ"}
                    </span>
                    {formState.occupation === value && (
                      <Check className="absolute top-2 right-2 h-4 w-4 text-green-600" />
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* เลือกสถานที่นัดหมาย */}
            <motion.div variants={formVariants} className="space-y-4">
              <Label className="block text-lg font-semibold">เลือกสถานที่นัดหมาย</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* BTS/MRT option */}
                <motion.button
                  type="button"
                  onClick={() => handleLocationTypeChange("bts")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-pressed={locationType === "bts"}
                  className={`flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium ${
                    locationType === "bts"
                      ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
                      : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50"
                  }`}
                >
                  <Train className="h-6 w-6" />
                  <span className="font-semibold">BTS/MRT</span>
                </motion.button>

                {/* Store option */}
                <motion.button
                  type="button"
                  onClick={() => handleLocationTypeChange("store")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  aria-pressed={locationType === "store"}
                  className={`flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium ${
                    locationType === "store"
                      ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
                      : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50"
                  }`}
                >
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
                        <SelectValue
                          placeholder={isLoadingBts ? "กำลังโหลด..." : btsError ? "เกิดข้อผิดพลาด" : "เลือกสายรถไฟ"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {btsData?.lines.map((line) => (
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
                        {(btsData?.stationsByLine[selectedBtsLine] || []).map((station) => (
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
                  <Select
                    value={formState.storeLocation}
                    onValueChange={(value) => handleInputChange("storeLocation", value)}
                  >
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-exchange">วัน</Label>
                  <DateSelect
                    value={formState.date}
                    onValueChange={(value) => handleInputChange("date", value)}
                    className="h-12 w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-exchange">เวลา</Label>
                  <TimeSlotSelect
                    serviceType="บริการแลกเปลี่ยน iPhone"
                    serviceData={{ ...formState, locationType }}
                    selectedDate={formState.date}
                    value={formState.time}
                    onChange={(value) => handleInputChange("time", value)}
                    className="h-12 w-full"
                  />
                </div>
              </div>
            </motion.div>

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
                <Label htmlFor={`document-upload-exchange`} className="font-semibold">
                  {documentUploadDetails.label}
                </Label>

                <div
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-6 shadow transition ${
                    formState.documentFile
                      ? "border-green-400"
                      : "border-dashed border-green-300 hover:border-green-500"
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
                  <FileUp className="mb-2 h-8 w-8 text-green-600" />
                  <span className="text-center text-sm text-green-800">
                    ลากไฟล์มาวางที่นี่ หรือ <span className="font-semibold text-green-600 underline">เลือกไฟล์</span>
                  </span>
                  <input
                    ref={fileRef}
                    id={`document-upload-exchange`}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {formState.documentFile ? (
                    <div className="mt-2 flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <Check className="h-4 w-4" />
                      <span>{formState.documentFile.name}</span>
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
          <FramerButton
            size="lg"
            disabled={!isFormComplete}
            className="h-14 w-full"
            onClick={() => router.push("/confirmed/1")}
          >
            ยืนยันและนัดหมาย
          </FramerButton>
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
            การคลิก &quot;ยืนยันและนัดหมาย&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 underline hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              ข้อตกลงและเงื่อนไขการใช้บริการ
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
