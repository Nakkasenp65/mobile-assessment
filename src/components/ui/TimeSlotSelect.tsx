// src/components/ui/TimeSlotSelect.tsx
"use client";

import React from "react";
import { useCheckAvailability } from "@/hooks/useCheckAvailability";
import { toApiServiceType, inferApiLocationFromService, computeFallbackDisabled } from "@/util/availability";

export interface TimeSlotSelectProps {
  serviceType: string; // internal key or Thai name
  serviceData: unknown; // service info object to auto-detect location
  selectedDate: string; // YYYY-MM-DD
  value?: string | null; // HH:MM
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}

export const TimeSlotSelect: React.FC<TimeSlotSelectProps> = ({
  serviceType,
  serviceData,
  selectedDate,
  value,
  onChange,
  label = "เวลานัดหมาย",
  className,
}) => {
  const apiServiceName = toApiServiceType(serviceType);
  const inferredLocation = inferApiLocationFromService(serviceData);
  const locationReady = Boolean(inferredLocation);
  const dateReady = Boolean(selectedDate);
  const apiReady = Boolean(process.env.NEXT_PUBLIC_CHECK_AVAILABILITY_URL);

  const { slots, availableSet, isLoading, isError, error, isDaily, dailyQuota } = useCheckAvailability({
    serviceType,
    locationType: inferredLocation ?? "ONSITE",
    selectedDate,
  });

  // When API returns available slots (quota > 0), only show those
  const availableList = React.useMemo(() => {
    if (isDaily) {
      return ["ทั้งวัน"];
    }
    // Store policy: show only 10:00–19:00, as provided by the API
    const STORE_OPEN_HOUR = 10;
    const LAST_AVAILABLE_HOUR = 19;
    return Array.from(availableSet.values())
      .filter((slot) => {
        const hour = Number(slot.slice(0, 2));
        return hour >= STORE_OPEN_HOUR && hour <= LAST_AVAILABLE_HOUR;
      })
      .sort();
  }, [availableSet, isDaily]);

  const disabledByFallback = React.useMemo(() => computeFallbackDisabled(selectedDate, slots), [selectedDate, slots]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  const selectionDisabled = !dateReady || !locationReady || isLoading;

  return (
    <div className={className ?? "w-full max-w-md"}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
          {apiServiceName} · {inferredLocation ?? "-"}
        </span>
      </div>

      <div className="relative">
        <select
          value={value ?? ""}
          onChange={handleChange}
          disabled={selectionDisabled}
          className="w-full rounded border border-gray-300 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
        >
          <option value="" disabled>
            {!dateReady ? "โปรดเลือกวันที่ก่อน" : isLoading ? "กำลังตรวจสอบเวลาว่าง..." : "เลือกเวลา"}
          </option>
          {isError || !apiReady ? (
            // Fallback: show baseline slots, disable past times
            slots.map((slot) => (
              <option key={slot} value={slot} disabled={disabledByFallback.has(slot)}>
                {slot} {disabledByFallback.has(slot) ? "(ไม่ว่าง)" : ""}
              </option>
            ))
          ) : availableList.length > 0 ? (
            availableList.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))
          ) : (
            <option value="" disabled>
              ไม่พบช่วงเวลาที่ว่าง
            </option>
          )}
        </select>

        {isLoading && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <span className="text-xs text-gray-500">กำลังโหลด...</span>
          </div>
        )}
      </div>

      {!dateReady && (
        <p className="mt-2 text-xs text-orange-600">ต้องเลือกวันที่ก่อนจึงจะแสดงช่วงเวลา</p>
      )}
      {!locationReady && (
        <p className="mt-1 text-xs text-orange-600">ไม่สามารถระบุสถานที่รับซื้อจากข้อมูลบริการ</p>
      )}
      {(isError || !apiReady) && (
        <p className="mt-2 text-xs text-red-600">ไม่สามารถเช็คเวลาว่างได้ ระบบจะใช้เวลาโดยประมาณตามเวลาปัจจุบัน</p>
      )}

      {error && !isLoading && (
        <p className="mt-1 text-[11px] text-gray-500">{String(error)}</p>
      )}
      {isDaily && !isLoading && !isError && (
        <p className="mt-1 text-[11px] text-gray-600">รูปแบบนอกสถานที่ (ทั้งวัน) · โควตา {dailyQuota}</p>
      )}
    </div>
  );
};

export default TimeSlotSelect;