// src/app/assess/components/(step2)/QuestionReport.tsx
// คำถามเปลี่ยนไปตาม แพลตฟอร์ม

"use client";
import { useMemo } from "react";
import { ConditionInfo } from "../../page";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import {
  DESKTOP_QUESTIONS,
  MOBILE_IOS_QUESTIONS,
  MOBILE_ANDROID_QUESTIONS,
} from "../../../../util/info";
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

  const mobileQuestions = useMemo(() => {
    if (isIOS) {
      return MOBILE_IOS_QUESTIONS;
    }
    return MOBILE_ANDROID_QUESTIONS;
  }, [isIOS]);

  return (
    <>
      {isDesktop || showFullReport ? (
        <DesktopReportForm
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          questions={DESKTOP_QUESTIONS}
        />
      ) : (
        <MobileQuestionAccordion
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          questions={mobileQuestions}
        />
      )}
    </>
  );
};

export default QuestionReport;
