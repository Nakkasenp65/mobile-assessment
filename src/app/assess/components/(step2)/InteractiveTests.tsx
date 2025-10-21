// src/app/assess/components/(step2)/InteractiveTests.tsx

"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Mic, Volume2, Camera, PenTool } from "lucide-react";
import SpeakerDetection from "./(interactive-tests)/SpeakerDetection";
import MicrophoneDetection from "./(interactive-tests)/MicrophoneDetection";
import CameraDetection from "./(interactive-tests)/CameraDetection";
import { TouchscreenTest } from "./(interactive-tests)/TouchscreenTest";
import TestButton from "./(interactive-tests)/TestButton";
import { ConditionInfo } from "../../../../types/device";
import FramerButton from "../../../../components/ui/framer/FramerButton";
import PermissionPrompt from "./PermissionPrompt";

export type TestName = "speaker" | "mic" | "camera" | "touchScreen";

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
  // (Removed raw touchscreen percentage state; we only store pass/fail now)
  // Permission prompt states (appear once per session)
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("it_perm_shown") !== "1";
  });
  const [isPermissionRequesting, setIsPermissionRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const requestMediaPermissions = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        // Request both audio and video; browsers will coalesce prompts
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        return { ok: true };
      }
      return { ok: false, error: "อุปกรณ์นี้ไม่รองรับการขอสิทธิ์กล้อง/ไมโครโฟน" };
    } catch (err: unknown) {
      // Fallback: attempt video-only and audio-only individually
      let videoOk = false;
      let audioOk = false;
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        videoOk = true;
      } catch {}
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        audioOk = true;
      } catch {}
      if (videoOk || audioOk) return { ok: true };

      let errorName: string | undefined;
      if (err && typeof err === "object" && "name" in err) {
        errorName = (err as { name?: string }).name;
      }
      const message = errorName === "NotAllowedError"
        ? "คุณปฏิเสธการอนุญาต โปรดอนุญาตจากการตั้งค่าเบราว์เซอร์แล้วลองใหม่"
        : errorName === "NotFoundError"
        ? "ไม่พบกล้องหรือไมโครโฟนในอุปกรณ์นี้"
        : "ไม่สามารถขอสิทธิ์ได้ โปรดลองอีกครั้ง";
      console.warn("Media permission request failed", err);
      return { ok: false, error: message };
    }
  }, []);

  const handlePermissionAllow = useCallback(async () => {
    setIsPermissionRequesting(true);
    setPermissionError("");
    const { ok, error } = await requestMediaPermissions();
    setIsPermissionRequesting(false);
    if (ok) {
      setShowPermissionPrompt(false);
      if (typeof window !== "undefined") window.sessionStorage.setItem("it_perm_shown", "1");
    } else {
      setPermissionError(error ?? "เกิดข้อผิดพลาดในการขอสิทธิ์");
    }
  }, [requestMediaPermissions]);

  const handlePermissionCancel = useCallback(() => {
    setShowPermissionPrompt(false);
    if (typeof window !== "undefined") window.sessionStorage.setItem("it_perm_shown", "1");
  }, []);

  const handleTestConcluded = useCallback(
    (testName: TestName, result: string | number) => {
      console.log(testName, result);
      setActiveTest(null);

      let resultStatus: TestStatus = "pending";

      if (testName === "touchScreen" && typeof result === "number") {
        resultStatus = result >= 90 ? "touchscreen_ok" : "touchscreen_failed";
      } else if (typeof result === "string") {
        resultStatus = result;
      }

      setTestResults((prevResults) => ({
        ...prevResults,
        [testName]: resultStatus,
      }));

      setCurrentTestIndex((prevIndex) =>
        prevIndex < testSequence.length - 1 ? prevIndex + 1 : prevIndex,
      );
    },
    [testSequence.length],
  );

  const allTestsConcluded = Object.values(testResults).every((status) => status !== "pending");

  useEffect(() => {
    if (allTestsConcluded) {
      // ✨ ส่งค่าสถานะที่ถูกต้องจาก testResults สำหรับทุกอย่าง
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
      {/* One-time Permission Prompt */}
      <PermissionPrompt
        open={showPermissionPrompt}
        onAllow={handlePermissionAllow}
        onCancel={handlePermissionCancel}
        isRequesting={isPermissionRequesting}
        error={permissionError}
      />

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
