"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface PriceLockCountdownProps {
  expiresAt: string; // ISO string format
  compact?: boolean; // Apple-style compact mode
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function PriceLockCountdown({ expiresAt, compact = false, className = "" }: PriceLockCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isExpired: false,
      };
    };

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const expiryDate = new Date(expiresAt).toLocaleString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours < 12;

  if (timeRemaining.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center gap-2 text-xs text-red-600 dark:text-red-400 ${className}`}
      >
        <Clock className="h-3.5 w-3.5" />
        <span className="font-medium">ราคาล็อกหมดอายุแล้ว</span>
      </motion.div>
    );
  }

  // Apple-style compact mode for under price
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center gap-2 ${className}`}
      >
        <Clock className={`h-3.5 w-3.5 ${isUrgent ? "text-orange-500" : "text-muted-foreground"}`} />
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`font-medium ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"}`}
          >
            ล็อกราคา
          </span>
          <div className="flex items-baseline gap-0.5">
            {timeRemaining.days > 0 && (
              <>
                <motion.span
                  key={`d-${timeRemaining.days}`}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-semibold tabular-nums ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}
                >
                  {timeRemaining.days}
                </motion.span>
                <span className="text-muted-foreground text-[10px]">ว</span>
              </>
            )}
            <motion.span
              key={`h-${timeRemaining.hours}`}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-semibold tabular-nums ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}
            >
              {String(timeRemaining.hours).padStart(2, "0")}
            </motion.span>
            <span className="text-muted-foreground">:</span>
            <motion.span
              key={`m-${timeRemaining.minutes}`}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-semibold tabular-nums ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}
            >
              {String(timeRemaining.minutes).padStart(2, "0")}
            </motion.span>
            <span className="text-muted-foreground">:</span>
            <motion.span
              key={`s-${timeRemaining.seconds}`}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-semibold tabular-nums ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}
            >
              {String(timeRemaining.seconds).padStart(2, "0")}
            </motion.span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Full version for standalone display
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-xl border ${
        isUrgent
          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 dark:border-orange-800 dark:from-orange-950 dark:to-yellow-950"
          : "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950"
      } p-4 shadow-sm ${className}`}
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <Clock
            className={`h-5 w-5 ${isUrgent ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"}`}
          />
          <p
            className={`text-sm font-semibold ${isUrgent ? "text-orange-900 dark:text-orange-100" : "text-blue-900 dark:text-blue-100"}`}
          >
            ⏰ ล็อกราคาหมดอายุใน
          </p>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          <TimeUnit value={timeRemaining.days} label="วัน" isUrgent={isUrgent} />
          <TimeUnit value={timeRemaining.hours} label="ชม." isUrgent={isUrgent} />
          <TimeUnit value={timeRemaining.minutes} label="นาที" isUrgent={isUrgent} />
          <TimeUnit value={timeRemaining.seconds} label="วินาที" isUrgent={isUrgent} />
        </div>

        <p
          className={`text-xs ${isUrgent ? "text-orange-700 dark:text-orange-300" : "text-blue-700 dark:text-blue-300"}`}
        >
          หมดอายุ: {expiryDate} น.
        </p>

        {isUrgent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs font-semibold text-orange-800 dark:text-orange-200"
          >
            ⚠️ เหลือเวลาไม่มาก! กรุณาทำรายการโดยเร็ว
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
  isUrgent: boolean;
}

function TimeUnit({ value, label, isUrgent }: TimeUnitProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg ${
        isUrgent ? "bg-orange-100 dark:bg-orange-900/50" : "bg-blue-100 dark:bg-blue-900/50"
      } px-2 py-3`}
    >
      <motion.span
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-xl font-bold tabular-nums ${
          isUrgent ? "text-orange-900 dark:text-orange-100" : "text-blue-900 dark:text-blue-100"
        }`}
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span
        className={`text-xs ${isUrgent ? "text-orange-700 dark:text-orange-300" : "text-blue-700 dark:text-blue-300"}`}
      >
        {label}
      </span>
    </div>
  );
}
