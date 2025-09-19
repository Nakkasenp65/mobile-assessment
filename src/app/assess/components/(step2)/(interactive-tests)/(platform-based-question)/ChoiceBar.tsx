"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestionOption } from "../../../../../../util/info";

interface ChoiceBarProps {
  options: QuestionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

// [FIX] Aria's touch: A color map to link severity to our design system.
const severityClasses = {
  positive: {
    container: "border-success bg-success/10 ring-success text-success",
    icon: "text-success",
  },
  warning: {
    container:
      "border-orange-500 bg-orange-500/10 ring-orange-500 text-orange-600",
    icon: "text-orange-500",
  },
  negative: {
    container:
      "border-destructive bg-destructive/10 ring-destructive text-destructive",
    icon: "text-destructive",
  },
};

const ChoiceBar = ({ options, selectedValue, onSelect }: ChoiceBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedValue === option.value;
        // Default to 'positive' if severity is not defined
        const severity = option.severity || "positive";
        const selectedClasses = severityClasses[severity];

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex h-16 w-26 flex-col items-center justify-center rounded-lg border p-2 text-center transition-all duration-200",
              "focus-visible:ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              // [FIX] Implement semantic coloring based on selection and severity
              isSelected
                ? `${selectedClasses.container} ring-2`
                : "border-border bg-accent/50 hover:border-primary/50 hover:bg-accent",
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Icon
              className={cn(
                "mb-1 h-6 w-6 transition-colors",
                // [FIX] Icon color also changes based on selection and severity
                isSelected ? selectedClasses.icon : "text-muted-foreground",
              )}
              weight="duotone"
            />
            <span
              className={cn(
                "text-xs leading-tight font-medium transition-colors",
                // [FIX] Text color also changes when selected
                isSelected ? selectedClasses.container : "text-foreground",
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
