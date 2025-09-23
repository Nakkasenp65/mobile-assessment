"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";
import { NetworkQuality } from "../../../../hooks/useNetwork";
import WifiDetection from "./(automated-components)/WifiDetection";
import BatteryDetection from "./(automated-components)/BatteryDetection";
import FramerButton from "../../../../components/ui/framer/FramerButton";

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

/** แบนเนอร์แจ้งเตือนด้านบน */
function PermissionBanner({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mb-4 rounded-xl border border-amber-200/70 bg-amber-50 p-3 text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p className="text-sm">
              กรุณาอนุญาตการเข้าถึง <span className="font-semibold">กล้อง</span>{" "}
              และ <span className="font-semibold">ไมโครโฟน</span>{" "}
              เมื่อเบราว์เซอร์มีคำขอสิทธิ์
              เพื่อให้การประเมินอัตโนมัติทำงานได้อย่างถูกต้อง
            </p>
            <button
              onClick={onClose}
              className="ml-auto rounded-lg px-2 text-xs font-semibold text-amber-900/70 hover:text-amber-900 dark:text-amber-200/80 dark:hover:text-amber-100"
            >
              ปิด
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

  // แสดงแบนเนอร์คำเตือนเมื่อเข้าหน้านี้
  const [showBanner, setShowBanner] = useState(true);

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

      <PermissionBanner
        show={showBanner}
        onClose={() => setShowBanner(false)}
      />

      <div className="my-8 flex min-h-[250px] flex-col justify-center space-y-4">
        <WifiDetection onStatusConcluded={handleWifiConcluded} />
        <BatteryDetection onStatusConcluded={handleBatteryConcluded} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 cursor-pointer items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </FramerButton>
        <FramerButton
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
        </FramerButton>
      </div>
    </div>
  );
};

export default AutomatedDiagnostics;
