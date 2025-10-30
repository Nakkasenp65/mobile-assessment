// src/app/details/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import AssessStep3 from "../(step3)/AssessStep3";
import AssessStep4 from "../(step4)/AssessStep4";
import { useAssessment } from "@/hooks/useAssessment";
import { useLiff } from "@/components/Provider/LiffProvider";
import Loading from "../../../components/ui/Loading";
import Error from "../../../components/ui/Error";
import DPOConsent from "../../../components/ui/DpoConsent";

export default function AssessmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  const {
    data: assessmentData,
    isLoading: assessmentLoading,
    error: assessmentError,
  } = useAssessment(assessmentId);
  const [step, setStep] = useState<number | 1 | 2>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const { lineUserId } = useLiff();
  const [isDpoConsentVisible, setIsDpoConsentVisible] = useState(false);

  const handleShowConsent = () => {
    setIsDpoConsentVisible(true);
  };

  const handleCloseConsent = () => {
    setIsDpoConsentVisible(false);
  };

  // Redirect to confirmed page if assessment is already reserved
  useEffect(() => {
    if (assessmentData?.status === "reserved") {
      router.push(`/confirmed/${assessmentId}`);
    }
  }, [assessmentData, assessmentId, router]);

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

  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo(0, 0);
    } else {
      window.location.assign(`${window.location.origin}/my-assessments`);
    }
  };

  const { deviceInfo, conditionInfo, expiredAt } = assessmentData;

  console.log("Price Lock ", expiredAt);

  return (
    <Layout>
      {isDpoConsentVisible && (
        <DPOConsent onAccept={handleCloseConsent} onClose={handleCloseConsent} />
      )}
      <main className="relative flex h-full flex-col items-center overflow-x-hidden bg-white px-4 py-8 text-center sm:py-16">
        <div className="z-10 container flex w-full flex-col items-center">
          {step === 1 && (
            <AssessStep3
              docId={assessmentData.docId}
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              onBack={handleBack}
              onNext={handleNext}
              setSelectedService={setSelectedService}
              priceLockExpiresAt={expiredAt}
              assessmentData={assessmentData}
            />
          )}

          {/* เมื่อสำเร็จจะ push ไปที่หน้า confirmed */}
          {step === 2 && (
            <AssessStep4
              phoneNumber={assessmentData?.phoneNumber}
              customerName={assessmentData?.customerName}
              assessmentId={assessmentId}
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
              lineUserId={lineUserId}
              docId={assessmentData?.docId}
              handleShowConsent={handleShowConsent}
              onBack={handleBack}
              onSuccess={() => {
                router.push(`/confirmed/${assessmentId}`);
              }}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}
