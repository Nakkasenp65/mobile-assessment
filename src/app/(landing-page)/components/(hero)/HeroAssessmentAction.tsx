// src/app/(main)/components/(hero)/HeroAssessmentAction.tsx

"use client";

import HeroAssessSteps from "./HeroAssessSteps";
import HeroAssessmentForm from "./HeroAssessmentForm";

// md size >= 768
// lg size >= 1024
// xl size >= 1280

export default function HeroAssessmentAction() {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-8 md:w-[45%] lg:w-[40%] xl:w-[45%]">
      {/* Form */}
      <HeroAssessmentForm />
      {/* Process Steps Section */}
      <HeroAssessSteps />
    </div>
  );
}
