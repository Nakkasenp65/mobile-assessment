// src/components/ui/ScrollDownIndicator.tsx
"use client";

import { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollDownIndicatorProps {
  targetRef: RefObject<HTMLElement>;
}

export default function ScrollDownIndicator({ targetRef }: ScrollDownIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  // ✨ FIX: Updated scroll handling logic
  const handleScroll = () => {
    if (targetRef.current) {
      const targetTopPosition = targetRef.current.getBoundingClientRect().top;

      if (targetTopPosition + 300 < window.innerHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } else {
      if (window.scrollY > 30) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    // Check initial position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [targetRef]);

  const handleClick = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
          onClick={handleClick}
          role="button"
          aria-label="Scroll to services section"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="from-primary to-secondary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white bg-gradient-to-br shadow-lg"
          >
            <ChevronDown className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
