// src/app/assess/step3/AssessmentSummary.tsx
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, Star, Calendar, Shield } from "lucide-react";
import { DeviceInfo, ConditionInfo } from "../../page";
import AssessmentLedger from "./AssessmentLedger";
import { RepairItem } from "@/hooks/useRepairPrices"; // CHIRON: 1. Import Type ที่จำเป็นสำหรับ props

// CHIRON: Structural Engineer - เสริมความแข็งแกร่งของ "สัญญา" (Props Interface)
// เพื่อให้สามารถทำหน้าที่เป็นท่อส่งข้อมูล (Data Conduit) ที่สมบูรณ์ได้
interface AssessmentSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  isImageLoading: boolean;
  mobileData: { image_url?: string } | null | undefined;
  grade: string;
  finalPrice: number;
  assessmentDate: string;
  // เพิ่ม props ที่ต้องส่งผ่านไปยัง AssessmentLedger
  repairs: RepairItem[];
  totalCost: number;
  isLoadingRepairPrices: boolean;
}

const AssessmentSummary = ({
  deviceInfo,
  conditionInfo,
  isImageLoading,
  mobileData,
  grade,
  finalPrice,
  assessmentDate,
  // CHIRON: 2. รับ props ใหม่เข้ามาใน Component
  repairs,
  totalCost,
  isLoadingRepairPrices,
}: AssessmentSummaryProps) => {
  return (
    <div className="sticky flex h-fit flex-col gap-4 lg:top-24">
      {/* Card ข้อมูลและราคา (รวมกัน) */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-border bg-card w-full rounded-2xl border p-4 shadow-sm dark:bg-zinc-800"
      >
        {/* ส่วนข้อมูลอุปกรณ์ */}
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center dark:bg-zinc-700">
              {/* Product Image */}
              <AnimatePresence mode="wait">
                {isImageLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  </motion.div>
                ) : mobileData?.image_url ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Image
                      src={mobileData.image_url}
                      alt={deviceInfo.model}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ImageOff className="h-10 w-10 text-slate-400 dark:text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-2">
              <h3 className="text-foreground text-xl font-bold">
                {deviceInfo.brand} {deviceInfo.model}
              </h3>
              <span className="inline-flex w-max items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                <Shield className="h-3.5 w-3.5" />
                {deviceInfo.storage}
              </span>
            </div>
          </div>

          {/* Grade */}
          <div className="pr-2">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="text-6xl font-black text-green-500"
            >
              {grade}
            </motion.span>
          </div>
        </div>

        <div className="border-border my-4 border-t dark:border-zinc-700/50" />

        {/* ส่วนราคาประเมิน */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                <Star className="h-4 w-4 text-rose-500 dark:text-rose-400" />
              </div>
              <p className="text-foreground font-semibold">ราคาประเมิน</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
              <Calendar className="h-3.5 w-3.5" />
              <span>วันนี้</span>
            </div>
          </div>
          <p className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 bg-clip-text text-4xl font-bold text-transparent">
            {finalPrice.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
              minimumFractionDigits: 0, // ปรับเป็น 0 เพื่อความสะอาดตา
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-muted-foreground text-xs">ประเมิน ณ {assessmentDate}</p>
        </div>
      </motion.div>

      {/* Card รายละเอียดการตรวจสอบ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-border rounded-2xl border shadow-sm"
      >
        <AssessmentLedger
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          repairs={repairs}
          totalCost={totalCost}
          isLoading={isLoadingRepairPrices}
        />
      </motion.div>
    </div>
  );
};

export default AssessmentSummary;
