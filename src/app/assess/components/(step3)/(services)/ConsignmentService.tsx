// src/app/assess/components/(step3)/(services)/ConsignmentService.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TimeSlotSelect from "@/components/ui/TimeSlotSelect";
import { Textarea } from "@/components/ui/textarea";
import { DeviceInfo } from "../../../../../types/device";
import { User, Phone } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { DateSelect } from "@/components/ui/date-select";
import { useRouter } from "next/navigation";

// Interface for Component Props
interface ConsignmentServiceProps {
  deviceInfo: DeviceInfo;
  consignmentPrice: number;
}

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

const SERVICE_FEE_RATE = 0.1; // 10% ค่าบริการ

// Helper function for currency formatting
const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

export default function ConsignmentService({ deviceInfo, consignmentPrice }: ConsignmentServiceProps) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    storeLocation: storeLocations[0],
    additionalNotes: "",
    dropoffDate: "",
    dropoffTime: "",
  });

  const handleInputChange = (field: keyof typeof formState, value: string | Date | undefined) => {
    if (field === "phone") {
      const numericValue = (value as string).replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const { serviceFeeAmount, netAmount } = useMemo(() => {
    const fee = consignmentPrice * SERVICE_FEE_RATE;
    const net = consignmentPrice - fee;
    return {
      serviceFeeAmount: fee,
      netAmount: net,
    };
  }, [consignmentPrice]);

  const isFormComplete =
    formState.customerName && formState.phone.length === 10 && formState.dropoffDate && formState.dropoffTime;

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
      <div className="mt-2 flex flex-col gap-6 dark:border-zinc-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-white p-6 text-center shadow-lg dark:border-cyan-400/30 dark:from-cyan-400/10 dark:via-sky-400/10"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-100/50 blur-2xl dark:bg-cyan-400/20" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sky-100/50 blur-2xl dark:bg-sky-400/20" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">ราคาประเมินเพื่อฝากขาย</h3>
            <p className="mt-2 bg-gradient-to-r from-cyan-600 to-sky-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-cyan-400 dark:to-sky-400">
              {THB(consignmentPrice)}
            </p>
            <p className="mt-2 text-sm text-cyan-800/80 dark:text-cyan-200/80">เราช่วยขายให้คุณเพื่อได้ราคาดีที่สุด</p>
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
              <Label htmlFor={`customerName-consignment`}>ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`customerName-consignment`}
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formState.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-consignment`}>เบอร์โทรศัพท์ติดต่อ</Label>
              <div className="relative">
                <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`phone-consignment`}
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  value={formState.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">รายละเอียดเพิ่มเติม</Label>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4 dark:border-cyan-400/30 dark:bg-cyan-400/10">
              <h4 className="mb-3 text-sm font-semibold text-cyan-900 dark:text-cyan-100">
                สรุปยอดเงินที่จะได้รับ (เมื่อขายได้)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-800 dark:text-cyan-200">ราคาประเมินฝากขาย</span>
                  <span className="font-semibold text-cyan-900 dark:text-cyan-100">{THB(consignmentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-800 dark:text-cyan-200">
                    หัก ค่าบริการฝากขาย ({SERVICE_FEE_RATE * 100}%)
                  </span>
                  <span className="font-semibold text-red-600">- {THB(serviceFeeAmount)}</span>
                </div>
                <div className="my-2 border-t border-cyan-200/50 dark:border-cyan-400/20" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-900 dark:text-cyan-100">ยอดเงินสุทธิที่จะได้รับ</span>
                  <span className="bg-gradient-to-r from-cyan-600 to-sky-500 bg-clip-text text-xl font-bold text-transparent dark:from-cyan-400 dark:to-sky-400">
                    {THB(netAmount)}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-cyan-700/80 dark:text-cyan-300/80">
                *ค่าบริการ 10% ต่อรอบการฝากขาย (10 วัน)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`additionalNotes-consignment`}>หมายเหตุเพิ่มเติม (ถ้ามี)</Label>
              <Textarea
                id={`additionalNotes-consignment`}
                placeholder="เช่น อุปกรณ์ที่มีพร้อม, สภาพพิเศษ, ข้อจำกัดในการขาย เป็นต้น"
                value={formState.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">เลือกสาขาและเวลาส่งมอบเครื่อง</Label>

            <div className="space-y-2">
              <Label htmlFor={`store-consignment`}>สาขา</Label>
              <Select
                value={formState.storeLocation}
                onValueChange={(value) => handleInputChange("storeLocation", value)}
              >
                <SelectTrigger id={`store-consignment`} className="w-full">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`date-consignment`}>วัน</Label>
                <DateSelect
                  value={formState.dropoffDate}
                  onValueChange={(value) => handleInputChange("dropoffDate", value)}
                  className="h-12 w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`time-consignment`}>เวลา</Label>
                <TimeSlotSelect
                  serviceType="บริการขายฝาก"
                  serviceData={formState}
                  selectedDate={formState.dropoffDate}
                  value={formState.dropoffTime}
                  onChange={(value) => handleInputChange("dropoffTime", value)}
                  className="h-12 w-full"
                />
              </div>
            </div>
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
            ยืนยันการฝากขาย
          </FramerButton>
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
            การคลิก &quot;ยืนยันการฝากขาย&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-600 underline hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
            >
              ข้อตกลงและเงื่อนไขการใช้บริการ
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
