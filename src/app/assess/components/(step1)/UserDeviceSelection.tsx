// src/app/assess/components/(step1)/UserDeviceSelection.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Box, Smartphone, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the type for the selection value
type Selection = "this_device" | "other_device";

// Define the props for the component
interface UserDeviceSelectionProps {
  selectedValue: Selection | null;
  onSelect: (selection: Selection) => void;
}

// Reusable OptionCard component for a cleaner structure
const OptionCard = ({
  value,
  title,
  Icon,
  isSelected,
  onSelect,
}: {
  value: Selection;
  title: string;
  Icon: LucideIcon;
  isSelected: boolean;
  onSelect: (selection: Selection) => void;
}) => (
  <motion.button
    onClick={() => onSelect(value)}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className={cn(
      "relative h-full max-h-56 w-full flex-grow overflow-hidden rounded-2xl border bg-white p-6 text-left transition-all duration-300",
      isSelected
        ? "border-primary shadow-primary/20 ring-primary shadow-lg ring-2"
        : "border-border shadow-sm hover:border-gray-300 hover:shadow-md",
    )}
  >
    <div className="flex flex-col items-center gap-8">
      {/* Choice */}
      <div
        className={cn(
          "mt-1 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg p-3 transition-colors",
          isSelected ? "bg-primary text-white" : "bg-accent text-accent-foreground",
        )}
      >
        {/* Icon */}
        <Icon className="h-full w-full" />
      </div>
      {/* Title */}
      <div>
        <h3 className="text-foreground text-xl font-semibold">{title}</h3>
      </div>
    </div>
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute top-3 right-3"
        >
          <CheckCircle2 className="text-primary h-6 w-6" fill="white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const UserDeviceSelection = ({ selectedValue, onSelect }: UserDeviceSelectionProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-8 sm:flex-row">
    <OptionCard
      value="this_device"
      title="ประเมินเครื่องนี้
"
      Icon={Smartphone}
      isSelected={selectedValue === "this_device"}
      onSelect={onSelect}
    />
    <OptionCard
      value="other_device"
      title="ประเมินเครื่องอื่น"
      Icon={Box}
      isSelected={selectedValue === "other_device"}
      onSelect={onSelect}
    />
  </div>
);

export default UserDeviceSelection;
