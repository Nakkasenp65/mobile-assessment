"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Wifi, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NetworkQuality,
  useNetworkStatus,
} from "../../../../../hooks/useNetwork";

// The final status can now be 'ignore'
type ConcludedStatus = NetworkQuality | "ignore";

interface WifiDetectionProps {
  onStatusConcluded: (status: ConcludedStatus) => void;
}

// Internal state for the component's flow
type DetectionPhase =
  | "initializing"
  | "prompt_connect"
  | "checking_quality"
  | "concluded";

const StatusIndicator = ({
  status,
  phase,
}: {
  status: NetworkQuality;
  phase: DetectionPhase;
}) => {
  if (phase === "checking_quality" || phase === "initializing") {
    return (
      <motion.div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
    );
  }

  switch (status) {
    case "excellent":
    case "good":
      return <CheckCircle className="text-success h-5 w-5" />;
    case "poor":
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case "offline":
    case "unknown":
      return <XCircle className="text-destructive h-5 w-5" />;
    default:
      return <div className="h-5 w-5" />;
  }
};

export const WifiDetection = ({ onStatusConcluded }: WifiDetectionProps) => {
  const networkStatus = useNetworkStatus();
  const [phase, setPhase] = useState<DetectionPhase>("initializing");
  const [finalStatus, setFinalStatus] = useState<ConcludedStatus | null>(null);

  // =================================================================
  // [THE FIX - PART 1] - This useEffect now ONLY watches for state changes and successful results.
  // It no longer manages the timeout.
  // =================================================================
  useEffect(() => {
    if (phase === "concluded") return;

    const { type, quality } = networkStatus;

    if (phase === "initializing") {
      if (type === "wifi") {
        setPhase("checking_quality");
      } else if (type !== "unknown" && type !== "evaluating") {
        setPhase("prompt_connect");
      }
      return;
    }

    if (type === "unknown") {
      setPhase("checking_quality");
    }

    if (phase === "checking_quality") {
      const isDefinitiveQuality =
        quality !== "evaluating" && quality !== "unknown";
      if (isDefinitiveQuality) {
        setFinalStatus(quality);
        setPhase("concluded");
        onStatusConcluded(quality);
      }
    }
  }, [networkStatus, phase, onStatusConcluded]);

  console.log("Network Status : ", networkStatus);

  // =================================================================
  // [THE FIX - PART 2] - This new useEffect is a dedicated, uninterruptible timer.
  // It runs ONCE when the phase changes to 'checking_quality'.
  // =================================================================
  useEffect(() => {
    if (phase !== "checking_quality") return;

    const timeoutId = setTimeout(() => {
      // This check runs only if the component is still in the checking phase after 5 seconds.
      if (phase === "checking_quality") {
        setFinalStatus("unknown");
        setPhase("concluded");
        onStatusConcluded("unknown");
      }
    }, 5000);

    // The cleanup function will clear the timer if the phase changes away from 'checking_quality'
    // (e.g., if a successful result was found before the 5 seconds were up).
    return () => clearTimeout(timeoutId);
  }, [phase, onStatusConcluded]);

  const handleSkip = () => {
    setFinalStatus("ignore");
    setPhase("concluded");
    onStatusConcluded("ignore");
  };

  const handleRetry = () => {
    setFinalStatus(null); // Reset final status
    setPhase("initializing");
  };

  const getDisplayMessage = () => {
    if (phase === "initializing") return "กำลังตรวจสอบประเภทการเชื่อมต่อ...";
    if (phase === "prompt_connect")
      return "กรุณาเชื่อมต่อ Wi-Fi เพื่อดำเนินการต่อ";
    if (phase === "concluded" && finalStatus) {
      return finalStatus === "ignore"
        ? "ข้ามการตรวจสอบ Wi-Fi"
        : `ผลลัพธ์: ${finalStatus}`;
    }
    return networkStatus.message;
  };

  return (
    <div className="bg-accent flex min-h-[96px] flex-col justify-center rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Wifi
            className={cn(
              "mr-4 h-5 w-5 transition-colors",
              finalStatus === "offline"
                ? "text-muted-foreground"
                : "text-primary",
            )}
          />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">
              การเชื่อมต่ออินเทอร์เน็ต
            </span>
            <span className="text-muted-foreground min-h-[20px] text-sm">
              {getDisplayMessage()}
            </span>
          </div>
        </div>
        <StatusIndicator
          status={finalStatus || networkStatus.quality}
          phase={phase}
        />
      </div>

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
              className="text-primary cursor-pointer"
            >
              ข้าม
            </Button>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              ลองอีกครั้ง
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WifiDetection;
