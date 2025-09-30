// src/app/assess/components/(step3)/(services)/RefinanceService.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DeviceInfo } from "../../../page";
import {
  User,
  Phone,
  Sparkles,
  Check,
  TrendingUp,
  CalendarDays,
  Receipt,
} from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";

interface RefinanceServiceProps {
  deviceInfo: DeviceInfo;
  refinancePrice: number;
}

const REFINANCE_MONTHS = 6;

const RefinanceService = ({
  deviceInfo,
  refinancePrice,
}: RefinanceServiceProps) => {
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    termsAccepted: false,
  });

  const handleInputChange = (
    field: keyof typeof formState,
    value: any,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const monthlyPayment = useMemo(() => {
    return refinancePrice / REFINANCE_MONTHS;
  }, [refinancePrice]);

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.termsAccepted;

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

  return (
    <main className="w-full space-y-6 pt-4">
      {/* Price Display */}
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

      {/* Installment Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-400/30 dark:bg-purple-400/10"
      >
        <h4 className="mb-3 text-sm font-semibold text-purple-900 dark:text-purple-100">
          รายละเอียดการผ่อนชำระ
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-200">
              ยอดผ่อนชำระต่อเดือน
            </span>
          </div>
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {THB(monthlyPayment)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-200">
              ระยะเวลา
            </span>
          </div>
          <span className="font-semibold text-purple-800 dark:text-purple-200">
            {REFINANCE_MONTHS} เดือน
          </span>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-400/30 dark:bg-purple-400/10"
      >
        <h4 className="mb-3 text-sm font-semibold text-purple-900 dark:text-purple-100">
          ข้อดีของบริการรีไฟแนนซ์
        </h4>
        <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <span>รับเงินก้อนไปใช้ก่อนได้ทันที</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <span>แบ่งชำระคืนเบาๆ นานสูงสุด 6 เดือน</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <span>ไม่ต้องใช้คนค้ำประกัน</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
            <span>อนุมัติไวภายใน 15 นาที</span>
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
        <motion.div
          variants={formVariants}
          className="space-y-4"
        >
          <Label className="block text-lg font-semibold">
            กรอกข้อมูลเพื่อดำเนินการ
          </Label>

          <div className="space-y-2">
            <Label htmlFor="customerName-refinance">
              ชื่อ-นามสกุล
            </Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-refinance"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) =>
                  handleInputChange(
                    "customerName",
                    e.target.value,
                  )
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-refinance">
              เบอร์โทรศัพท์ติดต่อ
            </Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="phone-refinance"
                type="tel"
                placeholder="0xx-xxx-xxxx"
                value={formState.phone}
                onChange={(e) =>
                  handleInputChange("phone", e.target.value)
                }
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
            id="terms-refinance"
            checked={formState.termsAccepted}
            onCheckedChange={(checked) =>
              handleInputChange(
                "termsAccepted",
                Boolean(checked),
              )
            }
            className="mt-1"
          />
          <label
            htmlFor="terms-refinance"
            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ฉันเข้าใจและยอมรับ{" "}
            <a
              href="#"
              className="text-blue-600 underline dark:text-blue-400"
            >
              ข้อตกลงและเงื่อนไขการรีไฟแนนซ์
            </a>{" "}
            และยินยอมให้ตรวจสอบข้อมูลที่จำเป็น
          </label>
        </div>
        <FramerButton
          size="lg"
          disabled={!isFormComplete}
          className="h-14 w-full"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          ยืนยันการรีไฟแนนซ์
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default RefinanceService;
