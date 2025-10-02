"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestionOption } from "../../../../../../util/info";

interface ChoiceBarProps {
  options: QuestionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ChoiceBar = ({ options, selectedValue, onSelect }: ChoiceBarProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const Icon = option.icon;
        // เปลี่ยนมาใช้ option.id ตามโครงสร้างใหม่
        const isSelected = selectedValue === option.id;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center transition-all",
              // ลบ Logic ที่อิงกับ severity ออก และใช้ isSelected เพียงอย่างเดียว
              isSelected
                ? "border-primary bg-primary/10 ring-primary ring-2"
                : "border-border bg-accent/30 hover:border-primary/50",
            )}
          >
            <Icon
              className={cn("h-7 w-7", isSelected ? "text-primary" : "text-muted-foreground")}
            />
            <span
              className={cn(
                "text-xs font-semibold",
                isSelected ? "text-primary" : "text-foreground",
              )}
            >
              {option.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChoiceBar;
