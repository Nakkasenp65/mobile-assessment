// src/app/assess/components/(step3)/(services)/sell-now-components/AppointmentScheduler.tsx
"use client";

import { useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateSelect } from "@/components/ui/date-select";
import { motion } from "framer-motion";

interface AppointmentSchedulerProps {
  formState: {
    date: string;
    time: string;
  };
  handleInputChange: (field: string, value: string | Date | undefined) => void;
  locationType: "home" | "bts" | "store" | null;
  formVariants: any;
}

export default function AppointmentScheduler({
  formState,
  handleInputChange,
  locationType,
  formVariants,
}: AppointmentSchedulerProps) {
  const storeTimeOptions = useMemo(
    () => [
      { value: "11", label: "11:00" },
      { value: "12", label: "12:00" },
      { value: "13", label: "13:00" },
      { value: "14", label: "14:00" },
      { value: "15", label: "15:00" },
      { value: "16", label: "16:00" },
      { value: "17", label: "17:00" },
      { value: "18", label: "18:00" },
      { value: "19", label: "19:00" },
      { value: "20", label: "20:00" },
    ],
    [],
  );

  const otherTimeOptions = useMemo(
    () => [
      { value: "9", label: "09:00" },
      { value: "10", label: "10:00" },
      { value: "11", label: "11:00" },
      { value: "12", label: "12:00" },
      { value: "13", label: "13:00" },
      { value: "14", label: "14:00" },
      { value: "15", label: "15:00" },
      { value: "16", label: "16:00" },
      { value: "17", label: "17:00" },
      { value: "18", label: "18:00" },
      { value: "19", label: "19:00" },
      { value: "20", label: "20:00" },
    ],
    [],
  );

  const availableTimeOptions = useMemo(() => {
    const allOptions = locationType === "store" ? storeTimeOptions : otherTimeOptions;

    if (!formState.date) {
      return allOptions;
    }

    const selectedDate = new Date(formState.date);
    const now = new Date();

    const isSelectedDateToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();

    if (isSelectedDateToday) {
      const currentHour = now.getHours();
      return allOptions.filter((option) => parseInt(option.value, 10) > currentHour);
    }

    return allOptions;
  }, [formState.date, locationType, storeTimeOptions, otherTimeOptions]);

  useEffect(() => {
    if (formState.time) {
      const isTimeStillAvailable = availableTimeOptions.some((option) => option.value === formState.time);
      if (!isTimeStillAvailable) {
        handleInputChange("time", undefined);
      }
    }
  }, [formState.date, formState.time, availableTimeOptions, handleInputChange]);

  return (
    <motion.div variants={formVariants} className="border-border flex flex-col gap-4 border-b pb-8">
      <Label className="block text-lg font-semibold">เลือกวันและเวลาที่สะดวก</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-sell">วัน</Label>
          <DateSelect
            value={formState.date}
            onValueChange={(value) => handleInputChange("date", value)}
            className="h-12 w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-sell">เวลา</Label>
          <Select value={formState.time} onValueChange={(value) => handleInputChange("time", value)}>
            <SelectTrigger id="time-sell" className="h-12 w-full">
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeOptions.length > 0 ? (
                availableTimeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="text-muted-foreground px-2 py-1.5 text-sm">ไม่มีรอบเวลาสำหรับวันนี้</div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
