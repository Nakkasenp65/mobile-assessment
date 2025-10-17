// src\app\(main)\components\(hero)\HeroSection.tsx

"use client";

import HeroAssessmentAction from "./HeroAssessmentAction";
import HeroAdImages from "./HeroAdImages";
import HeroFeature from "./HeroFeature";

// md size >= 768
// lg size >= 1024
// xl size >= 1280

const HeroSection = () => {
  return (
    <section className="gradient-bg relative h-max w-full overflow-hidden px-4 pb-16 sm:py-16 xl:pt-4">
      {/* Section - Hero */}
      <div className="relative container mx-auto flex w-full flex-col items-center gap-8">
        {/* Ad Image + CTA */}
        <div className={"flex w-full flex-col md:flex-row md:items-center md:justify-evenly"}>
          {/* Ad Image */}
          <HeroAdImages />

          {/* CTA */}
          <HeroAssessmentAction />
        </div>

        {/* HeroFeature */}
        <HeroFeature />
      </div>
    </section>
  );
};

export default HeroSection;
