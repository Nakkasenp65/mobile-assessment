// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/ChoicePanel.tsx

"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoicePanelProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ChoicePanel = ({ options, selectedValue, onSelect }: ChoicePanelProps) => {
  const normalStateValue = options[0]?.value;

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {options.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex h-24 w-full flex-col items-center justify-center rounded-xl border p-3 text-center text-left transition-all duration-200",
            "focus-visible:ring-primary focus-visible:ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            selectedValue === option.value
              ? "border-primary bg-primary/10 ring-primary ring-2"
              : "border-border bg-accent/50 hover:border-primary/50 hover:bg-accent",
          )}
          whileTap={{ scale: 0.97 }}
        >
          {/* Aria's touch: Special icon for the "normal" state */}
          {option.value === normalStateValue && <CheckCircle2 className="text-success mb-2 h-6 w-6" />}
          <span className="text-foreground text-sm font-medium">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ChoicePanel;
