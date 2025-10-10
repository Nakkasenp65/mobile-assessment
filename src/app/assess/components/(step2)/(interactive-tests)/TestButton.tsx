// src/app/assess/components/(step2)/(interactive-tests)/TestButton.tsx

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { TestStatus } from "../InteractiveTests";

const TestButton = ({
  icon: Icon,
  label,
  status,
  onClick,
  isNextTest,
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      "stroke-width"?: string | number;
    }
  >;
  label: string;
  status: TestStatus;
  onClick: () => void;
  isNextTest: boolean;
}) => {
  // ✨ [แก้ไข] เพิ่ม Logic การตรวจสอบสถานะจาก string
  const isPassed = status.includes("_ok") || status === "passed";
  const isFailed = status.includes("_failed") || status.includes("_defective") || status === "failed";
  const isPending = status === "pending";

  return (
    <motion.button
      onClick={onClick}
      disabled={!isNextTest || !isPending}
      className={cn(
        "relative flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200",
        // ✨ [แก้ไข] เปลี่ยนมาใช้ตัวแปร isPending, isPassed, isFailed
        isPending && "border-border bg-accent",
        isPassed && "border-success bg-success/10",
        isFailed && "border-destructive bg-destructive/10",
        !isNextTest && isPending && "cursor-not-allowed opacity-50",
      )}
      animate={
        isNextTest && isPending
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0px 0px 0px 0px hsl(var(--primary) / 0.3)",
                "0px 0px 0px 5px hsl(var(--primary) / 0)",
                "0px 0px 0px 0px hsl(var(--primary) / 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        <Icon
          className={cn(
            "mb-2 h-8 w-8",
            // ✨ [แก้ไข] เปลี่ยนมาใช้ตัวแปร isPending, isPassed, isFailed
            isPending && "text-primary",
            isPassed && "text-success",
            isFailed && "text-destructive",
          )}
        />
        {!isPending && (
          <motion.div
            className={cn(
              "border-background absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 p-0.5",
              // ✨ [แก้ไข] เปลี่ยนมาใช้ตัวแปร isPassed, isFailed
              isPassed && "bg-success",
              isFailed && "bg-destructive",
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {isPassed && <Check className="text-success-foreground h-3 w-3" />}
            {isFailed && <X className="text-destructive-foreground h-3 w-3" />}
          </motion.div>
        )}
      </div>
      <span
        className={cn(
          "font-medium",
          // ✨ [แก้ไข] เปลี่ยนมาใช้ตัวแปร isPassed, isFailed
          isPassed && "text-success",
          isFailed && "text-destructive",
        )}
      >
        {label}
      </span>
    </motion.button>
  );
};

export default TestButton;
