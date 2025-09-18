"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBattery } from "../../../../../hooks/useBattery";
import { Button } from "@/components/ui/button";

type ConcludedStatus = "success" | "unsupported" | "ignore" | "failed";

interface BatteryDetectionProps {
  onStatusConcluded: (status: ConcludedStatus) => void;
}

// Internal state for the component's flow
type DetectionPhase = "prompt_connect" | "charging_progress" | "concluded";

const BatteryDetection = ({ onStatusConcluded }: BatteryDetectionProps) => {
  const batteryStatus = useBattery();
  const [phase, setPhase] = useState<DetectionPhase>("prompt_connect");
  const [progress, setProgress] = useState(0); // 0 to 3
  const [finalStatus, setFinalStatus] = useState<ConcludedStatus | null>(null);

  useEffect(() => {
    if (phase === "concluded") return;
    if (!batteryStatus.isSupported) {
      setFinalStatus("unsupported");
      setPhase("concluded");
      return;
    }
    if (batteryStatus.charging && phase === "prompt_connect") {
      setPhase("charging_progress");
    }
    if (!batteryStatus.charging && phase === "charging_progress") {
      setPhase("prompt_connect");
      setProgress(0);
    }
  }, [batteryStatus, phase]);

  useEffect(() => {
    if (phase !== "charging_progress") return;
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 3) {
          clearInterval(intervalId);
          setFinalStatus("success");
          setPhase("concluded");
        }
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [phase]);

  useEffect(() => {
    if (finalStatus) {
      onStatusConcluded(finalStatus);
    }
  }, [finalStatus, onStatusConcluded]);

  const handleSkip = () => {
    setFinalStatus("ignore");
    setPhase("concluded");
  };

  const handleFailure = () => {
    setFinalStatus("failed");
    setPhase("concluded");
  };

  const getDisplayMessage = () => {
    if (finalStatus === "unsupported") return "ไม่สามารถตรวจสอบแบตเตอรี่ได้";
    if (finalStatus === "ignore") return "ข้ามการตรวจสอบการชาร์จ";
    if (finalStatus === "failed") return "ผลลัพธ์: การชาร์จมีปัญหา";
    if (finalStatus === "success") return "ผลลัพธ์: การชาร์จทำงานปกติ";
    if (phase === "prompt_connect")
      return "กรุณาเสียบสายชาร์จเพื่อเริ่มการทดสอบ";
    if (phase === "charging_progress") return "กำลังยืนยันการชาร์จ...";
    return "กำลังเตรียมการ...";
  };

  const FinalStatusIndicator = () => {
    if (phase !== "concluded") return null;
    if (finalStatus === "success")
      return <CheckCircle className="text-success h-5 w-5" />;
    if (finalStatus === "failed")
      return <XCircle className="text-destructive h-5 w-5" />;
    return <div className="h-5 w-5" />; // Placeholder for ignore/unsupported
  };

  return (
    <div className="bg-accent flex min-h-[96px] flex-col justify-center rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap
            className={cn(
              "mr-4 h-5 w-5 transition-colors",
              phase === "prompt_connect" && !finalStatus
                ? "text-muted-foreground"
                : "text-primary",
            )}
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">การชาร์จไฟ</span>
            <span className="text-muted-foreground min-h-[20px] text-sm">
              {getDisplayMessage()}
            </span>
          </div>
        </div>
        <FinalStatusIndicator />
      </div>

      {phase === "charging_progress" && (
        <div className="flex w-full gap-1 pt-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted h-2 flex-1 overflow-hidden rounded-full"
            >
              <motion.div
                className="bg-success h-full"
                initial={{ width: "0%" }}
                animate={{ width: progress >= i ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {phase === "prompt_connect" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-end space-x-2 pt-2"
          >
            <Button
              variant="link"
              size="sm"
              onClick={handleSkip}
              className="text-primary"
            >
              ข้าม
            </Button>
            <Button variant="outline" size="sm" onClick={handleFailure}>
              การชาร์จมีปัญหา
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatteryDetection;
