// src/app/assess/components/(step3)/(services)/sell-now-components/AppointmentScheduler.tsx
"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import DateTimeSelect from "@/components/ui/DateTimeSelect";
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
  // Use dynamic availability via TimeSlotSelect. Pass service data so location can be inferred.
  const serviceData = useMemo(
    () => ({
      ...formState,
      locationType,
    }),
    [formState, locationType],
  );

  return (
    <motion.div variants={formVariants} className="border-border flex flex-col gap-4 border-b pb-8">
      <Label className="block text-lg font-semibold">เลือกวันและเวลาที่สะดวก</Label>
      <div className="grid grid-cols-1 gap-4">
        <DateTimeSelect
          serviceType="ซื้อขายมือถือ"
          serviceData={serviceData}
          dateValue={formState.date}
          onDateChange={(value) => handleInputChange("date", value)}
          timeValue={formState.time}
          onTimeChange={(value) => handleInputChange("time", value)}
          className="w-full"
          labelDate="วัน"
          labelTime="เวลา"
        />
      </div>
    </motion.div>
  );
}
