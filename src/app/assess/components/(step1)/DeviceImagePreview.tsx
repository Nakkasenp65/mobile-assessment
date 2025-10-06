// src/app/assess/components/(step1)/DeviceImagePreview.tsx
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface DeviceImagePreviewProps {
  isLoading: boolean;
  imageUrl?: string;
  altText: string;
}

export default function DeviceImagePreview({ isLoading, imageUrl, altText }: DeviceImagePreviewProps) {
  const showPreview = isLoading || imageUrl;

  return (
    <div
      className="flex min-h-[3rem] items-center justify-center overflow-hidden rounded-xl pb-4 transition-all duration-300"
      style={{ height: showPreview ? "12rem" : "3rem" }}
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-4 border-slate-200" />
          </motion.div>
        )}
        {!isLoading && imageUrl && (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Image
              width="160"
              height="160"
              src={imageUrl}
              alt={altText}
              className="h-auto max-h-40 w-auto object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
