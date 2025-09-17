"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { ConditionInfo } from "../page";

interface AssessStep2Props {
  conditionInfo: ConditionInfo;
  onConditionUpdate: (info: ConditionInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Question {
  id: keyof ConditionInfo;
  question: string;
  options: Array<{ value: string; label: string }>;
}

const CONDITION_QUESTIONS: Array<{ section: string; questions: Question[] }> = [
  {
    section: "สภาพหน้าจอ",
    questions: [
      {
        id: "screenGlass",
        question: "สภาพกระจกหน้าจอ",
        options: [
          { value: "perfect", label: "ไม่มีรอยขีดข่วน" },
          { value: "minor", label: "รอยขีดข่วนเล็กน้อย" },
          { value: "cracked", label: "กระจกแตก" },
        ],
      },
      {
        id: "screenDisplay",
        question: "คุณภาพการแสดงผล",
        options: [
          { value: "perfect", label: "แสดงผลปกติทุกจุด" },
          { value: "spots", label: "มีจุดดำหรือเส้น" },
          { value: "not_working", label: "ไม่แสดงผล" },
        ],
      },
    ],
  },
  {
    section: "ตัวเครื่องและการทำงาน",
    questions: [
      {
        id: "bodyCondition",
        question: "สภาพตัวเครื่อง",
        options: [
          { value: "excellent", label: "สภาพดีมาก" },
          { value: "good", label: "สภาพดี มีรอยใช้งานเล็กน้อย" },
          { value: "fair", label: "มีรอยใช้งานชัดเจน" },
        ],
      },
      {
        id: "powerOn",
        question: "เปิดเครื่องได้ปกติ",
        options: [
          { value: "yes", label: "เปิดได้ปกติ" },
          { value: "sometimes", label: "เปิดได้บางครั้ง" },
          { value: "no", label: "เปิดไม่ได้" },
        ],
      },
      {
        id: "cameras",
        question: "กล้องทำงานปกติ",
        options: [
          { value: "all_work", label: "กล้องทุกตัวทำงานดี" },
          { value: "some_work", label: "กล้องบางตัวมีปัญหา" },
          { value: "not_work", label: "กล้องไม่ทำงาน" },
        ],
      },
      {
        id: "biometric",
        question: "Face ID / ลายนิ้วมือ",
        options: [
          { value: "works", label: "ทำงานปกติ" },
          { value: "not_works", label: "ไม่ทำงาน" },
          { value: "no_feature", label: "ไม่มีฟีเจอร์นี้" },
        ],
      },
    ],
  },
];

const AssessStep2 = ({ conditionInfo, onConditionUpdate, onNext, onBack }: AssessStep2Props) => {
  const [localInfo, setLocalInfo] = useState<ConditionInfo>(conditionInfo);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onConditionUpdate(localInfo);
  }, [localInfo, onConditionUpdate]);

  const handleOptionChange = (questionId: keyof ConditionInfo, value: string) => {
    setLocalInfo((prev) => ({ ...prev, [questionId]: value }));
    // Remove error when user selects an option
    if (errors.has(questionId)) {
      setErrors((prev) => {
        const newErrors = new Set(prev);
        newErrors.delete(questionId);
        return newErrors;
      });
    }
  };

  const validateAndProceed = () => {
    const newErrors = new Set<string>();

    // Check all required fields
    CONDITION_QUESTIONS.forEach((section) => {
      section.questions.forEach((question) => {
        if (!localInfo[question.id]) {
          newErrors.add(question.id);
        }
      });
    });

    if (newErrors.size > 0) {
      setErrors(newErrors);

      // Scroll to first error with smooth behavior
      const firstErrorId = Array.from(newErrors)[0];
      const firstErrorElement = document.getElementById(`question-${firstErrorId}`);
      if (firstErrorElement && containerRef.current) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      onNext();
    }
  };

  return (
    <div ref={containerRef} className="card-assessment">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ประเมินสภาพเครื่อง</h2>
        <p className="text-muted-foreground">ตอบคำถามเกี่ยวกับสภาพของมือถือเพื่อการประเมินราคาที่แม่นยำ</p>
      </div>

      <div className="space-y-8">
        {CONDITION_QUESTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              {section.section}
            </h3>

            <div className="space-y-6">
              {section.questions.map((question) => (
                <div key={question.id} id={`question-${question.id}`}>
                  <p className="text-base font-medium text-foreground mb-3">{question.question} *</p>

                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-smooth hover:bg-accent ${
                          localInfo[question.id] === option.value
                            ? "border-primary bg-primary/5"
                            : errors.has(question.id)
                            ? "form-field-error"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={localInfo[question.id] === option.value}
                          onChange={(e) => handleOptionChange(question.id, e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-smooth ${
                            localInfo[question.id] === option.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {localInfo[question.id] === option.value && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {errors.has(question.id) && (
                    <p className="text-destructive text-sm mt-2">กรุณาเลือกคำตอบสำหรับคำถามนี้</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center px-6 py-3 border border-border text-foreground rounded-xl hover:bg-accent transition-smooth"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </button>

        <button
          onClick={validateAndProceed}
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-hover transition-smooth shadow-soft hover:shadow-card transform hover:scale-105"
        >
          คำนวณราคา
        </button>
      </div>
    </div>
  );
};

export default AssessStep2;
