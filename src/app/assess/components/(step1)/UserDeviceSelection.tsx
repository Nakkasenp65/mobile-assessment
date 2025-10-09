// SECTION: src/app/assess/components/(step1)/UserDeviceSelection.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Box, Smartphone, CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  isSelected,
  imgSrc,
  onSelect,
}: {
  value: Selection;
  title: string;
  isSelected: boolean;
  imgSrc: string;
  onSelect: (selection: Selection) => void;
}) => (
  <motion.button
    onClick={() => {
      setTimeout(() => {
        onSelect(value);
      }, 100);
    }}
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 1000, damping: 10 }}
    className={cn(
      "flex h-full w-full max-w-sm items-center justify-center rounded-4xl border p-4 text-center md:p-8",
      isSelected
        ? "border-primary shadow-primary/20 ring-primary shadow-lg ring-2"
        : "border-border hover:shadow-primary/20 hover:ring-primary shadow-sm hover:border-gray-300 hover:shadow-xl hover:ring-2",
    )}
  >
    <div className="flex flex-col items-center gap-4">
      {/* Text Content */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-32 w-32 items-center justify-center">
          <Image src={imgSrc} width={128} height={128} alt="Device Image" className="h-auto w-full object-contain" />
        </div>
        <h3 className="text-foreground text-base font-semibold">{title}</h3>
      </div>
    </div>
  </motion.button>
);

const UserDeviceSelection = ({ selectedValue, onSelect }: UserDeviceSelectionProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-8 sm:flex-row sm:items-stretch">
    <OptionCard
      value="this_device"
      title="ที่กำลังใช้อยู่"
      imgSrc="/assets/holding-phone.gif"
      isSelected={selectedValue === "this_device"}
      onSelect={onSelect}
    />
    <OptionCard
      value="other_device"
      title="ประเมินเครื่องอื่น"
      imgSrc="/assets/other-phone.gif"
      isSelected={selectedValue === "other_device"}
      onSelect={onSelect}
    />
  </div>
);

export default UserDeviceSelection;
