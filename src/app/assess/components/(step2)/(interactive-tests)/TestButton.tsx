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
}) => (
  <motion.button
    onClick={onClick}
    disabled={!isNextTest || status !== "pending"}
    className={cn(
      "relative flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200",
      status === "pending" && "border-border bg-accent",
      status === "passed" && "border-success bg-success/10",
      status === "failed" && "border-destructive bg-destructive/10",
      !isNextTest && status === "pending" && "cursor-not-allowed opacity-50",
    )}
    animate={
      isNextTest && status === "pending"
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
          status === "pending" && "text-primary",
          status === "passed" && "text-success",
          status === "failed" && "text-destructive",
        )}
      />
      {status !== "pending" && (
        <motion.div
          className={cn(
            "border-background absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 p-0.5",
            status === "passed" && "bg-success",
            status === "failed" && "bg-destructive",
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {status === "passed" && (
            <Check className="text-success-foreground h-3 w-3" />
          )}
          {status === "failed" && (
            <X className="text-destructive-foreground h-3 w-3" />
          )}
        </motion.div>
      )}
    </div>
    <span
      className={cn(
        "font-medium",
        status === "passed" && "text-success",
        status === "failed" && "text-destructive",
      )}
    >
      {label}
    </span>
  </motion.button>
);

export default TestButton;
