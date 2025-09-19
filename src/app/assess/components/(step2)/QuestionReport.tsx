"use client";
import { useMemo } from "react";
import { ConditionInfo } from "../../page";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import {
  PHYSICAL_QUESTIONS,
  IOS_MANUAL_QUESTIONS,
  DESKTOP_QUESTIONS,
} from "../../../../util/info";
import DesktopReportForm from "./(interactive-tests)/(platform-based-question)/DesktopReportForm";
import MobileQuestionAccordion from "./(interactive-tests)/(platform-based-question)/MobileQuestionAccordion";

interface QuestionReportProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (
    info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo),
  ) => void;
  onComplete: () => void;
  onBack: () => void;
}

const QuestionReport = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
}: QuestionReportProps) => {
  const { isDesktop, isIOS } = useDeviceDetection();

  // Silas's logic: Use useMemo to efficiently determine the correct set of questions for mobile devices.
  const mobileQuestions = useMemo(() => {
    if (isIOS) {
      // For iOS, combine physical checks with manual connectivity checks.
      return [...PHYSICAL_QUESTIONS, ...IOS_MANUAL_QUESTIONS];
    }
    // For Android, only physical checks are needed as automated tests will follow.
    return PHYSICAL_QUESTIONS;
  }, [isIOS]);

  return (
    <>
      {isDesktop ? (
        // Render the desktop-specific form
        <DesktopReportForm
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          questions={DESKTOP_QUESTIONS}
        />
      ) : (
        // Render the mobile-specific accordion form
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
