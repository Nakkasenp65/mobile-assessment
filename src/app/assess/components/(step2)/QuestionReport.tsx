// src/app/assess/components/(step2)/QuestionReport.tsx

"use client";
import { ConditionInfo } from "../../../../types/device";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
// Removed unnecessary imports for old question sets
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
  const { isDesktop } = useDeviceDetection();

  // The logic to select different question sets is no longer needed here.
  // The child components (DesktopReportForm and MobileQuestionAccordion)
  // will now handle filtering questions based on the current platform internally.

  return (
    <>
      {isDesktop || showFullReport ? (
        // Render the desktop-specific form
        <DesktopReportForm
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          // The 'questions' prop is no longer needed as the component handles it
        />
      ) : (
        // Render the mobile-specific accordion form
        <MobileQuestionAccordion
          conditionInfo={conditionInfo}
          onConditionUpdate={onConditionUpdate}
          onComplete={onComplete}
          onBack={onBack}
          // The 'questions' prop is no longer needed as the component handles it
        />
      )}
    </>
  );
};

export default QuestionReport;
