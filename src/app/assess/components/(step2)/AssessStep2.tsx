// src/app/assess/components/(step2)/AssessStep2.tsx

"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConditionInfo } from "../../../../types/device";
import { DiagnosticsResult } from "./AutomatedDiagnostics";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import QuestionReport from "./QuestionReport";
import AutomatedDiagnostics from "./AutomatedDiagnostics";
import InteractiveTests from "./InteractiveTests";

/** Modal แจ้งเตือนการขอสิทธิ์ */
function PermissionPrompt({ open, onAllow, onCancel }: { open: boolean; onAllow: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        key="modal"
        className="fixed inset-0 z-50 grid place-items-center px-4"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl backdrop-blur-md dark:bg-zinc-900/90">
          <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">อนุญาตกล้องและไมโครโฟน</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            เพื่อทำการประเมินอัตโนมัติอย่างถูกต้อง กรุณา{" "}
            <span className="font-semibold">อนุญาตการเข้าถึงกล้องและไมโครโฟน</span>{" "}
            เมื่อเบราว์เซอร์มีหน้าต่างขอสิทธิ์ขึ้นมา
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              ภายหลัง
            </button>
            <button
              onClick={onAllow}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 active:translate-y-px"
            >
              ตกลง
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface AssessStep2Props {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onBack: () => void;
  isOwnDevice: boolean;
}

type SubStep = "physical" | "automated" | "interactive";

const AssessStep2 = ({ conditionInfo, onConditionUpdate, onNext, onBack, isOwnDevice }: AssessStep2Props) => {
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("physical");
  const { isDesktop, isAndroid } = useDeviceDetection();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  const determineNextStep = useCallback(() => {
    if (isDesktop || !isOwnDevice) {
      onNext();
      return;
    }

    if (isAndroid) {
      setShowPermissionPrompt(true);
      return;
    }

    setCurrentSubStep("interactive");
  }, [isOwnDevice, isDesktop, isAndroid, onNext]);

  const handleAllowPermissions = useCallback(() => {
    setShowPermissionPrompt(false);
    setCurrentSubStep("automated");
  }, []);

  /** ถ้ากดยกเลิกใน modal ให้อยู่ที่ physical ต่อไป */
  const handleCancelPermissions = useCallback(() => {
    setShowPermissionPrompt(false);
    // no-op: คงอยู่ใน physical
  }, []);

  const handleAutomatedComplete = useCallback(() => setCurrentSubStep("interactive"), []);

  const handleDiagnosticsCompletion = useCallback(
    (result: DiagnosticsResult) => {
      onConditionUpdate((prev) => ({
        ...prev,
        wifi: result.wifi === "excellent" || result.wifi === "good" ? "wifi_ok" : "wifi_failed",
        charger: result.charger === "passed" ? "charger_ok" : "charger_failed",
      }));
    },
    [onConditionUpdate],
  );

  // ✨ [แก้ไข] ปรับ Type ของ parameter `results` ให้ถูกต้อง
  const handleTestsCompletion = useCallback(
    (results: Partial<Pick<ConditionInfo, "speaker" | "mic" | "camera" | "touchScreen">>) => {
      // ✨ [แก้ไข] Logic ภายในง่ายขึ้นมาก แค่รวม object เข้าไปเลย
      onConditionUpdate((prev) => ({
        ...prev,
        ...results,
      }));
    },
    [onConditionUpdate],
  );

  const handleBackNavigation = useCallback(() => {
    if (currentSubStep === "interactive") {
      if (isOwnDevice && isAndroid) {
        setCurrentSubStep("automated");
      } else {
        setCurrentSubStep("physical");
      }
    } else if (currentSubStep === "automated") {
      setCurrentSubStep("physical");
    } else {
      onBack();
    }
  }, [currentSubStep, isAndroid, isOwnDevice, onBack]);

  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const showFullReport = isDesktop || !isOwnDevice;

  return (
    <div className="md:border-border flex flex-1 flex-col items-center justify-center rounded-xl md:p-2">
      {/* แจ้งเตือนอนุญาตการใช้ ไมโครโฟนและกล้อง */}
      <PermissionPrompt
        open={showPermissionPrompt}
        onAllow={handleAllowPermissions}
        onCancel={handleCancelPermissions}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubStep}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex w-full flex-col items-center justify-start"
        >
          {/* (ถามทุกแพลตฟอร์ม) เลือกตอบ */}
          {currentSubStep === "physical" && (
            <QuestionReport
              conditionInfo={conditionInfo}
              onConditionUpdate={onConditionUpdate}
              onComplete={determineNextStep}
              onBack={handleBackNavigation}
              showFullReport={showFullReport}
            />
          )}

          {/* ตรวจสอบการชาร์จและไวไฟ */}
          {currentSubStep === "automated" && (
            <AutomatedDiagnostics
              onComplete={handleAutomatedComplete}
              onBack={handleBackNavigation}
              onDiagnosticsComplete={handleDiagnosticsCompletion}
            />
          )}

          {/* ตรวจสอบ ลำโพง ไมโครโฟน และ การระบายหน้าจอ */}
          {currentSubStep === "interactive" && (
            <InteractiveTests
              onFlowComplete={onNext}
              onBack={handleBackNavigation}
              onTestsConcluded={handleTestsCompletion}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssessStep2;
