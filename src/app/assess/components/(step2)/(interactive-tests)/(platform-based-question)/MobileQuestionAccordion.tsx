"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ConditionInfo } from "../../../../page";
import { ASSESSMENT_QUESTIONS } from "../../../../../../util/info";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";
import QuestionWrapper from "../../../../../../components/ui/QuestionWrapper";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

// Props Interface ไม่เปลี่ยนแปลง
interface MobileQuestionAccordionProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
}

const MobileQuestionAccordion = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
}: MobileQuestionAccordionProps) => {
  const { isDesktop, isIOS, isAndroid } = useDeviceDetection();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. กรองคำถามที่เกี่ยวข้องกับ Platform ปัจจุบัน
  const relevantQuestions = useMemo(() => {
    const currentPlatform = isDesktop ? "DESKTOP" : isIOS ? "IOS" : "ANDROID";
    return ASSESSMENT_QUESTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.platforms.includes(currentPlatform)),
    })).filter((section) => section.questions.length > 0);
  }, [isDesktop, isIOS, isAndroid]);

  const allVisibleQuestions = useMemo(
    () => relevantQuestions.flatMap((s) => s.questions),
    [relevantQuestions],
  );

  // 2. หาคำถามข้อแรกที่ยังไม่ได้ตอบ เพื่อเปิด Accordion รอไว้
  const findFirstUnanswered = () => {
    return allVisibleQuestions.find((q) => !conditionInfo[q.id])?.id || "";
  };

  const [openAccordionValue, setOpenAccordionValue] = useState<string>(findFirstUnanswered);

  // 3. Logic การ Scroll ไปยัง Accordion ที่เปิดอยู่
  useEffect(() => {
    if (openAccordionValue) {
      const element = itemRefs.current[openAccordionValue];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
  }, [openAccordionValue]);

  // 4. ฟังก์ชันสำหรับอัปเดต State และเปลี่ยนไปเปิด Accordion ข้อถัดไป
  const handleUpdate = (questionId: keyof ConditionInfo, value: string | string[]) => {
    const updatedConditionInfo = { ...conditionInfo, [questionId]: value };
    onConditionUpdate(updatedConditionInfo);

    const nextUnanswered = allVisibleQuestions.find((q) => !updatedConditionInfo[q.id]);
    setOpenAccordionValue(nextUnanswered ? nextUnanswered.id : "");
  };

  // 5. ตรวจสอบว่าตอบคำถามครบทุกข้อแล้วหรือยัง
  const isComplete = useMemo(() => {
    return allVisibleQuestions.every((q) => !!conditionInfo[q.id]);
  }, [conditionInfo, allVisibleQuestions]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-foreground text-3xl font-bold">ประเมินสภาพเครื่อง</h2>
        <p className="text-muted-foreground">กรุณาตอบคำถามให้ครบทุกข้อ</p>
      </div>

      <div className="flex-grow space-y-6">
        {relevantQuestions.map((section) => (
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
                const isAnswered = !!selectedValue;

                // หา Label ของคำตอบที่เลือก (สำหรับแสดงผลใน Trigger)
                const getSelectedLabel = () => {
                  if (!selectedValue) return null;
                  if (question.type === "toggle") {
                    // สำหรับ toggle, ถ้ามีปัญหา ให้แสดง label ของ "ปัญหา"
                    return selectedValue === question.options[1].id
                      ? question.options[1].label
                      : null;
                  }
                  return question.options.find((opt) => opt.id === selectedValue)?.label;
                };
                const selectedLabel = getSelectedLabel();

                const Icon = question.icon;

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
                        : isAnswered
                          ? "border-green-500/50"
                          : "border-border",
                    )}
                  >
                    <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
                      <div className="flex w-full items-center gap-4">
                        {isAnswered ? (
                          <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-green-500" />
                        ) : (
                          <Icon
                            className={cn(
                              "h-7 w-7 flex-shrink-0 transition-colors",
                              openAccordionValue === question.id
                                ? "text-primary"
                                : "text-slate-400",
                            )}
                          />
                        )}
                        <div className="flex-grow">
                          <p className="text-foreground font-semibold">{question.question}</p>
                          {selectedLabel && (
                            <p className="text-primary mt-0.5 text-sm font-semibold">
                              {selectedLabel}
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="mt-2 border-t pt-4 dark:border-zinc-700/50">
                        {/* ใช้ QuestionWrapper ในการ Render UI ของคำถาม */}
                        <QuestionWrapper
                          question={question}
                          conditionInfo={conditionInfo}
                          onConditionUpdate={handleUpdate}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="border-border mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground flex h-12 items-center rounded-full border bg-white px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-semibold">ย้อนกลับ</span>
        </FramerButton>
        <FramerButton
          onClick={onComplete}
          disabled={!isComplete}
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
