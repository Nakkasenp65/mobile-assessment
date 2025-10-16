// src/app/assess/components/(step2)/QuestionReport.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import DesktopReportForm from "./(interactive-tests)/(platform-based-question)/DesktopReportForm";
import MobileQuestionAccordion from "./(interactive-tests)/(platform-based-question)/MobileQuestionAccordion";
import FramerButton from "../../../../components/ui/framer/FramerButton";

interface QuestionReportProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
  showFullReport: boolean;
}

const IcloudLockWarning = ({ onAcknowledge, onBack }: { onAcknowledge: () => void; onBack: () => void }) => (
  <motion.div
    className="flex w-full max-w-xl flex-col items-center justify-center text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="relative mt-16 overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-500/10 p-10 shadow-xl backdrop-blur-sm">
      {/* floating sparkle accents */}
      <div className="pointer-events-none absolute -top-4 -left-4 h-24 w-24 animate-pulse rounded-full bg-amber-300/20 blur-2xl" />
      <div className="pointer-events-none absolute -right-4 -bottom-4 h-24 w-24 animate-pulse rounded-full bg-amber-300/20 blur-2xl" />

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20 ring-8 ring-amber-400/10">
        <ShieldAlert className="h-10 w-10 text-amber-400 drop-shadow-lg" />
      </div>

      <h2 className="mt-6 bg-gradient-to-r from-amber-900 to-amber-600 bg-clip-text text-xl font-extrabold text-transparent dark:from-amber-200 dark:to-amber-400">
        แจ้งเตือนสำคัญ: เจอ iCloud Lock!
      </h2>

      <p className="text-md mt-3 leading-relaxed text-amber-800/90 dark:text-amber-200/90">
        เรา<span className="font-bold text-amber-900 dark:text-amber-100">ไม่รับซื้อ</span>เครื่องที่ล็อค iCloud
        <span className="font-bold">ทุกกรณี</span> แต่คุณยังสามารถประเมินเพื่อใช้บริการซ่อมได้นะ✨
      </p>

      <FramerButton
        onClick={onAcknowledge}
        size="lg"
        className="mt-8 h-14 transform-gpu rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-10 text-lg font-bold text-white shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        ไปประเมินกันเลย
      </FramerButton>
      <FramerButton
        onClick={onBack}
        size="lg"
        variant="ghost"
        className="mt-4 h-14 transform-gpu rounded-full px-10 text-lg font-bold text-gray-600 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md dark:text-gray-400"
      >
        ย้อนกลับ
      </FramerButton>
    </div>
  </motion.div>
);

export default function QuestionReport({
  deviceInfo,
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
  showFullReport,
}: QuestionReportProps) {
  const { isDesktop } = useDeviceDetection();
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const isIcloudLockedAppleDevice = deviceInfo.brand === "Apple" && !conditionInfo.canUnlockIcloud;

  if (isIcloudLockedAppleDevice && !acknowledged) {
    return <IcloudLockWarning onAcknowledge={() => setAcknowledged(true)} onBack={onBack} />;
  }

  return (
    <>
      {isDesktop ? (
        <DesktopReportForm
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
        />
      ) : (
        <MobileQuestionAccordion
          deviceInfo={deviceInfo}
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          showFullReport={showFullReport}
        />
      )}
    </>
  );
}
