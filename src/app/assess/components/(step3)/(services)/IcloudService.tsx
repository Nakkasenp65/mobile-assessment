// src/app/assess/components/(step3)/(services)/IcloudService.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DeviceInfo } from "../../../page";
import { AlertTriangle, Lock, Mail, User, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import FramerButton from "@/components/ui/framer/FramerButton";

interface IcloudServiceProps {
  deviceInfo: DeviceInfo;
  icloudPawnPrice: number;
}

const INTEREST_RATE = 0.15; // 15%
const SERVICE_FEE = 450; // 450 บาท

const IcloudService = ({ deviceInfo, icloudPawnPrice }: IcloudServiceProps) => {
  const [formState, setFormState] = useState({
    customerName: "",
    appleId: "",
    password: "",
    termsAccepted: false,
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const calculatedValues = useMemo(() => {
    const interestAmount = icloudPawnPrice * INTEREST_RATE;
    const totalDeduction = interestAmount + SERVICE_FEE;
    const netAmount = icloudPawnPrice - totalDeduction;
    return {
      interestAmount,
      totalDeduction,
      netAmount,
    };
  }, [icloudPawnPrice]);

  const isFormComplete =
    formState.customerName && formState.appleId && formState.password && formState.termsAccepted;

  const THB = (n: number) =>
    n.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    });

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full space-y-6 pt-4">
      {/* Warning Box - ใช้สี Amber เหมือนเดิม (เหมาะกับ warning) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex items-start gap-4 rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm dark:border-amber-400/30 dark:from-amber-400/10 dark:to-yellow-400/10"
      >
        <AlertTriangle className="h-8 w-8 flex-shrink-0 text-amber-500" />
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-100">ข้อควรระวัง!</h3>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            บริการนี้จำเป็นต้องใช้ Apple ID และรหัสผ่านของท่าน
            โปรดตรวจสอบให้แน่ใจว่าท่านได้สำรองข้อมูลและยอมรับความเสี่ยงทั้งหมดที่อาจเกิดขึ้น
          </p>
        </div>
      </motion.div>

      {/* Price Display - เปลี่ยนเป็นสี Indigo (เข้ากับ iCloud/Apple) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1,
        }}
        className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6 shadow-lg dark:border-indigo-400/30 dark:from-indigo-400/10 dark:via-blue-400/10 dark:to-zinc-900"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-indigo-100/50 blur-2xl dark:bg-indigo-400/20" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-100/50 blur-2xl dark:bg-blue-400/20" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-center text-lg font-semibold text-indigo-900 dark:text-indigo-100">
            สรุปยอดสินเชื่อ iCloud
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-800 dark:text-indigo-200">ยอดประเมินสูงสุด</span>
              <span className="font-semibold text-indigo-900 dark:text-indigo-100">
                {THB(icloudPawnPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-800 dark:text-indigo-200">
                หัก ดอกเบี้ย (15% ต่อ 10 วัน)
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                - {THB(calculatedValues.interestAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-800 dark:text-indigo-200">หัก ค่าบริการ</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                - {THB(SERVICE_FEE)}
              </span>
            </div>
          </div>

          <div className="my-3 border-t border-indigo-200/50 dark:border-indigo-400/30" />

          <div className="text-center">
            <p className="text-sm text-indigo-800 dark:text-indigo-200">ยอดเงินที่คุณจะได้รับ</p>
            <p className="mt-2 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:to-blue-400">
              {THB(calculatedValues.netAmount)}
            </p>
            <p className="mt-2 text-sm text-indigo-800/80 dark:text-indigo-200/80">
              รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits Section - ใช้สี Indigo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-400/30 dark:bg-indigo-400/10"
      >
        <h4 className="mb-3 text-sm font-semibold text-indigo-900 dark:text-indigo-100">
          ข้อดีของบริการนี้
        </h4>
        <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>ไม่ต้องส่งตัวเครื่อง ใช้เพียง Apple ID</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>รับเงินทันที 15 นาที</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>สะดวก รวดเร็ว ไม่ต้องเดินทาง</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>ไถ่คืนได้ตลอด 10 วัน</span>
          </li>
        </ul>
      </motion.div>

      {/* Main Form */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
        className="space-y-6"
      >
        {/* Form Inputs */}
        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>

          <div className="space-y-2">
            <Label htmlFor="customerName-icloud">ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-icloud"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appleId-icloud">Apple ID (อีเมล)</Label>
            <div className="relative">
              <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="appleId-icloud"
                type="email"
                placeholder="example@icloud.com"
                value={formState.appleId}
                onChange={(e) => handleInputChange("appleId", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password-icloud">รหัสผ่าน Apple ID</Label>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="password-icloud"
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={formState.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation */}
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
            id="terms-icloud"
            checked={formState.termsAccepted}
            onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
            className="mt-1"
          />
          <label
            htmlFor="terms-icloud"
            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ฉันเข้าใจและยอมรับ{" "}
            <a href="#" className="text-blue-600 underline dark:text-blue-400">
              ข้อตกลงและเงื่อนไขการใช้บริการจำนำ iCloud
            </a>{" "}
            รวมถึงความเสี่ยงที่เกี่ยวข้องทั้งหมด
          </label>
        </div>
        <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
          ยืนยันและรับเงินทันที
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default IcloudService;
