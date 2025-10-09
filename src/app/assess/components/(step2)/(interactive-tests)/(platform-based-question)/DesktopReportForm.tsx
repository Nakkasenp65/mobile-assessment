"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, Circle, CheckCircle2 } from "lucide-react";
import { ConditionInfo } from "../../../../../../types/device";
import { ASSESSMENT_QUESTIONS } from "../../../../../../util/info";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";
import QuestionWrapper from "../../../../../../components/ui/QuestionWrapper";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DesktopReportFormProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
}

const DesktopReportForm = ({ conditionInfo, onConditionUpdate, onComplete, onBack }: DesktopReportFormProps) => {
  const { isDesktop, isIOS, isAndroid } = useDeviceDetection();
  const [openSections, setOpenSections] = useState<string[]>(["section-0"]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // กรองคำถามที่เกี่ยวข้องกับ Platform ที่แสดงผลเท่านั้น
  const relevantSections = useMemo(() => {
    const currentPlatform = isDesktop ? "DESKTOP" : isIOS ? "IOS" : "ANDROID";
    return ASSESSMENT_QUESTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.platforms.includes(currentPlatform)),
    })).filter((section) => section.questions.length > 0);
  }, [isDesktop, isIOS, isAndroid]);

  // ตรวจสอบว่าแต่ละ Section ตอบครบหรือยัง
  const isSectionComplete = (sectionIndex: number) => {
    const section = relevantSections[sectionIndex];
    const requiredQuestions = section.questions.filter((q) => q.type === "choice");
    return requiredQuestions.every((q) => !!conditionInfo[q.id]);
  };

  // ตรวจสอบว่า Section มีคำตอบบางข้อแล้วหรือยัง (สำหรับแสดงสถานะ in-progress)
  const isSectionInProgress = (sectionIndex: number) => {
    const section = relevantSections[sectionIndex];
    const requiredQuestions = section.questions.filter((q) => q.type === "choice");
    return requiredQuestions.some((q) => !!conditionInfo[q.id]);
  };

  // ตรวจสอบว่าตอบคำถามที่แสดงผลครบทุกข้อแล้วหรือยัง
  const isComplete = useMemo(() => {
    const allRequiredQuestions = relevantSections.flatMap((s) => s.questions.filter((q) => q.type === "choice"));
    return allRequiredQuestions.every((q) => !!conditionInfo[q.id]);
  }, [conditionInfo, relevantSections]);

  // ฟังก์ชันสำหรับอัปเดต State
  const handleUpdate = (questionId: keyof ConditionInfo, value: string) => {
    onConditionUpdate((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Track previous completion state to detect when section just completed
  const prevCompletionRef = useRef<boolean[]>([]);

  // ตรวจสอบว่า Section เสร็จสิ้นแล้ว และเลื่อนไปยัง Section ถัดไป
  useEffect(() => {
    relevantSections.forEach((section, index) => {
      const complete = isSectionComplete(index);
      const wasComplete = prevCompletionRef.current[index];
      const nextIndex = index + 1;

      // ตรวจสอบว่าเพิ่งเสร็จสิ้น (ไม่ใช่การแก้ไขซ้ำ)
      if (complete && !wasComplete && nextIndex < relevantSections.length) {
        const currentSectionId = `section-${index}`;
        const nextSectionId = `section-${nextIndex}`;

        // ปิด Section ปัจจุบัน และเปิด Section ถัดไป
        setOpenSections((prev) => {
          const filtered = prev.filter((id) => id !== currentSectionId);
          if (!filtered.includes(nextSectionId)) {
            return [...filtered, nextSectionId];
          }
          return filtered;
        });

        // Scroll ไปยัง Section ถัดไป
        setTimeout(() => {
          if (sectionRefs.current[nextIndex]) {
            sectionRefs.current[nextIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    });

    // Update previous completion state
    prevCompletionRef.current = relevantSections.map((_, index) => isSectionComplete(index));
  }, [conditionInfo, relevantSections]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8">
      <div className="text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">ประเมินสภาพเครื่อง</h1>
        <p className="text-muted-foreground">กรุณาเลือกตัวเลือกที่ตรงกับสภาพเครื่องของท่านให้ครบทุกรายการ</p>
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="flex flex-col gap-4">
        {relevantSections.map((section, sectionIndex) => {
          const isCompleted = isSectionComplete(sectionIndex);
          const inProgress = isSectionInProgress(sectionIndex);
          const choiceQuestions = section.questions.filter((q) => q.type === "choice");
          const toggleQuestions = section.questions.filter((q) => q.type === "toggle");

          return (
            <AccordionItem
              key={`section-${sectionIndex}`}
              value={`section-${sectionIndex}`}
              ref={(el) => {
                sectionRefs.current[sectionIndex] = el;
              }}
              className="border-border bg-card rounded-2xl border shadow-sm"
            >
              <AccordionTrigger className="flex items-center px-4 py-4 hover:no-underline data-[state=open]:mb-8 data-[state=open]:rounded-b-none data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  {/* Status Icon */}
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  ) : inProgress ? (
                    <Circle className="h-5 w-5 flex-shrink-0 fill-orange-500 text-orange-500" />
                  ) : (
                    <Circle className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                  )}

                  {/* Section Title */}
                  <div className="flex flex-col items-start gap-1 text-left">
                    <h2 className="text-foreground text-base font-semibold md:text-lg">{section.section}</h2>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {isCompleted
                        ? "เสร็จสมบูรณ์"
                        : inProgress
                          ? "กรอกข้อมูลบางส่วน"
                          : `${choiceQuestions.length} คำถาม`}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                {/* ส่วนที่ 1: Render คำถามแบบ Choice (ถ้ามี) */}
                {choiceQuestions.length > 0 && (
                  <div className="divide-border/50 flex flex-col divide-y">
                    {choiceQuestions.map((question) => (
                      <QuestionWrapper
                        key={String(question.id)}
                        question={question}
                        conditionInfo={conditionInfo}
                        onConditionUpdate={handleUpdate}
                      />
                    ))}
                  </div>
                )}

                {/* ส่วนที่ 2: Render คำถามแบบ Toggle (ถ้ามี) */}
                {toggleQuestions.length > 0 && (
                  <>
                    <div className="mt-6 flex items-center gap-3">
                      <h3 className="text-foreground text-base font-semibold md:text-lg">ปัญหาด้านการใช้งานที่พบ</h3>
                      <span className="text-muted-foreground text-xs">(ไม่จำเป็นต้องเลือก)</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
                      {toggleQuestions.map((question) => (
                        <QuestionWrapper
                          key={String(question.id)}
                          question={question}
                          conditionInfo={conditionInfo}
                          onConditionUpdate={handleUpdate}
                        />
                      ))}
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

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
          ดำเนินการต่อ
        </FramerButton>
      </div>
    </div>
  );
};

export default DesktopReportForm;
