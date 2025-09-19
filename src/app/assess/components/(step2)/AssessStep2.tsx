"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConditionInfo } from "../../page";
import { DiagnosticsResult } from "./AutomatedDiagnostics";

import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import QuestionReport from "./QuestionReport";
import AutomatedDiagnostics from "./AutomatedDiagnostics";
import InteractiveTests, { TestName, TestStatus } from "./InteractiveTests"; // Import types

interface AssessStep2Props {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (
    info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo),
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

type SubStep = "physical" | "automated" | "interactive";

const AssessStep2 = ({
  conditionInfo,
  onConditionUpdate,
  onNext,
  onBack,
}: AssessStep2Props) => {
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("physical");
  const { isDesktop, isAndroid } = useDeviceDetection();

  const handleQuestionReportComplete = useCallback(() => {
    if (isDesktop) {
      onNext();
    } else if (isAndroid) {
      setCurrentSubStep("automated");
    } else {
      setCurrentSubStep("interactive");
    }
  }, [isDesktop, isAndroid, onNext]);

  const handleAutomatedComplete = useCallback(
    () => setCurrentSubStep("interactive"),
    [],
  );

  const handleDiagnosticsCompletion = useCallback(
    (result: DiagnosticsResult) => {
      onConditionUpdate((prev) => ({
        ...prev,
        wifi: result.wifi,
        charger: result.charger,
      }));
    },
    [onConditionUpdate],
  );

  // [FIX] New callback handler for interactive test results.
  const handleTestsCompletion = useCallback(
    (results: Record<TestName, TestStatus>) => {
      onConditionUpdate((prev) => ({
        ...prev,
        cameras: results.camera,
        speaker: results.speaker,
        mic: results.mic,
      }));
    },
    [onConditionUpdate],
  );

  const handleBackNavigation = useCallback(() => {
    if (currentSubStep === "interactive") {
      if (isAndroid) setCurrentSubStep("automated");
      else setCurrentSubStep("physical");
    } else if (currentSubStep === "automated") {
      setCurrentSubStep("physical");
    } else {
      onBack();
    }
  }, [currentSubStep, isAndroid, onBack]);

  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="card-assessment flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubStep}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentSubStep === "physical" && (
            <QuestionReport
              conditionInfo={conditionInfo}
              onConditionUpdate={onConditionUpdate}
              onComplete={handleQuestionReportComplete}
              onBack={handleBackNavigation}
            />
          )}

          {isAndroid && currentSubStep === "automated" && (
            <AutomatedDiagnostics
              onComplete={handleAutomatedComplete}
              onBack={handleBackNavigation}
              onDiagnosticsComplete={handleDiagnosticsCompletion}
            />
          )}

          {currentSubStep === "interactive" && (
            <InteractiveTests
              onFlowComplete={onNext} // [FIX] Renamed prop
              onBack={handleBackNavigation}
              onTestsConcluded={handleTestsCompletion} // [FIX] Pass the new handler
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssessStep2;
