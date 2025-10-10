// src/app/assess/simple/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import SimpleAssessmentForm from "../components/(step1)/SimpleAssessmentForm";
import FramerButton from "@/components/ui/framer/FramerButton";

function SimpleAssessmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productType = searchParams.get("productType") || "อุปกรณ์";

  const handleNext = () => {
    // ส่งต่อไปยังหน้า Assess หลัก พร้อมกับ parameter ที่จำเป็น
    const params = new URLSearchParams({
      brand: "Apple",
      productType: productType,
      isFromMainPage: "true",
      // เราอาจจะไม่มี model/storage ที่แน่นอนในขั้นตอนนี้
      // แต่ส่งไปเพื่อให้ AssessComponent ทำงานต่อได้
      model: productType,
      capacity: "Unknown",
    });
    router.push(`/assess?${params.toString()}`);
  };

  return (
    <Layout>
      <main className="container mx-auto flex w-full flex-col items-center gap-8 p-4 pb-24 sm:gap-8 sm:pt-16">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold">ประเมิน {productType}</h1>
          <p className="text-muted-foreground mt-2">กรุณากรอกรายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์ของคุณด้านล่าง</p>
        </div>
        <div className="w-full max-w-2xl">
          <SimpleAssessmentForm />
        </div>
        <div className="w-full max-w-2xl">
          <FramerButton onClick={handleNext} size="lg" className="h-14 w-full">
            ดำเนินการต่อ
          </FramerButton>
        </div>
      </main>
    </Layout>
  );
}

export default function SimpleAssessmentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimpleAssessmentPageContent />
    </Suspense>
  );
}
