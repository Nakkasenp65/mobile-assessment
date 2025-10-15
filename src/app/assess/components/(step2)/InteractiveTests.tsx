// src/app/assess/components/(step2)/InteractiveTests.tsx

"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Volume2, Camera, PenTool, Info } from "lucide-react";
import SpeakerDetection from "./(interactive-tests)/SpeakerDetection";
import MicrophoneDetection from "./(interactive-tests)/MicrophoneDetection";
import CameraDetection from "./(interactive-tests)/CameraDetection";
import { TouchscreenTest } from "./(interactive-tests)/TouchscreenTest";
import TestButton from "./(interactive-tests)/TestButton";
import { ConditionInfo } from "../../../../types/device";
import FramerButton from "../../../../components/ui/framer/FramerButton";

export type TestName = "speaker" | "mic" | "camera" | "touchScreen";

export type TestStatus = string;

interface InteractiveTestsProps {
  onFlowComplete: () => void;
  onBack: () => void;
  onTestsConcluded: (results: Partial<Pick<ConditionInfo, "speaker" | "mic" | "camera" | "touchScreen">>) => void;
}

const InteractiveTests = ({ onFlowComplete, onBack, onTestsConcluded }: InteractiveTestsProps) => {
  const testSequence = useMemo<TestName[]>(() => ["speaker", "mic", "camera", "touchScreen"], []);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [activeTest, setActiveTest] = useState<TestName | null>(null);
  const [showPermBanner, setShowPermBanner] = useState(true);
  const [testResults, setTestResults] = useState<Record<TestName, TestStatus>>({
    speaker: "pending",
    mic: "pending",
    camera: "pending",
    touchScreen: "pending",
  });
  // State to store the raw percentage, though we won't pass it up directly anymore
  const [touchscreenPercentage, setTouchscreenPercentage] = useState<number | null>(null);

  const handleTestConcluded = useCallback(
    (testName: TestName, result: string | number) => {
      console.log(testName, result);
      setActiveTest(null);

      let resultStatus: TestStatus = "pending";

      if (testName === "touchScreen" && typeof result === "number") {
        setTouchscreenPercentage(result); // Store raw percentage
        resultStatus = result >= 90 ? "touchscreen_ok" : "touchscreen_failed";
      } else if (typeof result === "string") {
        resultStatus = result;
      }

      setTestResults((prevResults) => ({
        ...prevResults,
        [testName]: resultStatus,
      }));

      setCurrentTestIndex((prevIndex) => (prevIndex < testSequence.length - 1 ? prevIndex + 1 : prevIndex));
    },
    [testSequence.length],
  );

  const allTestsConcluded = Object.values(testResults).every((status) => status !== "pending");

  useEffect(() => {
    if (allTestsConcluded) {
      // ✨ [แก้ไข] ส่งค่าสถานะที่ถูกต้องจาก testResults สำหรับทุกอย่าง
      onTestsConcluded({
        speaker: testResults.speaker as ConditionInfo["speaker"],
        mic: testResults.mic as ConditionInfo["mic"],
        camera: testResults.camera as ConditionInfo["camera"],
        touchScreen: testResults.touchScreen as ConditionInfo["touchScreen"],
      });
    }
  }, [allTestsConcluded, testResults, onTestsConcluded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Head */}
      <div className="py-2 text-center">
        <h2 className="text-foreground text-xl font-bold">ขั้นตอนที่ 3: ทดสอบการใช้งาน</h2>
      </div>

      {/* Permission Banner */}
      <AnimatePresence>
        {showPermBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mx-4 mb-2 rounded-xl border border-amber-200/70 bg-amber-50 p-3 text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div className="text-sm">
                <p className="mb-1">
                  จำเป็นต้องอนุญาตการเข้าถึง <span className="font-semibold">กล้อง</span> และ <span className="font-semibold">ไมโครโฟน</span> เพื่อดำเนินการทดสอบแบบโต้ตอบอย่างถูกต้อง
                </p>
                <p className="mb-1">
                  สิทธิ์ที่ต้องขอ: การใช้งานกล้องสำหรับตรวจจับใบหน้า และการใช้งานไมโครโฟนสำหรับตรวจสอบการบันทึกเสียง
                </p>
                <p>
                  ข้อมูลสิทธิ์จะใช้เฉพาะภายในหน้าทดสอบนี้เพื่อการประเมินคุณภาพเครื่อง ไม่ถูกบันทึกหรือส่งออกไปภายนอกโดยไม่ได้รับอนุญาต
                </p>
              </div>
              <button
                onClick={() => setShowPermBanner(false)}
                className="ml-auto rounded-lg px-2 text-xs font-semibold text-amber-900/70 hover:text-amber-900 dark:text-amber-200/80 dark:hover:text-amber-100"
              >
                ปิด
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Buttons */}
      <div className="my-8 grid min-h-[250px] grid-cols-2 content-center gap-4 px-8 md:grid-cols-4">
        <TestButton
          icon={Volume2}
          label="ลำโพง"
          status={testResults.speaker}
          isNextTest={testSequence[currentTestIndex] === "speaker"}
          onClick={() => {
            if (testSequence[currentTestIndex] === "speaker") setActiveTest("speaker");
          }}
        />
        <TestButton
          icon={Mic}
          label="ไมโครโฟน"
          status={testResults.mic}
          isNextTest={testSequence[currentTestIndex] === "mic"}
          onClick={() => {
            if (testSequence[currentTestIndex] === "mic") setActiveTest("mic");
          }}
        />
        <TestButton
          icon={Camera}
          label="กล้อง"
          status={testResults.camera}
          isNextTest={testSequence[currentTestIndex] === "camera"}
          onClick={() => {
            if (testSequence[currentTestIndex] === "camera") setActiveTest("camera");
          }}
        />
        <TestButton
          icon={PenTool}
          label="ระบบสัมผัส"
          status={testResults.touchScreen}
          isNextTest={testSequence[currentTestIndex] === "touchScreen"}
          onClick={() => {
            if (testSequence[currentTestIndex] === "touchScreen") setActiveTest("touchScreen");
          }}
        />
      </div>

      {/* Navigation */}
      <div className="flex w-full items-center justify-between py-2">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </FramerButton>
        <FramerButton
          onClick={onFlowComplete}
          disabled={!allTestsConcluded}
          size="lg"
          className="text-primary-foreground shadow-lg... h-12 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold"
        >
          คำนวณราคา
        </FramerButton>
      </div>

      <SpeakerDetection
        isOpen={activeTest === "speaker"}
        onConclude={(result) => handleTestConcluded("speaker", result)}
      />
      <MicrophoneDetection isOpen={activeTest === "mic"} onConclude={(result) => handleTestConcluded("mic", result)} />
      <CameraDetection
        isOpen={activeTest === "camera"}
        onConclude={(result) => handleTestConcluded("camera", result)}
      />
      <TouchscreenTest
        isOpen={activeTest === "touchScreen"}
        onConclude={(result) => handleTestConcluded("touchScreen", result)}
      />
    </div>
  );
};

export default InteractiveTests;
