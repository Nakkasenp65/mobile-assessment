// icon: React.ForwardRefExoticComponent<
//     Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
//       "stroke-width"?: string | number;
//     }
//   >;

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Mic, Volume2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SpeakerDetection from "./(interactive-tests)/SpeakerDetection";
import MicrophoneDetection from "./(interactive-tests)/MicrophoneDetection";
import CameraDetection from "./(interactive-tests)/CameraDetection";

interface InteractiveTestsProps {
  onComplete: () => void;
  onBack: () => void;
}

type TestName = "speaker" | "mic" | "camera";
type TestStatus = "pending" | "passed" | "failed";

const TestButton = ({
  icon: Icon,
  label,
  status,
  onClick,
  isNextTest,
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      "stroke-width"?: string | number;
    }
  >;
  label: string;
  status: TestStatus;
  onClick: () => void;
  isNextTest: boolean;
}) => (
  <motion.button
    onClick={onClick}
    disabled={!isNextTest || status !== "pending"}
    className={cn(
      "relative flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-200",
      status === "pending" && "border-border bg-accent",
      status === "passed" && "border-success bg-success/10",
      status === "failed" && "border-destructive bg-destructive/10",
      !isNextTest && status === "pending" && "cursor-not-allowed opacity-50",
    )}
    animate={
      isNextTest && status === "pending"
        ? {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0px 0px 0px 0px hsl(var(--primary) / 0.3)",
              "0px 0px 0px 5px hsl(var(--primary) / 0)",
              "0px 0px 0px 0px hsl(var(--primary) / 0)",
            ],
          }
        : {}
    }
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="relative">
      <Icon
        className={cn(
          "mb-2 h-8 w-8",
          status === "pending" && "text-primary",
          status === "passed" && "text-success",
          status === "failed" && "text-destructive",
        )}
      />
      {status !== "pending" && (
        <motion.div
          className={cn(
            "border-background absolute -top-1 -right-1 flex items-center justify-center rounded-full border-2 p-0.5",
            status === "passed" && "bg-success",
            status === "failed" && "bg-destructive",
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {status === "passed" && (
            <Check className="text-success-foreground h-3 w-3" />
          )}
          {status === "failed" && (
            <X className="text-destructive-foreground h-3 w-3" />
          )}
        </motion.div>
      )}
    </div>
    <span
      className={cn(
        "font-medium",
        status === "passed" && "text-success",
        status === "failed" && "text-destructive",
      )}
    >
      {label}
    </span>
  </motion.button>
);

const InteractiveTests = ({ onComplete, onBack }: InteractiveTestsProps) => {
  const testSequence: TestName[] = ["speaker", "mic", "camera"];
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [activeTest, setActiveTest] = useState<TestName | null>(null);
  const [testResults, setTestResults] = useState<Record<TestName, TestStatus>>({
    speaker: "pending",
    mic: "pending",
    camera: "pending",
  });

  const handleConclude = (testName: TestName, result: boolean) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: result ? "passed" : "failed",
    }));
    setActiveTest(null);

    if (currentTestIndex < testSequence.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    }
  };

  const allTestsConcluded = Object.values(testResults).every(
    (status) => status !== "pending",
  );

  const getInstructionText = () => {
    if (allTestsConcluded) {
      return "การทดสอบทั้งหมดเสร็จสิ้นแล้ว";
    }
    const nextTestLabel = {
      speaker: "ลำโพง",
      mic: "ไมโครโฟน",
      camera: "กล้อง",
    }[testSequence[currentTestIndex]];

    return `ขั้นตอนต่อไป: กรุณากดทดสอบ "${nextTestLabel}"`;
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          ขั้นตอนที่ 3: ทดสอบการใช้งาน
        </h2>
        <p className="text-muted-foreground min-h-[24px]">
          {getInstructionText()}
        </p>
      </div>

      <div className="my-8 grid min-h-[250px] grid-cols-3 content-center gap-4">
        <TestButton
          icon={Volume2}
          label="ลำโพง"
          status={testResults.speaker}
          isNextTest={testSequence[currentTestIndex] === "speaker"}
          onClick={() => {
            if (testSequence[currentTestIndex] === "speaker")
              setActiveTest("speaker");
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
            if (testSequence[currentTestIndex] === "camera")
              setActiveTest("camera");
          }}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <Button
          onClick={onComplete}
          disabled={!allTestsConcluded}
          size="lg"
          className="text-primary-foreground shadow-lg... h-12 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold"
        >
          คำนวณราคา
        </Button>
      </div>

      <SpeakerDetection
        isOpen={activeTest === "speaker"}
        onConclude={(result) => handleConclude("speaker", result)}
      />
      <MicrophoneDetection
        isOpen={activeTest === "mic"}
        onConclude={(result) => handleConclude("mic", result)}
      />
      <CameraDetection
        isOpen={activeTest === "camera"}
        onConclude={(result) => handleConclude("camera", result)}
      />
    </div>
  );
};

export default InteractiveTests;
