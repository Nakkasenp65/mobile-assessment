// src/components/ui/QuestionWrapper.tsx

"use client";

import { Question } from "@/util/info"; // ตรวจสอบ Path ให้ถูกต้อง
import { ConditionInfo } from "../../types/device"; // ตรวจสอบ Path ให้ถูกต้อง
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Props Interface ---
interface QuestionWrapperProps {
  question: Question;
  conditionInfo: ConditionInfo;
  questionIndex?: number;
  onConditionUpdate: (questionId: keyof ConditionInfo, value: string) => void;
}

// --- คอมโพเนนต์ย่อยสำหรับ Choice Input ---
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

// --- คอมโพเนนต์ย่อยสำหรับ Toggle Input (ดีไซน์วงกลมตามรูปภาพ) ---
const ToggleInput = ({ question, currentValue, onToggle }) => {
  // ✨ Logic นี้จะตรวจสอบว่าค่าปัจจุบันคือค่าที่แสดงถึง "ปัญหา" หรือไม่
  // โดยทั่วไปจะตั้งสมมติฐานว่าตัวเลือกที่สอง (index 1) คือตัวเลือกที่แสดงถึงปัญหา
  const isProblem = currentValue === question.options[1]?.id;
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
            ? // สไตล์เมื่อถูกเลือก (เป็นปัญหา): พื้นหลัง primary, ไม่มีเส้นขอบ
              "bg-primary shadow-primary/30 border-transparent shadow-lg"
            : // สไตล์ปกติ (ไม่เป็นปัญหา): พื้นหลัง card, มีเส้นขอบ
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

// --- คอมโพเนนต์หลัก ---
export default function QuestionWrapper({
  question,
  conditionInfo,
  questionIndex,
  onConditionUpdate,
}: QuestionWrapperProps) {
  // [REMOVED] - ลบการตรวจสอบ platform ที่ซ้ำซ้อนออก
  // คอมโพเนนต์แม่ (DesktopReportForm) ได้ทำการกรองมาแล้ว
  // QuestionWrapper ควรทำหน้าที่แสดงผลเท่านั้น

  const handleChange = (value: string) => {
    onConditionUpdate(question.id as keyof ConditionInfo, value);
  };

  const handleToggle = () => {
    const currentValue = conditionInfo[question.id as keyof ConditionInfo] as string;
    const okValue = question.options[0].id;
    const problemValue = question.options[1].id;
    // ถ้าค่าปัจจุบันคือ "มีปัญหา" ให้เปลี่ยนเป็น "ปกติ", ถ้าไม่ใช่ ให้เปลี่ยนเป็น "มีปัญหา"
    const newValue = currentValue === problemValue ? okValue : problemValue;
    onConditionUpdate(question.id as keyof ConditionInfo, newValue);
  };

  switch (question.type) {
    case "choice":
      return (
        <div className="py-4 first:pt-0">
          <h3 className="text-foreground mb-3 text-base font-semibold md:text-lg">
            {questionIndex}. {question.question}
          </h3>
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
}
