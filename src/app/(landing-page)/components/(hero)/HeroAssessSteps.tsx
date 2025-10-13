// src/app/(main)/components/(hero)/HeroAssessSteps.tsx

"use client";
import { ClipboardList, FileCheck2, MoveRight, Search, Wallet } from "lucide-react";
import { Fragment } from "react";

export default function HeroAssessSteps() {
  const processSteps = [
    { icon: Search, text: "ประเมิน" },
    { icon: FileCheck2, text: "ตรวจสอบราคา" },
    { icon: ClipboardList, text: "เลือกบริการ" },
    { icon: Wallet, text: "รับเงินทันที" },
  ];

  return (
    <div className="hidden rounded-2xl bg-white p-2 shadow-lg lg:block lg:p-2">
      {/* ProcessSteps - Head */}
      <div className="mb-4 text-center">
        <h4 className="text-sm font-bold text-gray-800 lg:text-base">ขั้นตอนการใช้บริการ</h4>
        <div className="mx-auto mt-1.5 h-0.5 w-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
      </div>
      {/* ProcessSteps - Content */}
      <div className="flex items-center justify-between md:scale-85 lg:scale-100">
        {/* Mapping the ProcessSteps */}
        {processSteps.map((step, index) => (
          <Fragment key={index}>
            {/* Each step element */}
            <div className="group flex flex-col items-center text-center">
              {/* Each step icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-hover:bg-gray-200 md:h-14 md:w-14">
                <step.icon className="h-6 w-6 text-pink-600 md:h-7 md:w-7" />
              </div>
              {/* Each step text */}
              <p className="w-20 text-center text-xs font-semibold text-gray-700">{step.text}</p>
            </div>
            {/* Conditional Rendering the arrow Icon */}
            {index < processSteps.length - 1 && (
              <div className="flex-shrink-0 self-start pt-4">
                <MoveRight className="h-4 w-4 text-gray-300 md:h-5 md:w-5" strokeWidth={2.5} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
