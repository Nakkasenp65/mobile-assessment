import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "../../../../lib/utils";
import type { Selection } from "./UserDeviceSelection";

interface OptionCardProps {
  value: Selection;
  title: string;
  isSelected: boolean;
  imgSrc: string;
  onSelect: (selection: Selection) => void;
}

export default function OptionCard({ value, title, isSelected, imgSrc, onSelect }: OptionCardProps) {
  return (
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
}
