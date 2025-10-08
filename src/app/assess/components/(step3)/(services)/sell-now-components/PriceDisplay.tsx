// src/app/assess/components/(step3)/(services)/sell-now-components/PriceDisplay.tsx
"use client";

import { motion } from "framer-motion";

const THB = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

interface PriceDisplayProps {
  sellPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ sellPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-orange-50 via-pink-50 to-white p-6 text-center shadow-lg dark:border-pink-400/30 dark:from-orange-400/10 dark:via-pink-400/10"
    >
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-pink-100/50 blur-2xl dark:bg-pink-400/20" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl dark:bg-orange-400/20" />
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">ยอดเงินที่คุณจะได้รับ</h3>
        <p className="mt-2 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-pink-400 dark:to-orange-400">
          {THB(sellPrice)}
        </p>
        <p className="mt-2 text-sm text-pink-800/80 dark:text-pink-200/80">รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น</p>
      </div>
    </motion.div>
  );
};

export default PriceDisplay;
