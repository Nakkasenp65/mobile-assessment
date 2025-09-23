"use client";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { ConditionInfo } from "../../../../page";
import { Button } from "@/components/ui/button";
import { Question } from "../../../../../../util/info";
import ChoiceBar from "./ChoiceBar";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";

interface DesktopReportFormProps {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (
    info: ConditionInfo | ((prev: ConditionInfo) => ConditionInfo),
  ) => void;
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

  // [FIX] State is renamed and pre-populated with all question IDs.
  const [formValues, setFormValues] = useState<Partial<ConditionInfo>>(() => {
    const initialValues: Partial<ConditionInfo> = {};
    allQuestions.forEach((q) => {
      initialValues[q.id] = undefined; // Use undefined to signify "not selected"
    });
    return initialValues;
  });

  // [FIX] Simplified selection handler.
  const handleSelection = (questionId: keyof ConditionInfo, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // [FIX] New validation logic.
  const isComplete = useMemo(() => {
    return allQuestions.every(
      (q) => formValues[q.id] !== undefined && formValues[q.id] !== null,
    );
  }, [formValues, allQuestions]);

  // [FIX] Simplified submission handler.
  const handleSubmit = () => {
    if (!isComplete) return; // Extra guard clause
    onConditionUpdate(formValues as ConditionInfo);
    onComplete();
  };

  return (
    <div className="container flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          ประเมินสภาพเครื่อง
        </h2>
        {/* Updated instruction text */}
        <p className="text-muted-foreground">
          กรุณาเลือกตัวเลือกที่ตรงกับสภาพเครื่องของท่านให้ครบทุกรายการ
        </p>
      </div>

      <div className="flex-grow space-y-8">
        {questions.map((section) => (
          <div key={section.section} className="space-y-4">
            <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">
              {section.section}
            </h3>
            <div className="space-y-4">
              {section.questions.map((question) => (
                <div
                  key={question.id}
                  className="grid grid-cols-1 items-start gap-x-4 gap-y-2 md:grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] md:items-center"
                >
                  <label className="text-foreground font-medium">
                    {question.question}
                  </label>
                  <ChoiceBar
                    options={question.options}
                    // [FIX] Pass the direct value or an empty string if not selected.
                    selectedValue={formValues[question.id] || ""}
                    onSelect={(value) => handleSelection(question.id, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
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
        <div className="flex items-center gap-4">
          {/* [FIX] "No issues" button is removed. */}
          <FramerButton
            onClick={handleSubmit}
            size="lg"
            // [FIX] Disabled state is now controlled by the new validation logic.
            disabled={!isComplete}
            className="text-primary-foreground h-12 transform-gpu cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-8 text-base font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            ดำเนินการต่อ
          </FramerButton>
        </div>
      </div>
    </div>
  );
};

export default DesktopReportForm;
