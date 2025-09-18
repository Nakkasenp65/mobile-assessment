"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Camera, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// =================================================================
// [Props Interface]
// =================================================================
interface InteractiveTestsProps {
  onComplete: () => void;
  onBack: () => void;
}

// =================================================================
// [Sub-Component: TestButton]
// Component ย่อยสำหรับปุ่มทดสอบแต่ละฟังก์ชัน
// =================================================================
interface TestButtonProps {
  icon: React.ElementType;
  label: string;
  passed: boolean;
  onClick: () => void;
}

const TestButton = ({ icon: Icon, label, passed, onClick }: TestButtonProps) => (
  <motion.button
    onClick={onClick}
    className={`w-full flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 h-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      passed ? "border-success bg-success/10" : "border-border bg-accent hover:border-primary/50"
    }`}
    whileTap={{ scale: 0.95 }}
    aria-pressed={passed}
  >
    <div className="relative">
      <Icon className={`w-8 h-8 mb-2 transition-colors ${passed ? "text-success" : "text-primary"}`} />
      {passed && (
        <motion.div
          className="absolute -top-1 -right-1 bg-success rounded-full p-0.5 flex items-center justify-center border-2 border-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="w-3 h-3 text-success-foreground" />
        </motion.div>
      )}
    </div>
    <span className={`font-medium transition-colors ${passed ? "text-success" : "text-foreground"}`}>{label}</span>
  </motion.button>
);

// =================================================================
// [Main Component: InteractiveTests]
// =================================================================
export const InteractiveTests = ({ onComplete, onBack }: InteractiveTestsProps) => {
  const [tests, setTests] = useState({
    speaker: false,
    mic: false,
    camera: false,
  });

  const handleTestClick = (test: keyof typeof tests) => {
    setTests((prev) => ({ ...prev, [test]: !prev[test] }));
  };

  const allTestsPassed = Object.values(tests).every(Boolean);

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ขั้นตอนที่ 3: ทดสอบการใช้งาน</h2>
        <p className="text-muted-foreground">กรุณาตรวจสอบและยืนยันการทำงานของอุปกรณ์</p>
      </div>

      <div className="grid grid-cols-3 gap-4 my-8 min-h-[250px] content-center">
        <TestButton icon={Volume2} label="ลำโพง" passed={tests.speaker} onClick={() => handleTestClick("speaker")} />
        <TestButton icon={Mic} label="ไมโครโฟน" passed={tests.mic} onClick={() => handleTestClick("mic")} />
        <TestButton icon={Camera} label="กล้อง" passed={tests.camera} onClick={() => handleTestClick("camera")} />
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="flex items-center text-foreground rounded-xl h-12 px-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </Button>
        <Button
          onClick={onComplete}
          disabled={!allTestsPassed}
          size="lg"
          className="text-base font-semibold rounded-xl h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 text-primary-foreground shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-pink-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform-gpu hover:-translate-y-1 disabled:transform-none"
        >
          คำนวณราคา
        </Button>
      </div>
    </div>
  );
};
