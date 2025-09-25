// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/MobileQuestionAccordion.tsx

"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { ConditionInfo } from "../../../../page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Question } from "../../../../../../util/info";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";

interface MobileQuestionAccordionProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
  questions: Array<{ section: string; questions: Question[] }>;
}

const MobileQuestionAccordion = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
  questions,
}: MobileQuestionAccordionProps) => {
  const allQuestions = useMemo(() => questions.flatMap((section) => section.questions), [questions]);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const findFirstUnanswered = () => {
    return allQuestions.find((q) => !conditionInfo[q.id])?.id || "";
  };

  const [openAccordionValue, setOpenAccordionValue] = useState<string>(findFirstUnanswered);

  useEffect(() => {
    if (openAccordionValue) {
      const element = itemRefs.current[openAccordionValue];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 150);
      }
    }
  }, [openAccordionValue]);

  const handleOptionChange = (questionId: keyof ConditionInfo, value: string) => {
    const updatedConditionInfo = { ...conditionInfo, [questionId]: value };
    onConditionUpdate(updatedConditionInfo);

    const nextUnanswered = allQuestions.find((q) => !updatedConditionInfo[q.id]);
    setOpenAccordionValue(nextUnanswered ? nextUnanswered.id : "");
  };

  const allQuestionsAnswered = allQuestions.every((q) => !!conditionInfo[q.id]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-foreground text-3xl font-bold">ประเมินสภาพเครื่อง</h2>
        <p className="text-muted-foreground">กรุณาตอบคำถามให้ครบทุกข้อ</p>
      </div>

      <div className="flex-grow space-y-6">
        {questions.map((section) => (
          <div key={section.section}>
            <h3 className="text-foreground mb-2 text-lg font-bold">{section.section}</h3>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
              value={openAccordionValue}
              onValueChange={setOpenAccordionValue}
            >
              {section.questions.map((question) => {
                const selectedValue = conditionInfo[question.id];
                const selectedOption = question.options.find((opt) => opt.value === selectedValue);
                const Icon = question.icon; // --- [FIX] ดึงไอคอนประจำคำถามมาใช้ ---

                return (
                  <AccordionItem
                    ref={(el) => {
                      itemRefs.current[question.id] = el;
                    }}
                    value={question.id}
                    key={question.id}
                    className={cn(
                      "bg-card rounded-xl border shadow-sm transition-all duration-300",
                      openAccordionValue === question.id
                        ? "border-primary ring-primary/20 ring-2"
                        : selectedValue
                          ? "border-green-500/50"
                          : "border-border",
                    )}
                  >
                    <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
                      <div className="flex w-full items-center gap-4">
                        {/* --- [FIX] แสดงไอคอนประจำคำถาม และเปลี่ยนสีตามสถานะ --- */}
                        <Icon
                          className={cn(
                            "h-7 w-7 flex-shrink-0 transition-colors",
                            selectedValue
                              ? "text-green-500"
                              : openAccordionValue === question.id
                                ? "text-primary"
                                : "text-slate-400 dark:text-zinc-500",
                          )}
                        />
                        <div className="flex-grow">
                          <p className="text-foreground font-semibold">{question.question}</p>
                          {selectedOption && (
                            <p className="text-primary mt-0.5 text-sm font-semibold dark:text-amber-400">
                              {selectedOption.label}
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="mt-2 flex flex-col gap-2 border-t pt-4 dark:border-zinc-700/50">
                        {question.options.map((option) => (
                          <label
                            key={option.value}
                            className="hover:bg-accent flex cursor-pointer items-center rounded-lg border p-3 transition-colors dark:border-zinc-700 dark:hover:bg-zinc-700/50"
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={selectedValue === option.value}
                              onChange={() => handleOptionChange(question.id, option.value)}
                              className="sr-only"
                            />
                            <div className="border-muted-foreground/50 mr-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2">
                              {selectedValue === option.value && (
                                <div className="bg-primary h-2.5 w-2.5 rounded-full"></div>
                              )}
                            </div>
                            <span className="text-foreground text-sm font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-full border px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-semibold">ย้อนกลับ</span>
        </FramerButton>
        <FramerButton
          onClick={onComplete}
          disabled={!allQuestionsAnswered}
          size="lg"
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ขั้นตอนต่อไป
        </FramerButton>
      </div>
    </div>
  );
};

export default MobileQuestionAccordion;
