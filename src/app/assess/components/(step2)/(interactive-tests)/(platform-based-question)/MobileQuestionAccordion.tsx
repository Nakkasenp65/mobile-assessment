// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/MobileQuestionAccordion.tsx

"use client";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ConditionInfo } from "../../../../page";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Question } from "../../../../../../util/info";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";

interface MobileQuestionAccordionProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (
    info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo),
  ) => void;
  onComplete: () => void;
  onBack: () => void;
  questions: Array<{ section: string; questions: Question[] }>;
}

const MobileQuestionAccordion = ({
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
  questions, // Silas's logic: Now receives questions as a prop.
}: MobileQuestionAccordionProps) => {
  const allQuestions = useMemo(
    () => questions.flatMap((section) => section.questions),
    [questions],
  );

  const [openAccordionValue, setOpenAccordionValue] = useState<string>(
    allQuestions[0]?.id || "",
  );

  useEffect(() => {
    // We only want to scroll if there is an active item to scroll to.
    if (openAccordionValue) {
      const element = document.getElementById(
        `accordion-item-${openAccordionValue}`,
      );
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [openAccordionValue]);

  const handleOptionChange = (
    questionId: keyof ConditionInfo,
    value: string,
  ) => {
    const newState = { ...conditionInfo, [questionId]: value };
    onConditionUpdate(newState);

    const currentIdx = allQuestions.findIndex((q) => q.id === questionId);
    const nextQuestion = allQuestions.find(
      (q, idx) => idx > currentIdx && !newState[q.id],
    );

    if (nextQuestion) {
      setOpenAccordionValue(nextQuestion.id);
    } else {
      setOpenAccordionValue("");
    }
  };

  const allQuestionsAnswered = allQuestions.every((q) => !!conditionInfo[q.id]);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        {/* Kaia's insight: More generic header text for reusability. */}
        <h2 className="text-foreground text-2xl font-bold">
          ประเมินสภาพเครื่อง
        </h2>
        <p className="text-muted-foreground">
          กรุณาตอบคำถามเพื่อประเมินสภาพเครื่อง
        </p>
      </div>

      <div className="flex-grow">
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
                id={`accordion-item-${question.id}`}
                value={question.id}
                key={question.id}
                className="mt-4 border-b-0 duration-500 ease-in-out"
              >
                {/* QUESTION HEAD (ACCORDIAN) */}
                <AccordionTrigger
                  // Style of the Accordion itself (box and arrow)
                  className={cn(
                    "flex items-center rounded-sm px-2 transition-all duration-500 ease-in-out hover:no-underline",
                    openAccordionValue === question.id
                      ? "bg-accent"
                      : "hover:bg-accent",
                    selectedValue && "bg-accent",
                  )}
                >
                  <div className="flex w-full items-center gap-4 duration-500 ease-in-out">
                    <CheckCircle2
                      className={cn(
                        "transition-colors duration-300",
                        selectedValue ? "text-success" : "text-stone-400",
                      )}
                      size={26}
                      strokeWidth={1}
                    />
                    {/* Question and selected choices if exist */}
                    <div className="flex-grow duration-500 ease-in-out">
                      <p className="text-foreground font-medium">
                        {question.question}
                      </p>
                      {selectedOption && (
                        <p className="text-primary text-xs font-semibold">
                          {selectedOption.label}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                {/* CHOICES (Inside) */}
                <AccordionContent>
                  <div className="flex flex-col gap-2 p-2">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className="hover:bg-accent flex cursor-pointer items-center rounded-lg border p-3"
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
                        <span className="text-foreground text-sm">
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
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 cursor-pointer items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </FramerButton>
        <FramerButton
          onClick={onComplete}
          disabled={!allQuestionsAnswered}
          size="lg"
          className="text-primary-foreground shadow-lg... h-12 transform-gpu cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold"
        >
          ขั้นตอนต่อไป
        </FramerButton>
      </div>
    </div>
  );
};

export default MobileQuestionAccordion;
