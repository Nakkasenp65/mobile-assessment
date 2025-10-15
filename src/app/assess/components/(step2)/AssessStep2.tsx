// src/app/assess/components/(step2)/AssessStep2.tsx

"use client";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { ASSESSMENT_QUESTIONS, Platform } from "@/util/info";
import { DiagnosticsResult } from "./AutomatedDiagnostics";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import QuestionReport from "./QuestionReport";
import AutomatedDiagnostics from "./AutomatedDiagnostics";
import InteractiveTests from "./InteractiveTests";
import AssessmentLedger from "../(step3)/AssessmentLedger";

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
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onBack: () => void;
  isOwnDevice: boolean;
}

type SubStep = "physical" | "automated" | "interactive" | "review";

export default function AssessStep2({
  deviceInfo,
  conditionInfo,
  onConditionUpdate,
  onNext,
  onBack,
  isOwnDevice,
}: AssessStep2Props) {
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("physical");
  const { isDesktop, isAndroid, isIOS } = useDeviceDetection();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  console.log(conditionInfo);

  // Resolve effective platform considering brand vs current device OS mismatch
  const resolvePlatform = useCallback((): Platform => {
    const targetIsApple = deviceInfo.brand === "Apple";
    const osMismatch = (isAndroid && targetIsApple) || (isIOS && !targetIsApple);
    const isOther = !isOwnDevice || isDesktop || osMismatch;
    if (isOther) return targetIsApple ? "OTHER_IOS" : "OTHER_ANDROID";
    return isIOS ? "SELF_IOS" : "SELF_ANDROID";
  }, [deviceInfo.brand, isOwnDevice, isDesktop, isAndroid, isIOS]);

  const determineNextStep = useCallback(() => {
    const platform = resolvePlatform();
    // For any OTHER platform or desktop, go straight to review
    if (isDesktop || platform === "OTHER_IOS" || platform === "OTHER_ANDROID") {
      setCurrentSubStep("review");
      return;
    }

    // SELF_ANDROID needs permission prompt for automated tests
    if (platform === "SELF_ANDROID") {
      setShowPermissionPrompt(true);
      return;
    }

    // SELF_IOS proceeds to interactive tests
    setCurrentSubStep("interactive");
  }, [isDesktop, resolvePlatform]);

  const handleAllowPermissions = useCallback(() => {
    setShowPermissionPrompt(false);
    setCurrentSubStep("automated");
  }, []);

  const handleCancelPermissions = useCallback(() => {
    setShowPermissionPrompt(false);
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

  const handleTestsCompletion = useCallback(
    (results: Partial<Pick<ConditionInfo, "speaker" | "mic" | "camera" | "touchScreen">>) => {
      onConditionUpdate((prev) => ({
        ...prev,
        ...results,
      }));
    },
    [onConditionUpdate],
  );

  const handleBackNavigation = useCallback(() => {
    if (currentSubStep === "review") {
      setCurrentSubStep(isDesktop || !isOwnDevice ? "physical" : "interactive");
      return;
    }
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
  }, [currentSubStep, isAndroid, isOwnDevice, isDesktop, onBack]);

  const [errors, setErrors] = useState<string[]>([]);

  // Build platform-relevant required choice questions
  const getPlatformRelevantChoiceIds = useCallback((): (keyof ConditionInfo)[] => {
    const platform = resolvePlatform();
    const relevantQuestions = ASSESSMENT_QUESTIONS.flatMap((section) =>
      section.questions.filter((q) => q.platforms.includes(platform)),
    );
    const choiceIds = relevantQuestions.filter((q) => q.type === "choice").map((q) => q.id);
    return choiceIds as (keyof ConditionInfo)[];
  }, [resolvePlatform]);

  const TOGGLE_BEST: Partial<Record<keyof ConditionInfo, string>> = {
    wifi: "wifi_ok",
    charger: "charger_ok",
    touchScreen: "touchscreen_ok",
    mic: "mic_ok",
    speaker: "speaker_ok",
    call: "call_ok",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
    faceId: "biometric_ok",
  };

  const applyPlatformToggleDefaults = useCallback(
    (info: ConditionInfo): ConditionInfo => {
      const platform = resolvePlatform();
      const relevantQuestions = ASSESSMENT_QUESTIONS.flatMap((section) =>
        section.questions.filter((q) => q.platforms.includes(platform)),
      );
      const toggleIds = relevantQuestions.filter((q) => q.type === "toggle").map((q) => q.id as keyof ConditionInfo);
      const next: ConditionInfo = { ...info };
      toggleIds.forEach((id) => {
        const v = next[id] as string;
        if (!v || v === "") {
          const best = TOGGLE_BEST[id];
          if (best) (next as any)[id] = best;
        }
      });
      return next;
    },
    [resolvePlatform],
  );

  const validateSelections = useCallback(
    (info: ConditionInfo) => {
      const msgs: string[] = [];
      const requiredDevice = ["brand", "model", "storage"] as const;
      requiredDevice.forEach((key) => {
        if (!deviceInfo[key]) msgs.push(`กรุณาระบุ ${key}`);
      });

      // Only require platform-relevant CHOICE questions; toggles are defaulted or optional
      const requiredChoiceIds = getPlatformRelevantChoiceIds();
      requiredChoiceIds.forEach((key) => {
        if (!info[key]) msgs.push(`กรุณาตรวจสอบ/ระบุ ${String(key)}`);
      });
      return msgs;
    },
    [deviceInfo, getPlatformRelevantChoiceIds],
  );

  const handleConfirm = useCallback(() => {
    // Default toggles for unanswered items relevant to platform
    const defaulted = applyPlatformToggleDefaults(conditionInfo);
    const msgs = validateSelections(defaulted);
    if (msgs.length > 0) {
      setErrors(msgs);
      return;
    }
    setErrors([]);
    // Persist any defaults before proceeding
    onConditionUpdate(defaulted);
    onNext();
  }, [applyPlatformToggleDefaults, conditionInfo, validateSelections, onConditionUpdate, onNext]);

  // Initialize defaults when entering review state
  useEffect(() => {
    if (currentSubStep === "review") {
      onConditionUpdate((prev) => applyPlatformToggleDefaults(prev));
    }
  }, [currentSubStep, onConditionUpdate, applyPlatformToggleDefaults]);

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
              deviceInfo={deviceInfo}
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
              onFlowComplete={() => setCurrentSubStep("review")}
              onBack={handleBackNavigation}
              onTestsConcluded={handleTestsCompletion}
            />
          )}

          {/* สรุปรายการข้อมูลอุปกรณ์และการยืนยันก่อนดำเนินการต่อ */}
          {currentSubStep === "review" && (
            <div className="flex w-full max-w-3xl flex-col gap-6">
              <div className="rounded-2xl border bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ตรวจสอบสรุปข้อมูลอุปกรณ์ของคุณ
                </h3>
                <AssessmentLedger
                  deviceInfo={deviceInfo}
                  conditionInfo={conditionInfo}
                  repairs={[]}
                  totalCost={0}
                  isLoading={false}
                />
              </div>

              {errors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4" /> กรุณาแก้ไขข้อมูลต่อไปนี้ก่อนดำเนินการต่อ
                  </div>
                  <ul className="list-inside list-disc">
                    {errors.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={handleBackNavigation}
                  className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  กลับไปแก้ไข
                </button>
                <button
                  onClick={handleConfirm}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow hover:brightness-110 active:translate-y-px"
                  aria-label="ยืนยันข้อมูลและดำเนินการต่อ"
                >
                  ยืนยันข้อมูลและดำเนินการต่อ
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
