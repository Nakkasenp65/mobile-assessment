// src/app/assess/components/(step2)/InteractiveTests.tsx

"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Mic, Volume2, Camera, PenTool } from "lucide-react";
import SpeakerDetection from "./(interactive-tests)/SpeakerDetection";
import MicrophoneDetection from "./(interactive-tests)/MicrophoneDetection";
import CameraDetection from "./(interactive-tests)/CameraDetection";
import { TouchscreenTest } from "./(interactive-tests)/TouchscreenTest";
import TestButton from "./(interactive-tests)/TestButton";
import { ConditionInfo } from "../../page";
import FramerButton from "../../../../components/ui/framer/FramerButton";

export type TestName = "speaker" | "mic" | "camera" | "touchScreen";

// ✨ [แก้ไข] เปลี่ยน TestStatus เป็น string
export type TestStatus = string;

interface InteractiveTestsProps {
  onFlowComplete: () => void;
  onBack: () => void;
  onTestsConcluded: (
    results: Partial<Pick<ConditionInfo, "speaker" | "mic" | "camera" | "touchScreen">>,
  ) => void;
}

const InteractiveTests = ({ onFlowComplete, onBack, onTestsConcluded }: InteractiveTestsProps) => {
  const testSequence = useMemo<TestName[]>(() => ["speaker", "mic", "camera", "touchScreen"], []);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [activeTest, setActiveTest] = useState<TestName | null>(null);
  const [testResults, setTestResults] = useState<Record<TestName, TestStatus>>({
    speaker: "pending",
    mic: "pending",
    camera: "pending",
    touchScreen: "pending",
  });
  const [touchscreenPercentage, setTouchscreenPercentage] = useState<number | null>(null);

  // ✨ [แก้ไข] ปรับ handler ให้รองรับค่า result ที่เป็น string หรือ number
  const handleTestConcluded = useCallback(
    (testName: TestName, result: string | number) => {
      console.log(testName, result);
      setActiveTest(null);

      if (testName === "touchScreen" && typeof result === "number") {
        setTouchscreenPercentage(result);
        const resultStatus = result >= 90 ? "touchscreen_ok" : "touchscreen_failed";
        setTestResults((prevResults) => ({
          ...prevResults,
          touchScreen: resultStatus,
        }));
      } else if (typeof result === "string") {
        setTestResults((prevResults) => ({
          ...prevResults,
          [testName]: result,
        }));
      }

      setCurrentTestIndex((prevIndex) =>
        prevIndex < testSequence.length - 1 ? prevIndex + 1 : prevIndex,
      );
    },
    [testSequence.length],
  );

  const allTestsConcluded = Object.values(testResults).every((status) => status !== "pending");

  useEffect(() => {
    if (allTestsConcluded) {
      onTestsConcluded({
        speaker: testResults.speaker,
        mic: testResults.mic,
        camera: testResults.camera,
        // ✨ [แก้ไข] ส่งค่า % สำหรับ Touchscreen เหมือนเดิม
        touchScreen: `${touchscreenPercentage}%`,
      });
    }
  }, [allTestsConcluded, testResults, touchscreenPercentage, onTestsConcluded]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2 className="text-foreground text-xl font-bold">ขั้นตอนที่ 3: ทดสอบการใช้งาน</h2>
      </div>

      <div className="my-8 grid min-h-[250px] grid-cols-2 content-center gap-4 md:grid-cols-4">
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

      <div className="mt-8 flex items-center justify-between">
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
      <MicrophoneDetection
        isOpen={activeTest === "mic"}
        onConclude={(result) => handleTestConcluded("mic", result)}
      />
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
