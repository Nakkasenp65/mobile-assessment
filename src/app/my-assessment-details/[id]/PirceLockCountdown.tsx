"use client";
import { AlertCircle, Timer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PriceLockCountdown({
  expiryDate,
}: {
  expiryDate: string;
}) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24),
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24,
        ),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [expiryDate]);

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(),
  );
  const [isExpired, setIsExpired] = useState(
    Object.keys(calculateTimeLeft()).length === 0,
  );

  useEffect(() => {
    if (isExpired) return;

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (isExpired) {
    return (
      <div className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span className="font-semibold">
          ราคานี้หมดอายุแล้ว กรุณาประเมินใหม่อีกครั้ง
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 text-amber-700">
        <Timer className="h-5 w-5" />
        <span className="font-semibold">
          ราคานี้มีผลอีก:
        </span>
      </div>
      <div className="mt-2 flex justify-center gap-2 font-sans sm:gap-3 md:gap-4">
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.days || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            วัน
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.hours || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            ชั่วโมง
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.minutes || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            นาที
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.seconds || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            วินาที
          </span>
        </div>
      </div>
    </>
  );
}
