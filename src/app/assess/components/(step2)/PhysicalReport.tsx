"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ConditionInfo } from "../../page"; // โปรดตรวจสอบ Path ของ Type ให้ถูกต้องตามโครงสร้างโปรเจกต์ของท่าน
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils"; // โปรดตรวจสอบ Path ของ utility function ให้ถูกต้อง

// =================================================================
// [Data Source]
// ข้อมูลคำถามทั้งหมดสำหรับเฟสนี้
// =================================================================
interface Question {
  id: keyof ConditionInfo;
  question: string;
  options: Array<{ value: string; label: string }>;
}

const CONDITION_QUESTIONS: Array<{ section: string; questions: Question[] }> = [
  {
    section: "สภาพหน้าจอ",
    questions: [
      {
        id: "screenGlass",
        question: "สภาพกระจกหน้าจอเป็นอย่างไร?",
        options: [
          { value: "perfect", label: "ไม่มีรอยขีดข่วน" },
          { value: "minor", label: "รอยขีดข่วนเล็กน้อย" },
          { value: "cracked", label: "กระจกแตก" },
        ],
      },
      {
        id: "screenDisplay",
        question: "คุณภาพการแสดงผลหน้าจอ?",
        options: [
          { value: "perfect", label: "แสดงผลปกติทุกจุด" },
          { value: "spots", label: "มีจุดดำ, เส้น, หรือสีเพี้ยน" },
          { value: "not_working", label: "หน้าจอไม่แสดงผล" },
        ],
      },
    ],
  },
  {
    section: "ตัวเครื่องและการทำงาน",
    questions: [
      {
        id: "powerOn",
        question: "การเปิดเครื่อง?",
        options: [
          { value: "yes", label: "เปิด-ปิดเครื่องได้ปกติ" },
          { value: "sometimes", label: "เปิดติดบ้างไม่ติดบ้าง" },
        ],
      },
      {
        id: "cameras",
        question: "การทำงานของกล้อง?",
        options: [
          { value: "all_work", label: "กล้องทุกตัวทำงานปกติ" },
          { value: "some_work", label: "กล้องบางตัวมีปัญหา" },
          { value: "not_work", label: "กล้องไม่ทำงาน" },
        ],
      },
    ],
  },
];

const allQuestions = CONDITION_QUESTIONS.flatMap(
  (section) => section.questions,
);

// =================================================================
// [Main Component: PhysicalReport] - ACCORDION REWORK
// =================================================================
interface PhysicalReportProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (
    info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo),
  ) => void;
  onComplete: () => void;
  onBack: () => void;
}

const PhysicalReport = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
}: PhysicalReportProps) => {
  const [openAccordionValue, setOpenAccordionValue] = useState<string>(
    allQuestions[0]?.id || "",
  );

  const handleOptionChange = (
    questionId: keyof ConditionInfo,
    value: string,
  ) => {
    // Step 1: Calculate the new state object based on the current `conditionInfo` prop.
    const newState = { ...conditionInfo, [questionId]: value };

    // Step 2: Pass the complete new state object to the parent component.
    // This is a clean state update with no side effects.
    onConditionUpdate(newState);

    // Step 3: Now, perform the logic to update the local state (`openAccordionValue`).
    // This logic runs *after* the parent's state update has been dispatched.
    const currentIdx = allQuestions.findIndex((q) => q.id === questionId);
    const nextQuestion = allQuestions.find(
      (q, idx) => idx > currentIdx && !newState[q.id],
    );

    if (nextQuestion) {
      setOpenAccordionValue(nextQuestion.id);
    } else {
      // If there are no more unanswered questions, close the accordion.
      setOpenAccordionValue("");
    }
  };

  const allQuestionsAnswered = allQuestions.every((q) => !!conditionInfo[q.id]);

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          ขั้นตอนที่ 1: ประเมินสภาพภายนอก
        </h2>
        <p className="text-muted-foreground">
          กรุณาตอบคำถามเพื่อประเมินสภาพเครื่อง
        </p>
      </div>

      <div className="flex-grow space-y-2">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionValue}
          onValueChange={setOpenAccordionValue}
        >
          {allQuestions.map((question) => {
            const selectedValue = conditionInfo[question.id];
            const selectedOption = question.options.find(
              (opt) => opt.value === selectedValue,
            );

            return (
              <AccordionItem
                value={question.id}
                key={question.id}
                className="mt-4 border-b-0"
              >
                <AccordionTrigger
                  className={cn(
                    "rounded-xl p-4 transition-colors hover:no-underline",
                    openAccordionValue === question.id
                      ? "bg-accent"
                      : "hover:bg-accent/50",
                    selectedValue && "bg-accent/70",
                  )}
                >
                  <div className="flex w-full items-center text-left">
                    <CheckCircle2
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300",
                        selectedValue ? "text-success" : "text-muted",
                      )}
                    />
                    <div className="flex-grow">
                      <p className="text-foreground font-medium">
                        {question.question}
                      </p>
                      {selectedOption && (
                        <p className="text-primary mt-1 text-sm font-semibold">
                          {selectedOption.label}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 pt-2 pb-4">
                  <div className="space-y-2 pt-2">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className="hover:bg-accent/50 flex cursor-pointer items-center rounded-xl border p-4"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={selectedValue === option.value}
                          onChange={() =>
                            handleOptionChange(question.id, option.value)
                          }
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2",
                            selectedValue === option.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/50",
                          )}
                        >
                          {selectedValue === option.value && (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-foreground text-base">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 cursor-pointer items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <Button
          onClick={onComplete}
          disabled={!allQuestionsAnswered}
          size="lg"
          className="text-primary-foreground h-12 transform-gpu cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:opacity-50 disabled:shadow-none"
        >
          ขั้นตอนต่อไป
        </Button>
      </div>
    </div>
  );
};
export default PhysicalReport;
