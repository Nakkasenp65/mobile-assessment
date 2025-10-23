// src/app/assess/components/(step3)/AssessmentSummary.tsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, XCircle, CardSim, Calendar, Clock } from "lucide-react"; // ✨ [ADD] Icons for meta row
import AssessmentLedger from "./AssessmentLedger";
import { RepairItem } from "@/hooks/useRepairPrices";
import { ConditionInfo, DeviceInfo } from "../../../types/device";
import { PriceLockCountdown } from "../../../components/ui/PriceLockCountdown";
import Image from "next/image";

interface AssessmentSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  docId?: string;
  isImageLoading: boolean;
  mobileData: { image_url?: string } | null | undefined;
  grade: string;
  finalPrice: number;
  assessmentDate: string;
  repairs: RepairItem[];
  totalCost: number;
  isLoadingRepairPrices: boolean;
  priceLockExpiresAt?: string; // Optional for countdown
  isIcloudLocked: boolean;
}

const AssessmentSummary = ({
  docId = "AS-202510-0001",
  deviceInfo,
  conditionInfo,
  isImageLoading,
  mobileData,
  grade,
  finalPrice,
  assessmentDate,
  repairs,
  totalCost,
  isLoadingRepairPrices,
  priceLockExpiresAt,
  isIcloudLocked,
}: AssessmentSummaryProps) => {
  const isPriceable = conditionInfo.canUnlockIcloud;

  return (
    <div className="flex h-fit flex-col gap-4">
      {/* Assessment Summary - Redesigned */}
      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header Section with Assessment ID */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 px-5 py-3 dark:from-zinc-800 dark:to-zinc-800/50">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-sm dark:bg-zinc-700/80 dark:text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>รหัสการประเมิน #{docId}</span>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Device Info */}
            <div className="flex flex-1 items-center gap-4">
              {/* Device Image */}
              <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/50 shadow-sm dark:from-zinc-800 dark:to-zinc-700/50">
                <AnimatePresence mode="wait">
                  {isImageLoading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="h-7 w-7 animate-spin rounded-full border-3 border-gray-300 border-t-blue-500 dark:border-zinc-600 dark:border-t-blue-400" />
                    </motion.div>
                  ) : mobileData?.image_url ? (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={mobileData.image_url}
                        alt={deviceInfo.model}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain p-2"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ImageOff className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Device Details */}
              <div className="flex flex-col gap-2">
                <h3 className="text-foreground text-md leading-tight font-bold sm:text-xl">
                  {deviceInfo.brand} {deviceInfo.model || deviceInfo.productType}
                </h3>
                {deviceInfo.storage && (
                  <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <CardSim className="h-3.5 w-3.5" />
                    <span>{deviceInfo.storage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Grade Badge (Only if priceable) */}
            {isPriceable && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm sm:h-20 sm:w-20 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <span className="text-3xl font-black text-green-600 sm:text-5xl dark:text-green-400">
                  {grade}
                </span>
              </motion.div>
            )}
          </div>

          {/* ✨ [UPDATE] Conditional Rendering for Price vs. iCloud Lock Message */}
          {isPriceable ? (
            // Price Section (Visible when priceable)
            <div className="mt-6 space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700" />
              <div className="flex items-center justify-center gap-2">
                <p className="text-muted-foreground text-sm font-medium">ราคาประเมิน</p>
              </div>
              <div className="relative flex w-full items-center justify-center py-2">
                <motion.p
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="flex items-center bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-center text-5xl font-black tracking-tight text-transparent sm:text-6xl"
                >
                  {finalPrice.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  <Image
                    src={"https://lh3.googleusercontent.com/d/1X_QS-ahnw2ubo0brwEt-oZwLX64JpNiK"}
                    width={128}
                    height={128}
                    alt="animated-coin"
                    className="-m-6"
                    priority
                  />
                </motion.p>
              </div>
              {/* Meta row: single compact chip with countdown + date */}
              <div className="flex justify-center">
                <span
                  className="flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium whitespace-nowrap text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  aria-label="รายละเอียดการล็อคราคาและวันที่ประเมิน"
                >
                  {priceLockExpiresAt && (
                    <>
                      <PriceLockCountdown expiresAt={priceLockExpiresAt} compact />
                    </>
                  )}
                  <span className="max-w-[60vw] truncate sm:max-w-none">{assessmentDate}</span>
                </span>
              </div>
            </div>
          ) : (
            // iCloud Locked Message (Visible when not priceable)
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex items-center gap-4 rounded-2xl border border-red-500/50 bg-red-50/50 p-4 dark:border-red-500/30 dark:bg-red-500/10"
            >
              <XCircle className="h-10 w-10 flex-shrink-0 text-red-500 dark:text-red-400" />
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-300">
                  ไม่สามารถประเมินราคาได้
                </h4>
                <p className="text-sm text-red-700/90 dark:text-red-300/80">
                  ขออภัย เราไม่รับซื้ออุปกรณ์ที่ติดล็อค iCloud
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Ledger Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-border rounded-2xl border p-4"
      >
        <AssessmentLedger
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          repairs={repairs}
          totalCost={totalCost}
          isLoading={isLoadingRepairPrices}
          isIcloudLocked={isIcloudLocked}
        />
      </motion.div>
    </div>
  );
};

export default AssessmentSummary;
