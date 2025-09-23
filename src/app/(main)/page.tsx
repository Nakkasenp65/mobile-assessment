"use client";

import Layout from "../../components/Layout/Layout";
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import HeroSection from "./components/(hero)/HeroSection";
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
      {/* รูปพืนหลังสำหรับทับกัน HeroSection */}

      <main className="mx-auto flex flex-col gap-16">
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
