"use client";

import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Question, Platform } from "@/util/info";
import { ConditionInfo } from "../../types/device";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Props Interface ---
interface QuestionWrapperProps {
  question: Question;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (questionId: keyof ConditionInfo, value: string) => void;
}

const ChoiceInput = ({ question, currentValue, onSelect }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
    {question.options.map((option) => (
      // ส่วนปุ่ม
      <button
        key={option.id}
        type="button"
        onClick={() => onSelect(option.id)}
        className={cn(
          "flex h-20 items-center justify-center rounded-2xl border-1 transition-all",
          currentValue === option.id
            ? "border-primary bg-primary/10 ring-primary ring-2"
            : "hover:border-primary/30 bg-orange-500/5",
        )}
      >
        {/* ส่วน icon + label */}
        <div className="flex flex-col items-center gap-2">
          {option.icon && (
            <option.icon className={`h-6 w-6 ${currentValue === option.id ? "text-orange-500" : "text-gray-600"}`} />
          )}
          <span className="text-xs sm:font-bold">{option.label}</span>
        </div>
      </button>
    ))}
  </div>
);

const ToggleInput = ({ question, currentValue, onToggle }) => {
  const isProblem = currentValue === question.options[1].id;
  const Icon = question.icon;

  return (
    <motion.button onClick={onToggle} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
          isProblem ? "border-primary/20 bg-primary/10" : "border-gray-300 bg-white",
        )}
      >
        <Icon className={cn("h-6 w-6", isProblem ? "text-primary" : "text-gray-500")} />
      </div>
      <span className="w-max truncate px-1 text-xs">{question.question}</span>
    </motion.button>
  );
};

const QuestionWrapper = ({ question, conditionInfo, onConditionUpdate }: QuestionWrapperProps) => {
  const { isDesktop, isIOS, isAndroid } = useDeviceDetection();
  const currentPlatform: Platform = isDesktop ? "DESKTOP" : isIOS ? "IOS" : "ANDROID";

  if (!question.platforms.includes(currentPlatform)) {
    return null;
  }

  const handleChange = (value: string) => {
    onConditionUpdate(question.id, value);
  };

  const handleToggle = () => {
    const currentValue = conditionInfo[question.id] as string;
    const okValue = question.options[0].id;
    const problemValue = question.options[1].id;
    const newValue = currentValue === problemValue ? okValue : problemValue;
    onConditionUpdate(question.id, newValue);
  };

  switch (question.type) {
    // แบบ choice เลือกตอบ
    case "choice":
      return (
        <div className="py-4 first:pt-0">
          <h3 className="text-foreground mb-3 font-semibold">{question.question}</h3>
          <ChoiceInput
            question={question}
            currentValue={conditionInfo[question.id] as string}
            onSelect={handleChange}
          />
        </div>
      );
    // แบบปุ่มกดเปิดปิด
    case "toggle":
      return (
        <ToggleInput question={question} currentValue={conditionInfo[question.id] as string} onToggle={handleToggle} />
      );
    default:
      return null;
  }
};

export default QuestionWrapper;
