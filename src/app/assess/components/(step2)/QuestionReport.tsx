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

const IcloudLockWarning = ({ onAcknowledge }: { onAcknowledge: () => void }) => (
  <motion.div
    className="flex w-full max-w-lg flex-col items-center justify-center text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
        <ShieldAlert className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-amber-900 dark:text-amber-200">ข้อควรทราบ: เครื่องติด iCloud</h2>
      <p className="text-md text-muted-foreground mt-2">
        ทางร้าน <span className="font-semibold">ไม่รับซื้อเครื่องที่ติดล็อค iCloud</span> ทุกกรณี อย่างไรก็ตาม
        ท่านยังสามารถประเมินสภาพเครื่องเพื่อรับบริการซ่อมได้
      </p>
      <FramerButton
        onClick={onAcknowledge}
        size="lg"
        className="mt-6 h-12 transform-gpu rounded-full bg-amber-500 px-8 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-600 disabled:transform-none"
      >
        ประเมินเพื่อรับบริการซ่อม
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
    return <IcloudLockWarning onAcknowledge={() => setAcknowledged(true)} />;
  }

  // ✨ [MODIFIED] เปลี่ยน Logic การแสดงผล
  // - ถ้าเป็น Desktop: ใช้ DesktopReportForm เหมือนเดิม
  // - ถ้าเป็น Mobile: ใช้ MobileQuestionAccordion สำหรับทุกกรณี (ทั้งประเมินเครื่องตัวเองและเครื่องอื่น)
  //   โดยส่ง prop `showFullReport` เข้าไปเพื่อให้ MobileQuestionAccordion รู้ว่าต้องแสดงคำถามชุดไหน
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
