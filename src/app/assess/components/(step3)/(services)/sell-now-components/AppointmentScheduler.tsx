// src/app/assess/components/(step3)/(services)/sell-now-components/AppointmentScheduler.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateSelect } from "@/components/ui/date-select";
import { motion } from "framer-motion";

interface AppointmentSchedulerProps {
  formState: {
    date: string;
  };
  handleInputChange: (field: string, value: string | Date | undefined) => void;
  locationType: "home" | "bts" | "store" | null;
  formVariants: any;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  formState,
  handleInputChange,
  locationType,
  formVariants,
}) => {
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
          <Select onValueChange={(value) => handleInputChange("time", value)}>
            <SelectTrigger id="time-sell" className="h-12 w-full">
              <SelectValue placeholder="เลือกเวลา" />
            </SelectTrigger>
            <SelectContent>
              {locationType === "store" ? (
                <>
                  <SelectItem value="11">11:00</SelectItem>
                  <SelectItem value="12">12:00</SelectItem>
                  <SelectItem value="13">13:00</SelectItem>
                  <SelectItem value="14">14:00</SelectItem>
                  <SelectItem value="15">15:00</SelectItem>
                  <SelectItem value="16">16:00</SelectItem>
                  <SelectItem value="17">17:00</SelectItem>
                  <SelectItem value="18">18:00</SelectItem>
                  <SelectItem value="19">19:00</SelectItem>
                  <SelectItem value="20">20:00</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="9">09:00</SelectItem>
                  <SelectItem value="10">10:00</SelectItem>
                  <SelectItem value="11">11:00</SelectItem>
                  <SelectItem value="12">12:00</SelectItem>
                  <SelectItem value="13">13:00</SelectItem>
                  <SelectItem value="14">14:00</SelectItem>
                  <SelectItem value="15">15:00</SelectItem>
                  <SelectItem value="16">16:00</SelectItem>
                  <SelectItem value="17">17:00</SelectItem>
                  <SelectItem value="18">18:00</SelectItem>
                  <SelectItem value="19">19:00</SelectItem>
                  <SelectItem value="20">20:00</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentScheduler;
