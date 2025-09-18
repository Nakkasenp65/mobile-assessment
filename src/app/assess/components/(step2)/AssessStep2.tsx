"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConditionInfo } from "../../page"; // โปรดตรวจสอบ Path ของ Type ให้ถูกต้องตามโครงสร้างโปรเจกต์ของท่าน
import { DiagnosticsResult } from "./AutomatedDiagnostics";

// Import a new sub-components
import PhysicalReport from "./PhysicalReport";
import AutomatedDiagnostics from "./AutomatedDiagnostics";
import InteractiveTests from "./InteractiveTests";

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

  // Aria's touch: Variants for phase transitions
  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Kaia's insight: A centralized back navigation logic for a predictable user experience.
  const handleBackNavigation = () => {
    if (currentSubStep === "interactive") {
      setCurrentSubStep("automated");
    } else if (currentSubStep === "automated") {
      setCurrentSubStep("physical");
    } else {
      onBack(); // Go back to AssessStep1
    }
  };

  return (
    // Silas's structure: The 'card-assessment' acts as the main container for the wizard.
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
            <PhysicalReport
              conditionInfo={conditionInfo}
              onConditionUpdate={onConditionUpdate}
              onComplete={() => setCurrentSubStep("automated")}
              onBack={handleBackNavigation}
            />
          )}

          {currentSubStep === "automated" && (
            <AutomatedDiagnostics
              onComplete={handleAutomatedComplete}
              onBack={handleBackNavigation}
              onDiagnosticsComplete={handleDiagnosticsCompletion}
            />
          )}

          {currentSubStep === "interactive" && (
            <InteractiveTests
              onComplete={onNext}
              onBack={handleBackNavigation}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssessStep2;
