// src/app/assess/components/(step2)/QuestionReport.tsx

"use client";
import { useMemo } from "react";
import { ConditionInfo } from "../../page";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
// --- [FIX] อัปเดตการ import ให้ใช้ชุดคำถามใหม่ ---
import { DESKTOP_QUESTIONS, MOBILE_IOS_QUESTIONS, MOBILE_ANDROID_QUESTIONS } from "../../../../util/info";
import DesktopReportForm from "./(interactive-tests)/(platform-based-question)/DesktopReportForm";
import MobileQuestionAccordion from "./(interactive-tests)/(platform-based-question)/MobileQuestionAccordion";

interface QuestionReportProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
  showFullReport: boolean;
}

const QuestionReport = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
  showFullReport,
}: QuestionReportProps) => {
  const { isDesktop, isIOS } = useDeviceDetection();

  // --- [FIX] ปรับปรุง Logic ให้เลือกชุดคำถามสำหรับมือถือได้ถูกต้อง ---
  const mobileQuestions = useMemo(() => {
    if (isIOS) {
      // สำหรับ iOS ใช้ชุดคำถามเต็มรูปแบบ
      return MOBILE_IOS_QUESTIONS;
    }
    // สำหรับ Android ใช้ชุดคำถามที่สั้นกว่า (เพราะมี automated test)
    return MOBILE_ANDROID_QUESTIONS;
  }, [isIOS]);

  return (
    <>
      {isDesktop || showFullReport ? (
        // Render the desktop-specific form
        <DesktopReportForm
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          questions={DESKTOP_QUESTIONS} // ส่งชุดคำถามสำหรับ Desktop
        />
      ) : (
        // Render the mobile-specific accordion form
        <MobileQuestionAccordion
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          questions={mobileQuestions} // ส่งชุดคำถามสำหรับ Mobile
        />
      )}
    </>
  );
};

export default QuestionReport;
