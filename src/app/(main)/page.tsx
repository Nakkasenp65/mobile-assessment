"use client";

import Layout from "../../components/Layout/Layout";
import AboutSection from "./components/AboutSection";
import CtaSection from "./components/CtaSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import HeroSection from "./components/(hero)/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ReviewsSection from "./components/ReviewsSection";
import AnimatedButton from "./components/AnimatedButton";

const MainPage = () => {
  return (
    <Layout>
      <AnimatedButton />
      <main className="mx-auto flex flex-col bg-white">
        <HeroSection />
        <HowItWorksSection />
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
