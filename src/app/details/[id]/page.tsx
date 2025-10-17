"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import AssessStep3 from "../(step3)/AssessStep3";
import AssessStep4 from "../(step4)/AssessStep4";
import { useAssessment } from "@/hooks/useAssessment";
import { Skeleton } from "@/components/ui/skeleton";
// Removed useMobile call here to keep Hooks order consistent across renders

export default function AssessmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  const [step, setStep] = useState(1); // 1 = Service Selection (AssessStep3), 2 = Service Form (AssessStep4)
  const [selectedService, setSelectedService] = useState<string>("");

  const { data, isLoading, error } = useAssessment(assessmentId);

  console.log(data);

  if (isLoading) {
    return (
      <Layout>
        <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-white px-4 py-8 sm:py-16">
          <div className="z-10 container flex w-full flex-col items-center">
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Summary card skeleton */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-[150px] w-[150px] rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-10 w-48 rounded-xl" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="mt-6 space-y-2">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
              </div>

              {/* Right: Services panel skeleton */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
                <Skeleton className="mb-4 h-10 w-64 rounded-xl" />
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
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
  };

  // Note: Avoid calling additional hooks after conditional returns
  // If image data is needed, fetch it inside child components that always mount

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
              docId={data.docId}
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
              assessmentId={assessmentId}
              deviceInfo={deviceInfo}
              conditionInfo={conditionInfo}
              selectedService={selectedService}
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
