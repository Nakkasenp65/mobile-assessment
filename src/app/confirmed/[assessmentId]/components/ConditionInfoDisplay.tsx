// src/app/confirmed/[assessmentId]/components/ConditionInfoDisplay.tsx

import { CheckCircle, XCircle } from "lucide-react";
import { ASSESSMENT_QUESTIONS } from "@/util/info";
import type { ConditionInfo } from "@/types/device";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConditionInfoDisplayProps {
  conditionInfo: ConditionInfo;
}

// Helper function to find question and option labels
function getQuestionAndAnswer(key: string, value: string | boolean) {
  // Find the section and question that matches this key
  for (const section of ASSESSMENT_QUESTIONS) {
    const question = section.questions.find((q) => q.id === key);
    if (question) {
      // Found the question, now find the matching option
      if (typeof value === "boolean") {
        // For boolean values, use the first option for true, second for false
        const optionIndex = value ? 0 : 1;
        const option = question.options[optionIndex];
        return {
          sectionName: section.section,
          questionText: question.question,
          answerText: option?.label || (value ? "ใช่" : "ไม่ใช่"),
          Icon: option?.icon || CheckCircle,
          isPositive: value,
        };
      } else {
        // For string values, find the matching option by id
        const option = question.options.find((opt) => opt.id === value);
        return {
          sectionName: section.section,
          questionText: question.question,
          answerText: option?.label || value || "-",
          Icon: option?.icon || CheckCircle,
          isPositive: true, // Default for string values
        };
      }
    }
  }

  // Fallback if not found
  return {
    sectionName: "อื่นๆ",
    questionText: key,
    answerText: typeof value === "boolean" ? (value ? "ใช่" : "ไม่ใช่") : value || "-",
    Icon: CheckCircle,
    isPositive: typeof value === "boolean" ? value : true,
  };
}

// Group items by section
function groupConditionsBySection(conditionInfo: ConditionInfo) {
  const grouped: Record<string, Array<ReturnType<typeof getQuestionAndAnswer>>> = {};

  Object.entries(conditionInfo).forEach(([key, value]) => {
    // Skip metadata fields
    if (key === "id" || key === "assessmentId") return;

    const item = getQuestionAndAnswer(key, value);
    if (!grouped[item.sectionName]) {
      grouped[item.sectionName] = [];
    }
    grouped[item.sectionName].push(item);
  });

  return grouped;
}

export default function ConditionInfoDisplay({ conditionInfo }: ConditionInfoDisplayProps) {
  const groupedConditions = groupConditionsBySection(conditionInfo);

  // Get section order from ASSESSMENT_QUESTIONS
  const sectionOrder = ASSESSMENT_QUESTIONS.map((s) => s.section);

  // Set the last section as default open value (ฟังก์ชันการทำงานพื้นฐาน)
  const lastSection = sectionOrder[sectionOrder.length - 1];

  return (
    <Accordion type="multiple" defaultValue={[lastSection]} className="space-y-3">
      {sectionOrder.map((sectionName) => {
        const items = groupedConditions[sectionName];
        if (!items || items.length === 0) return null;

        return (
          <AccordionItem key={sectionName} value={sectionName}>
            <AccordionTrigger className="py-4 text-sm font-semibold text-gray-900 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                {sectionName}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item, index) => {
                  const Icon = item.Icon;
                  const isNegative = !item.isPositive;

                  return (
                    <div
                      key={`${sectionName}-${index}`}
                      className={`rounded-lg border p-3 transition-all duration-200 ${
                        isNegative
                          ? "border-red-200 bg-red-50/50 hover:bg-red-50"
                          : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          <Icon
                            className={`h-4 w-4 ${isNegative ? "text-red-500" : "text-blue-500"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-700">{item.questionText}</p>
                          <p
                            className={`mt-0.5 text-sm font-semibold ${
                              isNegative ? "text-red-700" : "text-gray-900"
                            }`}
                          >
                            {item.answerText}
                          </p>
                        </div>
                        {isNegative && (
                          <div className="flex-shrink-0">
                            <XCircle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
