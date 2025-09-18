"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkQuality } from "../../../../hooks/useNetwork"; // Import Type
import WifiDetection from "./(automated-components)/WifiDetection";
import BatteryDetection from "./(automated-components)/BatteryDetection";

export interface DiagnosticsResult {
  wifi: WifiStatus;
  charger: BatteryStatus;
}

interface AutomatedDiagnosticsProps {
  onComplete: () => void;
  onBack: () => void;
  onDiagnosticsComplete: (result: DiagnosticsResult) => void;
}

// Define the possible concluded statuses for each test
type WifiStatus = NetworkQuality | "ignore";
type BatteryStatus = "success" | "unsupported" | "ignore" | "failed";

const AutomatedDiagnostics = ({
  onComplete,
  onBack,
  onDiagnosticsComplete,
}: AutomatedDiagnosticsProps) => {
  const [wifiFinalStatus, setWifiFinalStatus] = useState<WifiStatus | null>(
    null,
  );
  const [batteryFinalStatus, setBatteryFinalStatus] =
    useState<BatteryStatus | null>(null);

  const handleWifiConcluded = useCallback((status: WifiStatus) => {
    setWifiFinalStatus(status);
  }, []);

  const handleBatteryConcluded = useCallback((status: BatteryStatus) => {
    setBatteryFinalStatus(status);
  }, []);

  // The completion logic now depends on the final statuses of both checks.
  useEffect(() => {
    const allTestsConcluded =
      wifiFinalStatus !== null && batteryFinalStatus !== null;

    if (allTestsConcluded) {
      onDiagnosticsComplete({
        wifi: wifiFinalStatus,
        charger: batteryFinalStatus,
      });

      const completionTimer = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => clearTimeout(completionTimer);
    }
  }, [wifiFinalStatus, batteryFinalStatus, onComplete, onDiagnosticsComplete]);

  const allTestsConcluded =
    wifiFinalStatus !== null && batteryFinalStatus !== null;

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          ขั้นตอนที่ 2: ตรวจสอบอัตโนมัติ
        </h2>
        <p className="text-muted-foreground">
          ระบบกำลังตรวจสอบการเชื่อมต่อพื้นฐานของเครื่อง
        </p>
      </div>

      <div className="my-8 flex min-h-[250px] flex-col justify-center space-y-4">
        <WifiDetection onStatusConcluded={handleWifiConcluded} />
        <BatteryDetection onStatusConcluded={handleBatteryConcluded} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 cursor-pointer items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <Button
          disabled
          size="lg"
          className="h-12 w-[180px] cursor-pointer rounded-xl px-8"
        >
          {allTestsConcluded ? (
            "เสร็จสิ้น"
          ) : (
            <>
              <motion.div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              กำลังตรวจสอบ...
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedDiagnostics;
