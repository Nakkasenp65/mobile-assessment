"use client";

import HeroImageSlider from "./HeroImageSlider";
import HeroAssessmentForm from "./HeroAssessmentForm";
import HeroFeatures from "./HeroFeatures";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-max w-full overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute h-full w-full">
        <Image
          src="https://lh3.googleusercontent.com/d/1g6fKYNI_nIqDBcm3rtxZ-qYqjjXLYm_A"
          alt="Abstract pink and orange texture background"
          fill
          priority
          className="z-0 object-cover"
          aria-hidden="true"
        />
        {/* Background overlay pink */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-100/70 via-pink-100/70 to-pink-200/80" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-black/10 to-black/90 drop-shadow-2xl" />
      </div>

      {/* CONTAINER: จัดวาง Slider และ Form ให้อยู่ตรงกลาง */}
      <div className="relative z-20 flex h-full flex-col justify-center py-10">
        <div className="item-end flex flex-col justify-center gap-8 md:flex-row">
          <HeroImageSlider />
          <HeroAssessmentForm />
        </div>
        <HeroFeatures />
      </div>

      {/* FEATURES: วางอยู่นอก Container หลักเพื่อให้ absolute ทำงานกับ section โดยตรง */}
    </section>
  );
};

export default HeroSection;
