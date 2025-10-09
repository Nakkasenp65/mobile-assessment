"use client";

import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Question, Platform } from "@/util/info"; // ตรวจสอบ Path ให้ถูกต้อง
import { ConditionInfo } from "../../types/device"; // ตรวจสอบ Path ให้ถูกต้อง
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Props Interface ---
interface QuestionWrapperProps {
  question: Question;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (questionId: keyof ConditionInfo, value: string) => void;
}

// --- คอมโพเนนต์ย่อยสำหรับ Choice Input (ไม่มีการเปลี่ยนแปลง) ---
const ChoiceInput = ({ question, currentValue, onSelect }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
    {question.options.map((option) => {
      const isSelected = currentValue === option.id;
      return (
        <motion.button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={cn(
            "flex h-24 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium transition-all duration-200",
            isSelected
              ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
              : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
          )}
        >
          {option.icon && <option.icon className="h-6 w-6" />}
          <span className="font-semibold">{option.label}</span>
        </motion.button>
      );
    })}
  </div>
);

// --- ✨ [แก้ไข] คอมโพเนนต์ย่อยสำหรับ Toggle Input กลับไปใช้ดีไซน์วงกลม + สีใหม่ ---
const ToggleInput = ({ question, currentValue, onToggle }) => {
  const isProblem = currentValue === question.options[1].id; // สมมติว่าตัวเลือกที่ 2 คือ "มีปัญหา"
  const Icon = question.icon;

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      // Container หลัก จัดวาง ไอคอนวงกลม และ ข้อความ ในแนวตั้ง
      className="flex flex-col items-center justify-center gap-2 text-center"
    >
      {/* ส่วนของวงกลม */}
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500",
          isProblem
            ? // สไตล์เมื่อถูกเลือก: พื้นหลัง primary, ไม่มีเส้นขอบ
              "bg-primary shadow-primary/30 border-transparent shadow-lg"
            : // สไตล์ปกติ: พื้นหลัง card, มีเส้นขอบ
              "bg-card border-border",
        )}
      >
        {/* ไอคอนข้างในวงกลม */}
        {Icon && (
          <Icon
            className={cn(
              "h-7 w-7 transition-colors duration-100",
              // เมื่อถูกเลือก ไอคอนเป็นสีขาว (primary-foreground), ปกติเป็นสีเทา
              isProblem ? "text-primary-foreground" : "text-muted-foreground",
            )}
          />
        )}
      </div>
      {/* ข้อความข้างนอกวงกลม */}
      <span className="w-max px-1 text-xs font-bold">{question.question}</span>
    </motion.button>
  );
};

// --- คอมโพเนนต์หลัก (ไม่มีการเปลี่ยนแปลง) ---
const QuestionWrapper = ({ question, conditionInfo, onConditionUpdate }: QuestionWrapperProps) => {
  const { isDesktop, isIOS, isAndroid } = useDeviceDetection();
  const currentPlatform: Platform = isDesktop ? "DESKTOP" : isIOS ? "IOS" : "ANDROID";

  if (!question.platforms.includes(currentPlatform)) {
    return null;
  }

  const handleChange = (value: string) => {
    onConditionUpdate(question.id as keyof ConditionInfo, value);
  };

  const handleToggle = () => {
    const currentValue = conditionInfo[question.id as keyof ConditionInfo] as string;
    const okValue = question.options[0].id;
    const problemValue = question.options[1].id;
    const newValue = currentValue === problemValue ? okValue : problemValue;
    onConditionUpdate(question.id as keyof ConditionInfo, newValue);
  };

  switch (question.type) {
    case "choice":
      return (
        <div className="py-4 first:pt-0">
          <h3 className="text-foreground mb-3 text-base font-semibold md:text-lg">{question.question}</h3>
          <ChoiceInput
            question={question}
            currentValue={conditionInfo[question.id as keyof ConditionInfo] as string}
            onSelect={handleChange}
          />
        </div>
      );
    case "toggle":
      return (
        <ToggleInput
          question={question}
          currentValue={conditionInfo[question.id as keyof ConditionInfo] as string}
          onToggle={handleToggle}
        />
      );
    default:
      return null;
  }
};

export default QuestionWrapper;
