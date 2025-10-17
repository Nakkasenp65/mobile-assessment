// src/components/ui/DateTimeSelect.tsx
"use client";

import React from "react";
import { DateSelect } from "@/components/ui/date-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCheckAvailability } from "@/hooks/useCheckAvailability";
import {
  toApiServiceType,
  inferApiLocationFromService,
  generateTimeSlots,
  todayStringTZ,
  currentHourTZ,
} from "@/util/availability";
import { AnimatePresence, motion } from "framer-motion";

export interface DateTimeSelectProps {
  serviceType: string;
  serviceData: unknown;
  dateValue?: string; // YYYY-MM-DD
  onDateChange: (value: string) => void;
  timeValue?: string | null; // HH:MM
  onTimeChange?: (value: string) => void;
  className?: string;
  labelDate?: string;
  labelTime?: string;
}

export const DateTimeSelect: React.FC<DateTimeSelectProps> = ({
  serviceType,
  serviceData,
  dateValue,
  onDateChange,
  timeValue,
  onTimeChange,
  className,
  labelDate = "วัน",
  labelTime = "เวลา",
}) => {
  const apiServiceName = toApiServiceType(serviceType);
  const inferredLocation = inferApiLocationFromService(serviceData);
  const dateReady = Boolean(dateValue);

  const { availableSet, isLoading, isError, isDaily, dailyQuota } = useCheckAvailability({
    serviceType,
    locationType: inferredLocation ?? "ONSITE",
    selectedDate: dateValue ?? "",
  });

  const isOffsite = inferredLocation === "OFFSITE";

  // Offsite daily: if quota exists, allow choosing 10:00–20:00 directly
  const offsiteDailyTimes = React.useMemo(() => generateTimeSlots(10, 20), []);

  const onsiteAvailableTimes = React.useMemo(() => {
    // Onsite: show only API-available times within policy (10:00–19:00)
    const STORE_OPEN = 10;
    const LAST_AVAILABLE = 19;
    const base = Array.from(availableSet.values())
      .filter((slot) => {
        const hour = Number(slot.slice(0, 2));
        return hour >= STORE_OPEN && hour <= LAST_AVAILABLE;
      })
      .sort();

    // If selected date is today, filter out past hours so times start from next hour
    try {
      if (dateValue && dateValue === todayStringTZ("Asia/Bangkok")) {
        const nowHour = currentHourTZ("Asia/Bangkok");
        return base.filter((slot) => Number(slot.slice(0, 2)) > nowHour);
      }
    } catch {}

    return base;
  }, [availableSet, dateValue]);

  const dayUnavailable = React.useMemo(() => {
    if (!dateReady) return false; // no date means no status
    // Offsite: daily quota determines availability
    if (isOffsite) {
      if (isDaily) return dailyQuota <= 0;
      // If offsite returns time-based slots (rare), use set size
      return availableSet.size === 0;
    }
    // Onsite: rely on availableSet size
    return onsiteAvailableTimes.length === 0;
  }, [dateReady, isOffsite, isDaily, dailyQuota, availableSet, onsiteAvailableTimes.length]);

  const timeOptions = React.useMemo(() => {
    if (!dateReady) return [] as string[];

    const isToday = (() => {
      try {
        return Boolean(dateValue) && dateValue === todayStringTZ("Asia/Bangkok");
      } catch {
        return false;
      }
    })();
    const nowHour = isToday ? currentHourTZ("Asia/Bangkok") : null;

    if (isOffsite) {
      // Offsite policy: when daily quota exists, show 10:00–20:00 directly
      if (isDaily && dailyQuota > 0) {
        const base = offsiteDailyTimes;
        return isToday ? base.filter((slot) => Number(slot.slice(0, 2)) > (nowHour as number)) : base;
      }
      // If non-daily offsite returns explicit times, show them (filter to 10:00–20:00)
      const base = Array.from(availableSet.values())
        .filter((slot) => {
          const hour = Number(slot.slice(0, 2));
          return hour >= 10 && hour <= 20;
        })
        .sort();
      return isToday ? base.filter((slot) => Number(slot.slice(0, 2)) > (nowHour as number)) : base;
    }
    // Onsite
    return onsiteAvailableTimes;
  }, [dateReady, isOffsite, isDaily, dailyQuota, offsiteDailyTimes, availableSet, onsiteAvailableTimes, dateValue]);

  const selectionDisabled = !dateReady || isLoading;

  const postPreferredTime = React.useCallback(
    async (selectedTime: string) => {
      try {
        if (!dateReady || !selectedTime) return;
        if (!isOffsite) return; // Only post for OFFSITE per requirement
        const rec = (serviceData ?? {}) as Record<string, unknown>;
        const customerName = (rec.customerName as string) ?? (rec.name as string) ?? "";
        const phone = (rec.phone as string) ?? (rec.phoneNumber as string) ?? "";
        const payload = {
          serviceType: apiServiceName,
          type: inferredLocation ?? "OFFSITE",
          date: dateValue,
          time: selectedTime,
          customerName,
          phone,
          extra: { serviceData: rec },
        };
        // Fire-and-forget; do not block UI
        fetch("/api/preferred-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          console.error("post preferred-time failed", err);
        });
      } catch (err) {
        console.error("preferred-time error", err);
      }
    },
    [dateReady, isOffsite, apiServiceName, inferredLocation, dateValue, serviceData],
  );

  return (
    <div className={className ?? "w-full"}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">เลือกวันและเวลา</label>
        {/* <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
          {apiServiceName} · {inferredLocation ?? "-"}
        </span> */}
      </div>

      {/* Date Select */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex w-full flex-col space-y-2">
          <DateSelect value={dateValue} onValueChange={onDateChange} className="h-12 w-full" />
        </div>

        {/* Time Select (shadcn) */}
        <div className="space-y-2">
          <Select
            value={timeValue ?? undefined}
            onValueChange={(v) => {
              onTimeChange?.(v);
              // Auto POST for OFFSITE once time is chosen
              postPreferredTime(v);
            }}
            disabled={selectionDisabled}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue
                placeholder={!dateReady ? "โปรดเลือกวันที่ก่อน" : isLoading ? "กำลังตรวจสอบเวลาว่าง..." : "เลือกเวลา"}
              />
            </SelectTrigger>
            <SelectContent>
              {isError && (
                <SelectItem value="" disabled>
                  ไม่สามารถเช็คเวลาว่างได้
                </SelectItem>
              )}
              {dateReady && dayUnavailable && !isLoading && !isError && (
                <SelectItem value="" disabled>
                  วันนี้ไม่มีคิวว่าง
                </SelectItem>
              )}
              {dateReady &&
                !dayUnavailable &&
                timeOptions.length > 0 &&
                timeOptions.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inline day status (upfront visibility) */}
      <AnimatePresence>
        {dateReady && !isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-gray-600"
          >
            {dayUnavailable ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                <span>วันนี้ไม่มีคิวว่าง</span>
              </>
            ) : isOffsite && isDaily ? (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                <span>บริการนอกสถานที่ · เลือกเวลาได้ทั้งวัน (เหลือ {dailyQuota} สิทธิ์)</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span>มีช่วงเวลาว่างให้เลือก</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimeSelect;
