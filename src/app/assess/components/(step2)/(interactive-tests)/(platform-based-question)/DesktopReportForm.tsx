// src/app/assess/components/(step2)/(interactive-tests)/(platform-based-question)/DesktopReportForm.tsx

"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, Circle, CheckCircle2 } from "lucide-react";
import { ConditionInfo, DeviceInfo } from "../../../../../../types/device";
import { ASSESSMENT_QUESTIONS, Platform } from "../../../../../../util/info";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";
import QuestionWrapper from "../../../../../../components/ui/QuestionWrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DesktopReportFormProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo)) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function DesktopReportForm({
  deviceInfo,
  conditionInfo,
  onConditionUpdate,
  onComplete,
  onBack,
}: DesktopReportFormProps) {
  const [openSections, setOpenSections] = useState<string[]>(["section-0"]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const relevantSections = useMemo(() => {
    const getTargetPlatforms = (): Platform[] => {
      if (deviceInfo.brand === "Apple") {
        return ["IOS", "DESKTOP"];
      } else {
        return ["ANDROID", "OTHER"];
      }
    };

    const targetPlatforms = getTargetPlatforms();

    return ASSESSMENT_QUESTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.platforms.some((platform) => targetPlatforms.includes(platform))),
    })).filter((section) => section.questions.length > 0);
  }, [deviceInfo.brand]);

  // ✨ [แก้ไข] เปลี่ยน allRequiredQuestions ให้หมายถึงเฉพาะคำถามประเภท 'choice' ที่บังคับตอบ
  const allRequiredQuestions = useMemo(
    () => relevantSections.flatMap((s) => s.questions.filter((q) => q.type === "choice")),
    [relevantSections],
  );

  // ✨ [แก้ไข] Logic: ตรวจสอบเฉพาะคำถาม "choice" ใน Section
  const isSectionComplete = (sectionIndex: number) => {
    const section = relevantSections[sectionIndex];
    if (!section) return false;
    // กรองเฉพาะคำถามที่ต้องตอบ (choice)
    const requiredQuestions = section.questions.filter((q) => q.type === "choice");
    // ถ้าไม่มีคำถามที่ต้องตอบใน section นี้เลย ให้ถือว่าสมบูรณ์
    if (requiredQuestions.length === 0) return true;
    return requiredQuestions.every((q) => !!conditionInfo[q.id]);
  };

  // ✨ [แก้ไข] Logic: ตรวจสอบว่ามีคำถามใดๆ ใน Section ถูกตอบแล้วหรือยัง
  const isSectionInProgress = (sectionIndex: number) => {
    const section = relevantSections[sectionIndex];
    return section.questions.some((q) => !!conditionInfo[q.id]);
  };

  // ✨ [แก้ไข] Logic: isComplete จะทำงานถูกต้องโดยอัตโนมัติเนื่องจาก allRequiredQuestions ถูกแก้ไขแล้ว
  const isComplete = useMemo(() => {
    // หากไม่มีคำถามที่ต้องตอบเลย ให้ถือว่าสมบูรณ์
    if (allRequiredQuestions.length === 0) return true;
    return allRequiredQuestions.every((q) => !!conditionInfo[q.id]);
  }, [conditionInfo, allRequiredQuestions]);

  const handleUpdate = (questionId: keyof ConditionInfo, value: string) => {
    onConditionUpdate((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const prevCompletionRef = useRef<boolean[]>([]);

  useEffect(() => {
    relevantSections.forEach((section, index) => {
      const complete = isSectionComplete(index);
      const wasComplete = prevCompletionRef.current[index];
      const nextIndex = index + 1;

      if (complete && !wasComplete && nextIndex < relevantSections.length) {
        const currentSectionId = `section-${index}`;
        const nextSectionId = `section-${nextIndex}`;

        setOpenSections((prev) => {
          const filtered = prev.filter((id) => id !== currentSectionId);
          if (!filtered.includes(nextSectionId)) {
            return [...filtered, nextSectionId];
          }
          return filtered;
        });

        setTimeout(() => {
          const element = sectionRefs.current[nextIndex];
          if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - 100;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 300);
      }
    });

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

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="flex w-full flex-col gap-4"
      >
        {relevantSections.map((section, sectionIndex) => {
          const isCompleted = isSectionComplete(sectionIndex);
          const inProgress = isSectionInProgress(sectionIndex);
          const choiceQuestions = section.questions.filter((q) => q.type === "choice");
          const toggleQuestions = section.questions.filter((q) => q.type === "toggle");

          // ✨ [แก้ไข] Logic การนับ: นับเฉพาะคำถามประเภท 'choice'
          const totalQuestionsInSection = choiceQuestions.length;
          const answeredInSection = choiceQuestions.filter((q) => !!conditionInfo[q.id]).length;

          return (
            <AccordionItem
              key={`section-${sectionIndex}`}
              value={`section-${sectionIndex}`}
              ref={(el) => {
                sectionRefs.current[sectionIndex] = el;
              }}
              className="border-border bg-card rounded-2xl border shadow-sm"
            >
              <AccordionTrigger className="flex items-center px-4 py-4 hover:no-underline data-[state=open]:rounded-b-none data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                  ) : inProgress ? (
                    <Circle className="h-5 w-5 flex-shrink-0 fill-orange-500 text-orange-500" />
                  ) : (
                    <Circle className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                  )}
                  <div className="flex flex-col items-start gap-1 text-left">
                    <h2 className="text-foreground text-base font-semibold md:text-lg">{section.section}</h2>
                    {/* ✨ [แก้ไข] อัปเดตข้อความแสดงสถานะให้ถูกต้อง */}
                    <p className="text-muted-foreground text-xs md:text-sm">
                      {totalQuestionsInSection > 0
                        ? isCompleted
                          ? "เสร็จสมบูรณ์"
                          : `ตอบแล้ว ${answeredInSection} จาก ${totalQuestionsInSection} ข้อ`
                        : "ไม่มีคำถามที่ต้องตอบ"}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pt-4 pb-4 md:px-6 md:pb-6">
                {choiceQuestions.length > 0 && (
                  <div className="divide-border/50 flex flex-col divide-y">
                    {choiceQuestions.map((question) => {
                      // ✨ [แก้ไข] เปลี่ยนไปใช้ allRequiredQuestions ในการหา index
                      const questionIndex = allRequiredQuestions.findIndex((q) => q.id === question.id);
                      return (
                        <div key={String(question.id)} className="flex items-start gap-3 pt-4 first:pt-0">
                          <div className="flex-1">
                            <QuestionWrapper
                              question={question}
                              conditionInfo={conditionInfo}
                              onConditionUpdate={handleUpdate}
                              questionIndex={questionIndex + 1}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {toggleQuestions.length > 0 && (
                  <>
                    <div className="mt-6 flex items-center gap-3">
                      {/* ✨ [แก้ไข] ปรับเปลี่ยนหัวข้อให้เหมาะสม */}
                      <h3 className="text-foreground text-base font-semibold md:text-lg">ฟังก์ชันการทำงานเพิ่มเติม</h3>
                      {/* ✨ [แก้ไข] เพิ่มข้อความ "(ไม่จำเป็นต้องเลือก)" */}
                      <span className="text-muted-foreground text-sm">(ไม่จำเป็นต้องเลือก)</span>
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
}
