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
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

  const relevantQuestions = useMemo(() => {
    const currentPlatform = isDesktop ? "DESKTOP" : isIOS ? "IOS" : "ANDROID";
    return ASSESSMENT_QUESTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.platforms.includes(currentPlatform)),
    })).filter((section) => section.questions.length > 0);
  }, [isDesktop, isIOS, isAndroid]);

  // ✨ [แก้ไข] กรองเฉพาะคำถามประเภท "choice" เพื่อใช้ในการตรวจสอบ isComplete
  const allVisibleQuestions = useMemo(
    () => relevantQuestions.flatMap((s) => s.questions).filter((q) => q.type === "choice"),
    [relevantQuestions],
  );

  const findFirstUnanswered = () => {
    return allVisibleQuestions.find((q) => !conditionInfo[q.id])?.id || "";
  };

  const [openAccordionValue, setOpenAccordionValue] = useState<string>(findFirstUnanswered);

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

  const handleUpdate = (questionId: keyof ConditionInfo, value: string | string[]) => {
    const updatedConditionInfo = { ...conditionInfo, [questionId]: value };
    onConditionUpdate(updatedConditionInfo);

    const nextUnanswered = allVisibleQuestions.find((q) => !updatedConditionInfo[q.id]);
    setOpenAccordionValue(nextUnanswered ? nextUnanswered.id : "");
  };

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
                if (question.type === "toggle") return null;

                const selectedValue = conditionInfo[question.id] as string;
                const isAnswered = !!selectedValue;

                const selectedLabel = isAnswered
                  ? question.options.find((opt) => opt.id === selectedValue)?.label
                  : null;

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
                        ? "border-primary ring-primary/20 ring-1"
                        : isAnswered
                          ? "border-green-500/30"
                          : "border-border",
                    )}
                  >
                    <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
                      <div className="flex w-full items-center gap-4">
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
                          <p className="text-foreground font-semibold">{question.question}</p>
                          {selectedLabel && (
                            <p className="text-primary mt-0.5 text-sm font-medium">
                              {selectedLabel}
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <RadioGroup
                        value={selectedValue}
                        onValueChange={(value) => handleUpdate(question.id, value)}
                        className="flex flex-col gap-3 border-t pt-4"
                      >
                        {question.options.map((option) => (
                          <Label
                            key={option.id}
                            htmlFor={`${question.id}-${option.id}`}
                            className={cn(
                              "flex cursor-pointer items-center rounded-lg border p-4 transition-all",
                              selectedValue === option.id
                                ? "border-primary bg-primary/5 ring-primary ring-1"
                                : "border-border bg-card hover:bg-accent",
                            )}
                          >
                            <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
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

      {/* Footer Buttons */}
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
