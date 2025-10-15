"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import AssessStep3 from "../../assess/components/(step3)/AssessStep3";
import AssessStep4 from "../../assess/components/(step4)/AssessStep4";
import { useAssessment } from "@/hooks/useAssessment";

export default function AssessmentRecordPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  const [step, setStep] = useState(1); // 1 = Service Selection (AssessStep3), 2 = Service Form (AssessStep4)
  const [selectedService, setSelectedService] = useState<string>("");

  const { data, isLoading, error } = useAssessment(assessmentId);

  if (isLoading) {
    return (
      <Layout>
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white">
          <div className="text-sm text-gray-600">กำลังโหลดข้อมูลการประเมิน...</div>
        </main>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white">
          <div className="text-sm text-red-600">ไม่สามารถโหลดข้อมูลการประเมินได้</div>
        </main>
      </Layout>
    );
  }

  const { device, conditionInfo, priceLockExpiresAt } = data;

  // Transform device data to match DeviceInfo type
  const deviceInfo = {
    brand: device.brand,
    model: device.model,
    storage: device.storage,
    productType: device.brand === "Apple" ? "iPhone" : "Android", // Simplified logic
    imageUrl: device.imageUrl,
  };

  // Handler to advance to service form
  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Handler for back navigation
  const handleBack = () => {
    if (step === 2) {
      setStep(1); // Return to service selection
      window.scrollTo(0, 0);
    } else {
      router.push("/my-assessments"); // Exit to assessments list
    }
  };

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-white px-4 py-8 text-center sm:py-16">
        <div className="z-10 container flex w-full flex-col items-center">
          {step === 1 && (
            <AssessStep3
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onBack={handleBack}
              onNext={handleNext}
              setSelectedService={setSelectedService}
              priceLockExpiresAt={priceLockExpiresAt}
            />
          )}

          {step === 2 && (
            <AssessStep4
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
