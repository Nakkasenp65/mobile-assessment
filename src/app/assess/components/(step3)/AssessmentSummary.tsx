// src/app/assess/step3/AssessmentSummary.tsx
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImageOff, Star, CardSim } from "lucide-react";
import AssessmentLedger from "./AssessmentLedger";
import { RepairItem } from "@/hooks/useRepairPrices";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { AssessmentRecord } from "../../../../types/assessment";
import { AnimatePresence } from "framer-motion";

interface AssessmentSummaryProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  mockRecords: AssessmentRecord;
  isImageLoading: boolean;
  mobileData: { image_url?: string } | null | undefined;
  grade: string;
  finalPrice: number;
  assessmentDate: string;
  repairs: RepairItem[];
  totalCost: number;
  isLoadingRepairPrices: boolean;
}

const AssessmentSummary = ({
  deviceInfo,
  conditionInfo,
  mockRecords,
  isImageLoading,
  mobileData,
  grade,
  finalPrice,
  assessmentDate,
  repairs,
  totalCost,
  isLoadingRepairPrices,
}: AssessmentSummaryProps) => {
  const isPriceable = deviceInfo.productType === "iPhone" || deviceInfo.productType === "iPad";

  return (
    <div className="flex h-fit flex-col gap-4">
      <div className="flex w-full flex-col gap-2 rounded-2xl border p-2 shadow-sm sm:p-4 dark:bg-zinc-800">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-0.5 rounded-full bg-slate-100 p-1 px-1.5 text-xs font-medium text-slate-600">
            <span>รหัสการประเมิน #{mockRecords.id}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-1">
            <div className="flex h-16 w-16 flex-1 flex-shrink-0 items-center justify-center dark:bg-zinc-700">
              <AnimatePresence mode="wait">
                {isImageLoading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  </motion.div>
                ) : mobileData?.image_url ? (
                  <motion.div key="image" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Image
                      src={mobileData.image_url}
                      alt={deviceInfo.model}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div key="no-image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ImageOff className="h-10 w-10 text-slate-400 dark:text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-5 flex-col gap-0.5 sm:flex-4 sm:gap-2">
              <h3 className="text-foreground text-base font-bold sm:text-lg lg:text-xl">
                {deviceInfo.brand} {deviceInfo.model || deviceInfo.productType}
              </h3>
              {deviceInfo.storage && (
                <span className="font inline-flex w-max items-center gap-0.5 rounded-lg bg-slate-100 px-1 py-0.5 text-xs text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                  <CardSim className="h-3.5 w-3.5" />
                  {deviceInfo.storage}
                </span>
              )}
            </div>
          </div>

          {isPriceable && (
            <div className="pr-1">
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
          )}
        </div>

        {isPriceable && (
          <div className="border-border flex flex-col gap-2 border-t pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20">
                  <Star className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                </div>
                <p className="text-foreground font-semibold">ราคาประเมิน</p>
              </div>
            </div>
            <div className="py-2">
              <p className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 bg-clip-text text-center text-5xl font-bold text-transparent">
                {finalPrice.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <p className="text-muted-foreground text-xs"> {assessmentDate}</p>
          </div>
        )}
      </div>

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
