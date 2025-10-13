// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/MobileQuestionAccordion.tsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { ConditionInfo, DeviceInfo } from "../../../../../../types/device";
import { ASSESSMENT_QUESTIONS, Platform } from "../../../../../../util/info";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import QuestionWrapper from "@/components/ui/QuestionWrapper";

interface MobileQuestionAccordionProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
  showFullReport: boolean;
}

const MobileQuestionAccordion = ({
  deviceInfo,
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
  showFullReport,
}: MobileQuestionAccordionProps) => {
  const { isDesktop, isIOS } = useDeviceDetection();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const relevantQuestions = useMemo(() => {
    // ✨ [REFACTORED] อัปเดต Logic การดึง Platform ให้สอดคล้องกับ info.ts ใหม่
    const getTargetPlatforms = (): Platform[] => {
      // กรณีประเมินเครื่องอื่นบนมือถือ (เหมือน Desktop)
      if (showFullReport) {
        const platforms: Platform[] = ["UNIVERSAL", "MANUAL_INPUT"];
        if (deviceInfo.brand === "Apple") {
          platforms.push("IOS");
        } else {
          platforms.push("ANDROID");
        }
        return platforms;
      }

      // กรณีประเมินเครื่องตัวเอง (ไม่มี MANUAL_INPUT)
      const platforms: Platform[] = ["UNIVERSAL"];
      if (deviceInfo.brand === "Apple") {
        platforms.push("IOS");
      } else {
        platforms.push("ANDROID");
      }
      return platforms;
    };

    const targetPlatforms = getTargetPlatforms();

    return ASSESSMENT_QUESTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.platforms.some((platform) => targetPlatforms.includes(platform))),
    })).filter((section) => section.questions.length > 0);
  }, [deviceInfo.brand, showFullReport]);

  // ✨ [NEW] แยกคำถามประเภท choice และ toggle ออกจากกัน
  const choiceQuestionsBySection = useMemo(
    () =>
      relevantQuestions
        .map((section) => ({
          ...section,
          questions: section.questions.filter((q) => q.type === "choice"),
        }))
        .filter((section) => section.questions.length > 0),
    [relevantQuestions],
  );

  const allToggleQuestions = useMemo(
    () => relevantQuestions.flatMap((section) => section.questions.filter((q) => q.type === "toggle")),
    [relevantQuestions],
  );

  const allVisibleQuestions = useMemo(
    () => choiceQuestionsBySection.flatMap((s) => s.questions),
    [choiceQuestionsBySection],
  );

  const answeredQuestionsCount = useMemo(
    () => allVisibleQuestions.filter((q) => !!conditionInfo[q.id]).length,
    [conditionInfo, allVisibleQuestions],
  );

  const findFirstUnanswered = () => {
    const unansweredId = allVisibleQuestions.find((q) => !conditionInfo[q.id])?.id;
    return unansweredId !== undefined ? String(unansweredId) : "";
  };

  const [openAccordionValue, setOpenAccordionValue] = useState<string>(findFirstUnanswered());

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

  const handleUpdate = (questionId: keyof ConditionInfo, value: string) => {
    onConditionUpdate((prev) => {
      const updated = { ...prev, [questionId]: value };
      const nextUnanswered = allVisibleQuestions.find((q) => !updated[q.id]);
      setOpenAccordionValue(nextUnanswered ? String(nextUnanswered.id) : "");
      return updated;
    });
  };

  const isComplete = useMemo(() => {
    return allVisibleQuestions.every((q) => !!conditionInfo[q.id]);
  }, [conditionInfo, allVisibleQuestions]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-foreground text-3xl font-bold">ประเมินสภาพเครื่อง</h2>
        <p className="text-muted-foreground">
          กรุณาตอบคำถามให้ครบทุกข้อ ({answeredQuestionsCount}/{allVisibleQuestions.length})
        </p>
      </div>

      <div className="flex-grow space-y-6">
        {/* ✨ [MODIFIED] วนลูปเฉพาะคำถาม Choice */}
        {choiceQuestionsBySection.map((section) => (
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
                const questionIndex = allVisibleQuestions.findIndex((q) => q.id === question.id);
                const selectedValue = conditionInfo[question.id] as string;
                const isAnswered = !!selectedValue;
                const selectedLabel = isAnswered
                  ? question.options.find((opt) => opt.id === selectedValue)?.label
                  : null;
                const Icon = question.icon;

                return (
                  <AccordionItem
                    ref={(el) => {
                      itemRefs.current[String(question.id)] = el;
                    }}
                    value={String(question.id)}
                    key={String(question.id)}
                    className={cn(
                      "bg-card rounded-xl border shadow-sm transition-all duration-300",
                      openAccordionValue === question.id
                        ? "border-primary ring-primary/20 ring-1"
                        : isAnswered
                          ? "border-green-500/30"
                          : "border-border",
                    )}
                  >
                    <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
                      <div className="flex w-full items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                            isAnswered
                              ? "bg-green-100"
                              : openAccordionValue === question.id
                                ? "bg-orange-100"
                                : "bg-slate-100",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-6 w-6",
                              isAnswered
                                ? "text-green-600"
                                : openAccordionValue === question.id
                                  ? "text-primary"
                                  : "text-slate-500",
                            )}
                          />
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground pt-px font-semibold">{questionIndex + 1}.</span>
                            <p className="text-foreground flex-1 text-left font-semibold">{question.question}</p>
                          </div>
                          {selectedLabel && <p className="text-primary mt-0.5 text-sm font-medium">{selectedLabel}</p>}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <RadioGroup
                        value={selectedValue}
                        onValueChange={(value) => handleUpdate(question.id as keyof ConditionInfo, value)}
                        className="flex flex-col gap-3 border-t pt-4"
                      >
                        {question.options.map((option) => (
                          <Label
                            key={option.id}
                            htmlFor={`${String(question.id)}-${String(option.id)}`}
                            className={cn(
                              "flex cursor-pointer items-center rounded-lg border p-4 transition-all",
                              selectedValue === option.id
                                ? "border-primary bg-primary/5 ring-primary ring-1"
                                : "border-border bg-card hover:bg-accent",
                            )}
                          >
                            <RadioGroupItem value={option.id} id={`${String(question.id)}-${String(option.id)}`} />
                            <span className="text-foreground ml-3 font-medium">{option.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        ))}
      </div>

      {/* ✨ [NEW] เพิ่มส่วนสำหรับคำถาม Toggle */}
      {allToggleQuestions.length > 0 && (
        <div className="mt-4 border-t pt-6">
          <h3 className="text-foreground mb-4 text-lg font-bold">ฟังก์ชันการทำงานเพิ่มเติม</h3>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {allToggleQuestions.map((question) => (
              <QuestionWrapper
                key={String(question.id)}
                question={question}
                conditionInfo={conditionInfo}
                onConditionUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-border mt-4 flex items-center justify-between border-t pt-6 dark:border-zinc-800">
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
          size="lg"
          disabled={!isComplete}
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ขั้นตอนต่อไป
        </FramerButton>
      </div>
    </div>
  );
};

export default MobileQuestionAccordion;
