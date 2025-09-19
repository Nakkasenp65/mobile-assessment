"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ConditionInfo } from "../../../../page";
import { Button } from "@/components/ui/button";
import { Question } from "../../../../../../util/info";
import ChoiceBar from "./ChoiceBar"; // [FIX] Import the new component

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
  const [selectedIssues, setSelectedIssues] = useState<Partial<ConditionInfo>>(
    {},
  );
  const allQuestions = questions.flatMap((section) => section.questions);

  const handleIssueSelect = (
    questionId: keyof ConditionInfo,
    value: string,
  ) => {
    const normalStateValue = allQuestions.find((q) => q.id === questionId)
      ?.options[0].value;
    setSelectedIssues((prev) => {
      const newIssues = { ...prev };
      if (value === normalStateValue) {
        delete newIssues[questionId];
      } else {
        newIssues[questionId] = value;
      }
      return newIssues;
    });
  };

  const handleSubmit = () => {
    const finalResult: Partial<ConditionInfo> = {};
    allQuestions.forEach((q) => {
      finalResult[q.id] = q.options[0].value;
    });
    Object.assign(finalResult, selectedIssues);
    onConditionUpdate(finalResult as ConditionInfo);
    onComplete();
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          ประเมินสภาพเครื่อง
        </h2>
        <p className="text-muted-foreground">
          โดยปกติเครื่องจะอยู่ในสภาพดีเยี่ยม หากมีปัญหาใดๆ
          กรุณาเลือกจากรายการด้านล่าง
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
                // [FIX] Updated layout for each question to be horizontal
                <div
                  key={question.id}
                  className="grid grid-cols-1 items-start gap-x-4 gap-y-2 md:grid-cols-[minmax(0,_1fr)_minmax(0,_2fr)] md:items-center"
                >
                  <label className="text-foreground font-medium">
                    {question.question}
                  </label>
                  <ChoiceBar
                    options={question.options}
                    selectedValue={
                      selectedIssues[question.id] || question.options[0].value
                    }
                    onSelect={(value) => handleIssueSelect(question.id, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-foreground flex h-12 cursor-pointer items-center rounded-xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleSubmit}
            className="text-muted-foreground"
          >
            ไม่พบปัญหาใดๆ
          </Button>
          <Button
            onClick={handleSubmit}
            size="lg"
            className="text-primary-foreground h-14 transform-gpu rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            ดำเนินการต่อ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesktopReportForm;
