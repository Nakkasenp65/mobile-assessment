// src/app/assess/components/(step1)/UserDeviceSelection.tsx
"use client";

import { motion } from "framer-motion";
import { Box, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type Selection = "this_device" | "other_device";

interface UserDeviceSelectionProps {
  selectedValue: Selection | null;
  onSelect: (selection: Selection) => void;
}

const UserDeviceSelection = ({ selectedValue, onSelect }: UserDeviceSelectionProps) => (
  <div className="space-y-3">
    <label className="text-foreground block text-center text-lg font-semibold">
      คุณต้องการประเมินอุปกรณ์เครื่องใด?
    </label>
    <div className="grid grid-cols-2 gap-4">
      <motion.button
        onClick={() => onSelect("this_device")}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
          selectedValue === "this_device"
            ? "border-primary bg-primary/10 ring-primary ring-2"
            : "border-border bg-accent/50 hover:border-primary/50",
        )}
        whileTap={{ scale: 0.97 }}
      >
        <Smartphone className="text-primary h-8 w-8" />
        <span className="text-foreground font-medium">ประเมินเครื่องนี้</span>
      </motion.button>
      <motion.button
        onClick={() => onSelect("other_device")}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all",
          selectedValue === "other_device"
            ? "border-secondary bg-secondary/10 ring-secondary ring-2"
            : "border-border bg-accent/50 hover:border-secondary/50",
        )}
        whileTap={{ scale: 0.97 }}
      >
        <Box className="text-secondary h-8 w-8" />
        <span className="text-foreground font-medium">ประเมินเครื่องอื่น</span>
      </motion.button>
    </div>
  </div>
);

export default UserDeviceSelection;
