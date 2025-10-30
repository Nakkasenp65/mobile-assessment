"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { th } from "date-fns/locale";

interface DateSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function DateSelect({ value, onValueChange, className }: DateSelectProps) {
  // สร้างวันที่ 5 วันถัดจากวันปัจจุบัน
  const today = new Date();
  const dateOptions = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(today, i);
    return {
      value: format(date, "yyyy-MM-dd"), // ค่าที่เก็บใน state
      label: format(date, "d MMMM yyyy", { locale: th }), // ข้อความที่แสดง เช่น "7 ตุลาคม 2568"
    };
  });

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="เลือกวัน" />
      </SelectTrigger>
      <SelectContent>
        {dateOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="h-12">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
