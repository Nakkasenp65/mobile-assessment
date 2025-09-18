"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ConditionInfo } from "../../page"; // โปรดตรวจสอบ Path ของ Type ให้ถูกต้องตามโครงสร้างโปรเจกต์ของท่าน
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

const allQuestions = CONDITION_QUESTIONS.flatMap((section) => section.questions);

// =================================================================
// [Main Component: PhysicalReport] - ACCORDION REWORK
// =================================================================
interface PhysicalReportProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const PhysicalReport = ({ conditionInfo, onConditionUpdate, onComplete, onBack }: PhysicalReportProps) => {
  const [openAccordionValue, setOpenAccordionValue] = useState<string>(allQuestions[0]?.id || "");

  const handleOptionChange = (questionId: keyof ConditionInfo, value: string) => {
    onConditionUpdate((prev) => {
      const newState = { ...prev, [questionId]: value };

      const currentIdx = allQuestions.findIndex((q) => q.id === questionId);
      const nextQuestion = allQuestions.find((q, idx) => idx > currentIdx && !newState[q.id]);

      if (nextQuestion) {
        setOpenAccordionValue(nextQuestion.id);
      } else {
        setOpenAccordionValue("");
      }

      return newState;
    });
  };

  const allQuestionsAnswered = allQuestions.every((q) => !!conditionInfo[q.id]);

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ขั้นตอนที่ 1: ประเมินสภาพภายนอก</h2>
        <p className="text-muted-foreground">กรุณาตอบคำถามเพื่อประเมินสภาพเครื่อง</p>
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
            const selectedOption = question.options.find((opt) => opt.value === selectedValue);

            return (
              <AccordionItem value={question.id} key={question.id} className="border-b-0 mt-4">
                <AccordionTrigger
                  className={cn(
                    "p-4 rounded-xl transition-colors hover:no-underline",
                    openAccordionValue === question.id ? "bg-accent" : "hover:bg-accent/50",
                    selectedValue && "bg-accent/70"
                  )}
                >
                  <div className="flex items-center text-left w-full">
                    <CheckCircle2
                      className={cn(
                        "w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-300",
                        selectedValue ? "text-success" : "text-muted"
                      )}
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-foreground">{question.question}</p>
                      {selectedOption && (
                        <p className="text-sm text-primary font-semibold mt-1">{selectedOption.label}</p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-2">
                  <div className="space-y-2 pt-2">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-accent/50"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={selectedValue === option.value}
                          onChange={() => handleOptionChange(question.id, option.value)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center",
                            selectedValue === option.value ? "border-primary bg-primary" : "border-muted-foreground/50"
                          )}
                        >
                          {selectedValue === option.value && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-foreground text-base">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-border pt-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center text-foreground rounded-xl h-12 px-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </Button>
        <Button
          onClick={onComplete}
          disabled={!allQuestionsAnswered}
          size="lg"
          className="text-base font-semibold rounded-xl h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 text-primary-foreground shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-pink-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300 transform-gpu hover:-translate-y-1 disabled:transform-none"
        >
          ขั้นตอนต่อไป
        </Button>
      </div>
    </div>
  );
};
