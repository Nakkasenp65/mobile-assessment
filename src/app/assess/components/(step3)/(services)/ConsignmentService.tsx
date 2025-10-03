// src/app/assess/components/(step3)/(services)/ConsignmentService.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DeviceInfo } from "../../../page";
import { User, Phone, Camera, TrendingUp, Bell, Check } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";

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

const ConsignmentService = ({ deviceInfo, consignmentPrice }: ConsignmentServiceProps) => {
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    storeLocation: storeLocations[0],
    desiredPrice: "", // เริ่มต้นเป็น string ว่าง เพื่อให้ placeholder ทำงานถูกต้อง
    additionalNotes: "",
    dropoffDate: "",
    dropoffTime: "",
    termsAccepted: false,
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const { desiredPriceNum, serviceFeeAmount, netAmount } = useMemo(() => {
    const price = parseFloat(formState.desiredPrice) || consignmentPrice;
    const fee = price * SERVICE_FEE_RATE;
    const net = price - fee;
    return {
      desiredPriceNum: price,
      serviceFeeAmount: fee,
      netAmount: net,
    };
  }, [formState.desiredPrice, consignmentPrice]);

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.desiredPrice &&
    formState.dropoffDate &&
    formState.dropoffTime &&
    formState.termsAccepted;

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <main className="w-full space-y-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mb-4 rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50/75 to-sky-500/25 p-4"
      >
        <ul className="text-cyan-800 dark:text-cyan-200">
          <li className="flex items-start gap-2">
            <Camera className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>ถ่ายรูปสินค้าแบบมืออาชีพเพื่อดึงดูดลูกค้า</span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>ทีมการตลาดช่วยโปรโมทในหลายช่องทาง</span>
          </li>
          <li className="flex items-start gap-2">
            <Bell className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>แจ้งเตือนและรายงานความคืบหน้าสม่ำเสมอ</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span>คิดค่าบริการก็ต่อเมื่อสินค้าขายได้แล้วเท่านั้น</span>
          </li>
        </ul>
      </motion.div>

      <div className="mt-2 space-y-6 border-t pt-4 dark:border-zinc-700/50">
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
            <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
              ราคาประเมินเพื่อฝากขาย
            </h3>
            <p className="mt-2 bg-gradient-to-r from-cyan-600 to-sky-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-cyan-400 dark:to-sky-400">
              {THB(consignmentPrice)}
            </p>
            <p className="mt-2 text-sm text-cyan-800/80 dark:text-cyan-200/80">
              เราช่วยขายให้คุณเพื่อได้ราคาดีที่สุด
            </p>
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
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">ระบุราคาและรายละเอียด</Label>

            <div className="space-y-2">
              <Label htmlFor={`desiredPrice-consignment`}>ราคาที่ต้องการขาย (บาท)</Label>
              <Input
                id={`desiredPrice-consignment`}
                type="number"
                placeholder={`เช่น ${consignmentPrice}`}
                value={formState.desiredPrice}
                onChange={(e) => handleInputChange("desiredPrice", e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                *ราคาแนะนำจากตลาด: {THB(consignmentPrice)}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4 dark:border-cyan-400/30 dark:bg-cyan-400/10">
              <h4 className="mb-3 text-sm font-semibold text-cyan-900 dark:text-cyan-100">
                สรุปยอดเงินที่จะได้รับ (เมื่อขายได้)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-800 dark:text-cyan-200">ราคาที่ต้องการขาย</span>
                  <span className="font-semibold text-cyan-900 dark:text-cyan-100">
                    {THB(desiredPriceNum)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-800 dark:text-cyan-200">
                    หัก ค่าบริการฝากขาย ({SERVICE_FEE_RATE * 100}%)
                  </span>
                  <span className="font-semibold text-red-600">- {THB(serviceFeeAmount)}</span>
                </div>
                <div className="my-2 border-t border-cyan-200/50 dark:border-cyan-400/20" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-900 dark:text-cyan-100">
                    ยอดเงินสุทธิที่จะได้รับ
                  </span>
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
                <Select
                  value={formState.dropoffDate}
                  onValueChange={(value) => handleInputChange("dropoffDate", value)}
                >
                  <SelectTrigger id={`date-consignment`} className="w-full">
                    <SelectValue placeholder="เลือกวัน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">วันนี้</SelectItem>
                    <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`time-consignment`}>เวลา</Label>
                <Select
                  value={formState.dropoffTime}
                  onValueChange={(value) => handleInputChange("dropoffTime", value)}
                >
                  <SelectTrigger id={`time-consignment`} className="w-full">
                    <SelectValue placeholder="เลือกเวลา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11-14">11:00 - 14:00</SelectItem>
                    <SelectItem value="14-17">14:00 - 17:00</SelectItem>
                    <SelectItem value="17-20">17:00 - 20:00</SelectItem>
                  </SelectContent>
                </Select>
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
          className="space-y-6 pt-4"
        >
          <div className="flex items-start space-x-3">
            <Checkbox
              id={`terms-consignment`}
              checked={formState.termsAccepted}
              onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
              className="mt-1"
            />
            <label
              htmlFor={`terms-consignment`}
              className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ฉันยอมรับ{" "}
              <a href="#" className="text-blue-600 underline dark:text-blue-400">
                ข้อตกลงและเงื่อนไข
              </a>{" "}
              สำหรับบริการฝากขายสินค้า และค่าบริการ {SERVICE_FEE_RATE * 100}% ต่อรอบการขายฝาก (10
              วัน)
            </label>
          </div>
          <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
            ยืนยันการฝากขาย
          </FramerButton>
        </motion.div>
      </div>
    </main>
  );
};

export default ConsignmentService;
