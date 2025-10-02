// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/DesktopReportForm.tsx

"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConditionInfo } from "../../../../page";
import { Question } from "../../../../../../util/info";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";
import { cn } from "@/lib/utils";

interface DesktopReportFormProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
  questions: Array<{ section: string; questions: Question[] }>;
}

const DesktopReportForm = ({
  onComplete,
  onBack,
  onConditionUpdate,
  questions,
}: DesktopReportFormProps) => {
  const allQuestions = useMemo(
    () => questions.flatMap((section) => section.questions),
    [questions],
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [expandedSections, setExpandedSections] = useState<string[]>([questions[0]?.section || ""]);

  const [formValues, setFormValues] = useState<Partial<ConditionInfo>>(() => {
    const initialValues: Partial<ConditionInfo> = {};
    allQuestions.forEach((q) => {
      initialValues[q.id] = undefined;
    });
    return initialValues;
  });

  const handleSelection = (questionId: keyof ConditionInfo, value: string) => {
    const currentSection = questions.find((s) => s.questions.some((q) => q.id === questionId));
    if (!currentSection) return;

    const wasSectionComplete = currentSection.questions.every(
      (q) => formValues[q.id] !== undefined,
    );

    const newFormValues = { ...formValues, [questionId]: value };
    setFormValues(newFormValues);

    const isSectionNowComplete = currentSection.questions.every(
      (q) => newFormValues[q.id] !== undefined,
    );

    if (!wasSectionComplete && isSectionNowComplete) {
      const currentSectionIndex = questions.findIndex((s) => s.section === currentSection.section);
      const nextSection = questions[currentSectionIndex + 1];

      setExpandedSections((prev) => {
        const filtered = prev.filter((name) => name !== currentSection.section);
        if (nextSection) {
          return [...filtered, nextSection.section];
        }
        return filtered;
      });
    }
  };

  useEffect(() => {
    const activeSectionName = expandedSections[0];
    if (activeSectionName) {
      const element = sectionRefs.current[activeSectionName];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
      }
    }
  }, [expandedSections]);

  const isComplete = useMemo(() => {
    return allQuestions.every((q) => formValues[q.id] !== undefined);
  }, [formValues, allQuestions]);

  const getSectionProgress = (section: { section: string; questions: Question[] }) => {
    const answeredCount = section.questions.filter((q) => formValues[q.id] !== undefined).length;
    return {
      answered: answeredCount,
      total: section.questions.length,
      isComplete: answeredCount === section.questions.length,
    };
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName) ? prev.filter((name) => name !== sectionName) : [sectionName],
    );
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    onConditionUpdate(formValues as ConditionInfo);
    onComplete();
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">ประเมินสภาพเครื่อง</h1>
        <p className="text-muted-foreground">
          กรุณาเลือกตัวเลือกที่ตรงกับสภาพเครื่องของท่านให้ครบทุกรายการ
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {questions.map((section) => {
          const progress = getSectionProgress(section);
          const isExpanded = expandedSections.includes(section.section);

          return (
            <div
              key={section.section}
              ref={(el) => {
                sectionRefs.current[section.section] = el;
              }}
              className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.section)}
                className="hover:bg-accent/50 flex w-full items-center justify-between p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  {progress.isComplete ? (
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                  ) : progress.answered > 0 ? (
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="h-6 w-6 flex-shrink-0 text-orange-500"
                    >
                      <Circle fill="currentColor" strokeWidth={0} />
                    </motion.div>
                  ) : (
                    <Circle className="h-6 w-6 flex-shrink-0 text-slate-300 dark:text-zinc-600" />
                  )}
                  <div>
                    <h2 className="text-foreground text-lg font-bold">{section.section}</h2>
                    <p className="text-muted-foreground text-sm">
                      {progress.answered} จาก {progress.total} คำถาม
                      {progress.isComplete && " • เสร็จสมบูรณ์"}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-muted-foreground h-5 w-5" />
                ) : (
                  <ChevronDown className="text-muted-foreground h-5 w-5" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="border-border/50 border-t p-4 md:p-6">
                      <div className="divide-border/50 flex flex-col divide-y">
                        {section.questions.map((question) => (
                          <div key={question.id} className="flex flex-col gap-3 py-4 first:pt-0">
                            <h3 className="text-foreground font-semibold">{question.question}</h3>
                            <div className="grid [grid-auto-rows:1fr] grid-cols-2 gap-3 sm:grid-cols-3">
                              {question.options.map((option) => {
                                const isSelected = formValues[question.id] === option.value;
                                const Icon = option.icon;

                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleSelection(question.id, option.value)}
                                    className={cn(
                                      "flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all duration-200",
                                      isSelected
                                        ? "border-primary ring-primary/20 dark:bg-primary/10 bg-orange-50 ring-2"
                                        : "border-border bg-background hover:border-primary/50 hover:bg-accent/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50",
                                    )}
                                  >
                                    <Icon
                                      size={28}
                                      className={cn(
                                        "mb-1 transition-colors",
                                        isSelected ? "text-primary" : "text-muted-foreground",
                                      )}
                                    />
                                    <span className="text-foreground text-xs font-semibold">
                                      {option.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

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
          onClick={handleSubmit}
          size="lg"
          disabled={!isComplete}
          className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          ดำเนินการต่อ
        </FramerButton>
      </div>
    </div>
  );
};

export default DesktopReportForm;
