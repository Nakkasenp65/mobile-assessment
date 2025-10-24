// src/app/details/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import AssessStep3 from "../(step3)/AssessStep3";
import AssessStep4 from "../(step4)/AssessStep4";
import { useAssessment } from "@/hooks/useAssessment";
import { useLiff } from "@/components/Provider/LiffProvider";
import Loading from "../../../components/ui/Loading";
import Error from "../../../components/ui/Error";
// Removed useMobile call here to keep Hooks order consistent across renders

export default function AssessmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  const [step, setStep] = useState(1); // 1 = Service Selection (AssessStep3), 2 = Service Form (AssessStep4)
  const [selectedService, setSelectedService] = useState<string>("");
  const { lineUserId } = useLiff(); // ดึง LINE User ID จาก LIFF context

  const {
    data: assessmentData,
    isLoading: assessmentLoading,
    error: assessmentError,
  } = useAssessment(assessmentId);

  if (assessmentLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (assessmentError || !assessmentData) {
    return (
      <Layout>
        <Error />
      </Layout>
    );
  }

  const { deviceInfo, conditionInfo, priceLockExpiresAt } = assessmentData;

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
              docId={assessmentData.docId}
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onBack={handleBack}
              onNext={handleNext}
              setSelectedService={setSelectedService}
              priceLockExpiresAt={priceLockExpiresAt}
              assessmentId={assessmentId}
              assessmentData={assessmentData}
            />
          )}

          {step === 2 && (
            <AssessStep4
              phoneNumber={assessmentData?.phoneNumber}
              assessmentId={assessmentId}
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
              lineUserId={lineUserId}
              onBack={handleBack}
              onSuccess={() => {
                // หลังบันทึกสำเร็จ กลับไปหน้าก่อนฟอร์ม (เลือกบริการ)
                setStep(1);
                window.scrollTo(0, 0);
              }}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
