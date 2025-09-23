"use client";

import Layout from "../../components/Layout/Layout";
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ReviewsSection from "./components/ReviewsSection";
import WhyUsSection from "./components/WhyUsSection";
import AnimatedButton from "./components/AnimatedButton";
import Image from "next/image";
// import { BackgroundBeams } from "../../components/ui/shadcn-io/background-beams";

const MainPage = () => {
  return (
    <Layout>
      <AnimatedButton />
      <div className="absolute h-[1100px] w-full sm:h-[1200px] lg:h-[950px]">
        <Image
          src="https://lh3.googleusercontent.com/d/1g6fKYNI_nIqDBcm3rtxZ-qYqjjXLYm_A"
          alt="Abstract pink and orange texture background"
          fill
          priority
          className="z-0 object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-orange-100/70 via-pink-100/70 to-pink-200/80" />
      </div>
      <main className="container mx-auto flex flex-col gap-48">
        <HeroSection />
        <HowItWorksSection />
        <WhyUsSection />
        <AboutSection />
        <ReviewsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </Layout>
  );
};

export default MainPage;
