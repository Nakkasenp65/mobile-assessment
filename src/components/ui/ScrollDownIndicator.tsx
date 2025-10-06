// src/components/ui/ScrollDownIndicator.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Component ลูกศรชี้ลงเพื่อบอกให้ User เลื่อนดูเนื้อหาต่อ
 * จะแสดงผลเมื่ออยู่บนสุดของหน้า และจะค่อยๆ หายไปเมื่อเริ่ม scroll
 */
export default function ScrollDownIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    if (window.scrollY > 30) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
        >
          <motion.div
            // --- Animation การเด้งขึ้นลง ---
            animate={{
              y: [0, -8, 0], // ขยับขึ้น 8px แล้วกลับมาที่เดิม
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity, // ทำซ้ำไปเรื่อยๆ
              ease: "easeInOut",
            }}
            className="from-primary to-secondary flex h-12 w-12 items-center justify-center rounded-full border border-white bg-gradient-to-br shadow-lg"
          >
            <ChevronDown className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
