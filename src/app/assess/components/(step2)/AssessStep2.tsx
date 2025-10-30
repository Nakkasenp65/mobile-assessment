// src/app/assess/components/(step2)/AssessStep2.tsx

"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { ASSESSMENT_QUESTIONS, Platform } from "@/util/info";
import { DiagnosticsResult } from "./AutomatedDiagnostics";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import QuestionReport from "./QuestionReport";
import AutomatedDiagnostics from "./AutomatedDiagnostics";
import InteractiveTests from "./InteractiveTests";
import ReviewSummary from "./ReviewSummary";
import SimpleReviewSummary from "./SimpleReviewSummary";
import { useCreateAssessment } from "../../../../hooks/useCreateAssessment";
import { useLiff } from "@/components/Provider/LiffProvider";
import { usePriceCalculation } from "../../../../hooks/usePriceCalculation";
// Permission prompt now handled inside InteractiveTests

/** Modal แจ้งเตือนการขอสิทธิ์ */

interface AssessStep2Props {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onNext: () => void;
  onBack: () => void;
  isOwnDevice: boolean;
}

type SubStep = "physical" | "automated" | "interactive" | "review";

// Valid toggle keys in ConditionInfo
const TOGGLE_KEYS = [
  "wifi",
  "charger",
  "touchScreen",
  "mic",
  "speaker",
  "call",
  "homeButton",
  "sensor",
  "buttons",
  "faceId",
] as const;
type ToggleKey = (typeof TOGGLE_KEYS)[number];
const isToggleKey = (id: keyof ConditionInfo): id is ToggleKey =>
  TOGGLE_KEYS.includes(id as ToggleKey);

// Required device fields per flow
const REQUIRED_DEVICE_APPLE_SIMPLE = ["brand", "model"] as const;
const REQUIRED_DEVICE_DEFAULT = ["brand", "model", "storage"] as const;

export default function AssessStep2({
  deviceInfo,
  conditionInfo,
  onConditionUpdate,
  onBack,
  isOwnDevice,
}: AssessStep2Props) {
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("physical");
  const { isDesktop, isAndroid, isIOS } = useDeviceDetection();
  const { lineUserId } = useLiff(); // ดึง LINE User ID จาก LIFF context
  const { finalPrice } = usePriceCalculation(deviceInfo, conditionInfo);
  const isAppleSpecialDevice =
    deviceInfo.brand === "Apple" &&
    !!deviceInfo.productType &&
    deviceInfo.productType !== "iPhone" &&
    deviceInfo.productType !== "iPad";

  // For Apple-specific devices, jump directly to review summary
  useEffect(() => {
    if (isAppleSpecialDevice) {
      setCurrentSubStep("review");
    }
  }, [isAppleSpecialDevice]);

  // Resolve effective platform considering brand vs current device OS mismatch
  const resolvePlatform = useCallback((): Platform => {
    const targetIsApple = deviceInfo.brand === "Apple";
    const osMismatch = (isAndroid && targetIsApple) || (isIOS && !targetIsApple);
    const isOther = !isOwnDevice || isDesktop || osMismatch;
    if (isOther) return targetIsApple ? "OTHER_IOS" : "OTHER_ANDROID";
    return isIOS ? "SELF_IOS" : "SELF_ANDROID";
  }, [deviceInfo.brand, isOwnDevice, isDesktop, isAndroid, isIOS]);

  const determineNextStep = useCallback(() => {
    // Apple-specific devices skip diagnostics and go straight to review
    if (isAppleSpecialDevice) {
      setCurrentSubStep("review");
      return;
    }
    const platform = resolvePlatform();
    // For any OTHER platform or desktop, go straight to review
    if (isDesktop || platform === "OTHER_IOS" || platform === "OTHER_ANDROID") {
      setCurrentSubStep("review");
      return;
    }

    // SELF_ANDROID goes to automated tests; InteractiveTests will handle permissions later
    if (platform === "SELF_ANDROID") {
      setCurrentSubStep("automated");
      return;
    }

    // SELF_IOS proceeds to interactive tests
    setCurrentSubStep("interactive");
  }, [isDesktop, resolvePlatform, isAppleSpecialDevice]);

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
    // Apple-specific devices: back from review returns to Step 1
    if (isAppleSpecialDevice && currentSubStep === "review") {
      onBack();
      return;
    }
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
  }, [currentSubStep, isAndroid, isOwnDevice, isDesktop, onBack, isAppleSpecialDevice]);

  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutate: createAssessment, isPending } = useCreateAssessment();

  // Build platform-relevant required choice questions
  const getPlatformRelevantChoiceIds = useCallback((): (keyof ConditionInfo)[] => {
    // Apple-specific devices only require minimal fields from SimpleAssessmentForm
    if (isAppleSpecialDevice) {
      return ["warranty", "openedOrRepaired"] as (keyof ConditionInfo)[];
    }
    const platform = resolvePlatform();
    const relevantQuestions = ASSESSMENT_QUESTIONS.flatMap((section) =>
      section.questions.filter((q) => q.platforms.includes(platform)),
    );
    const choiceIds = relevantQuestions.filter((q) => q.type === "choice").map((q) => q.id);
    return choiceIds as (keyof ConditionInfo)[];
  }, [resolvePlatform, isAppleSpecialDevice]);

  const TOGGLE_BEST = useMemo<Partial<Record<ToggleKey, ConditionInfo[ToggleKey]>>>(
    () => ({
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
    }),
    [],
  );

  const applyPlatformToggleDefaults = useCallback(
    (info: ConditionInfo): ConditionInfo => {
      // Do not auto-default toggles for Apple-specific simple flow
      if (isAppleSpecialDevice) return info;
      const platform = resolvePlatform();
      const relevantQuestions = ASSESSMENT_QUESTIONS.flatMap((section) =>
        section.questions.filter((q) => q.platforms.includes(platform)),
      );
      const toggleIds = relevantQuestions
        .filter((q) => q.type === "toggle")
        .map((q) => q.id as keyof ConditionInfo)
        .filter(isToggleKey);
      // Widen the type for indexed assignment over specific toggle keys
      let next: Record<ToggleKey, ConditionInfo[ToggleKey]> & ConditionInfo = { ...info } as Record<
        ToggleKey,
        ConditionInfo[ToggleKey]
      > &
        ConditionInfo;
      toggleIds.forEach((id) => {
        const current = info[id];
        if (current === "") {
          const best = TOGGLE_BEST[id];
          if (best) {
            // Recreate object to avoid control-flow narrowing on indexed assignment
            next = { ...next, [id]: best } as ConditionInfo as Record<
              ToggleKey,
              ConditionInfo[ToggleKey]
            > &
              ConditionInfo;
          }
        }
      });
      return next as ConditionInfo;
    },
    [resolvePlatform, isAppleSpecialDevice, TOGGLE_BEST],
  );

  const validateSelections = useCallback(
    (info: ConditionInfo) => {
      const msgs: string[] = [];
      const requiredDevice = isAppleSpecialDevice
        ? REQUIRED_DEVICE_APPLE_SIMPLE
        : REQUIRED_DEVICE_DEFAULT;
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
    [deviceInfo, getPlatformRelevantChoiceIds, isAppleSpecialDevice],
  );

  const handleConfirm = useCallback(
    (phoneNumber: string, customerName: string) => {
      // Default toggles for unanswered items relevant to platform
      const defaulted = applyPlatformToggleDefaults(conditionInfo);
      const msgs = validateSelections(defaulted);
      if (msgs.length > 0) {
        setErrors(msgs);
        setServerError(null);
        return;
      }
      setErrors([]);
      setServerError(null);
      // Persist any defaults before proceeding
      onConditionUpdate(defaulted);
      // Submit to backend
      createAssessment(
        {
          phoneNumber,
          customerName,
          estimatedValue: finalPrice | 0,
          deviceInfo,
          conditionInfo: defaulted,
          ...(lineUserId && { line_user_id: lineUserId }), // เพิ่ม line_user_id ถ้ามี (เฉพาะผู้ใช้บน LIFF)
        },
        {
          onError: (err) => {
            // Surface server-side validation or network errors
            setServerError(err.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
          },
        },
      );
    },
    [
      applyPlatformToggleDefaults,
      conditionInfo,
      validateSelections,
      onConditionUpdate,
      createAssessment,
      deviceInfo,
      lineUserId,
    ],
  );

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
      {/* PermissionPrompt handled inside InteractiveTests */}

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
          {currentSubStep === "review" &&
            (isAppleSpecialDevice ? (
              <SimpleReviewSummary
                deviceInfo={deviceInfo}
                conditionInfo={conditionInfo}
                errors={errors}
                onBack={handleBackNavigation}
                onConfirm={handleConfirm}
                isSubmitting={isPending}
                serverError={serverError ?? undefined}
              />
            ) : (
              <ReviewSummary
                deviceInfo={deviceInfo}
                conditionInfo={conditionInfo}
                errors={errors}
                onBack={handleBackNavigation}
                onConfirm={handleConfirm}
                isSubmitting={isPending}
                serverError={serverError ?? undefined}
              />
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
