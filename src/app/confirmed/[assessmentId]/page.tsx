// src/app/confirmed/[assessmentId]/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout/Layout";
import Image from "next/image";
import {
  HardDrive,
  CheckCircle,
  ArrowLeft,
  Printer,
  PhoneCall,
  XCircle,
  Star,
  MessageCircle,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useAssessment } from "@/hooks/useAssessment";
import { useMobile } from "@/hooks/useMobile";
import { ASSESSMENT_QUESTIONS } from "@/util/info";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import PrintableAssessment from "./components/PrintableAssessment";
import SellNowService from "./components/SellNowService";
import ConsignmentService from "./components/ConsignmentService";
import RefinanceService from "./components/RefinanceService";
import IPhoneExchangeService from "./components/IPhoneExchangeService";
import PawnService from "./components/PawnService";
import TradeInService from "./components/TradeInService";
import type { Assessment } from "@/types/assessment";
import type { ConditionInfo, DeviceInfo } from "@/types/device";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReactToPrint } from "react-to-print";
import type {
  SellNowServiceInfo,
  PawnServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
  TradeInServiceInfo,
} from "@/types/service";

// Helper: map ConditionInfo keys and values to Thai labels using ASSESSMENT_QUESTIONS
function getConditionItems(conditionInfo: ConditionInfo | undefined) {
  if (!conditionInfo) return [];

  return Object.entries(conditionInfo)
    .filter(([key]) => key !== "id" && key !== "assessmentId")
    .map(([key, value]) => {
      const question = ASSESSMENT_QUESTIONS.find((section) =>
        section.questions.some((q) => q.id === key),
      );
      const questionItem = question?.questions.find((q) => q.id === key);
      return {
        id: key,
        question: questionItem?.question || key,
        answer: value === true ? "ใช่" : value === false ? "ไม่ใช่" : value || "-",
      };
    });
}

export default function ConfirmedAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params?.assessmentId as string | undefined;
  const { data, isLoading, error } = useAssessment(assessmentId);
  const assessment = data as Assessment;

  // Initialize hooks first to avoid conditional hook calls
  const { data: productData, isLoading: isImageLoading } = useMobile(
    assessment?.deviceInfo?.brand,
    assessment?.deviceInfo?.model,
  );

  const conditionItems = useMemo(
    () => getConditionItems(assessment?.conditionInfo),
    [assessment?.conditionInfo],
  );

  const { grade, finalPrice } = usePriceCalculation(
    (assessment?.deviceInfo || {}) as DeviceInfo,
    (assessment?.conditionInfo || {}) as ConditionInfo,
  );

  // Print reference and handler
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `Assessment-Confirmation-${assessmentId}`,
    contentRef: componentRef,
    onAfterPrint: () => console.log("Printing completed"),
    // removeAfterPrint is not a valid option in UseReactToPrintOptions
  });

  // Cancel state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Service info extraction
  const serviceInfo = useMemo(() => {
    if (!assessment) return null;

    const {
      sellNowServiceInfo,
      pawnServiceInfo,
      consignmentServiceInfo,
      refinanceServiceInfo,
      iphoneExchangeServiceInfo,
      tradeInServiceInfo,
    } = assessment;

    // Find the active service
    if (sellNowServiceInfo) {
      return { type: "sellNow", info: sellNowServiceInfo };
    } else if (pawnServiceInfo) {
      return { type: "pawn", info: pawnServiceInfo };
    } else if (consignmentServiceInfo) {
      return { type: "consignment", info: consignmentServiceInfo };
    } else if (refinanceServiceInfo) {
      return { type: "refinance", info: refinanceServiceInfo };
    } else if (iphoneExchangeServiceInfo) {
      return { type: "iphoneExchange", info: iphoneExchangeServiceInfo };
    } else if (tradeInServiceInfo) {
      return { type: "tradeIn", info: tradeInServiceInfo };
    }

    return null;
  }, [assessment]);

  // Service component selection
  const ServiceComponent = useMemo(() => {
    if (!serviceInfo) return null;

    switch (serviceInfo.type) {
      case "sellNow":
        return (
          <SellNowService info={serviceInfo.info as SellNowServiceInfo} assessment={assessment} />
        );
      case "pawn":
        return <PawnService info={serviceInfo.info as PawnServiceInfo} assessment={assessment} />;
      case "consignment":
        return (
          <ConsignmentService
            info={serviceInfo.info as ConsignmentServiceInfo}
            assessment={assessment}
          />
        );
      case "refinance":
        return (
          <RefinanceService
            info={serviceInfo.info as RefinanceServiceInfo}
            assessment={assessment}
          />
        );
      case "iphoneExchange":
        return (
          <IPhoneExchangeService
            info={serviceInfo.info as IPhoneExchangeServiceInfo}
            assessment={assessment}
          />
        );
      case "tradeIn":
        return (
          <TradeInService info={serviceInfo.info as TradeInServiceInfo} assessment={assessment} />
        );
      default:
        return null;
    }
  }, [serviceInfo, assessment]);

  // Support phone
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";
  const handleBack = () => router.back();

  const handleContact = () => {
    window.open("tel:0989509222", "_self");
  };

  const handleLineContact = () => {
    // Open Line messaging - you can customize this URL based on your Line official account
    window.open("https://line.me/R/ti/p/@no1money", "_blank");
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    alert("ยกเลิกการจองเรียบร้อย");
    router.back();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !assessment) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">ไม่พบข้อมูลการจอง</h1>
          <p className="mb-6 text-gray-600">
            ไม่พบข้อมูลการจองบริการตามรหัสที่ระบุ หรือข้อมูลอาจถูกลบไปแล้ว
          </p>
          <Button onClick={handleBack} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> กลับไปหน้าหลัก
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* Hidden component for printing */}
      <div className="hidden">
        <PrintableAssessment ref={componentRef} assessment={assessment} />
      </div>

      <Layout>
        <div className="min-h-screen bg-white print:hidden">
          <div className="relative">
            {/* Header with gradient */}
            <div className="bg-gradient-to-b from-blue-50 to-white pt-12 pb-8">
              <div className="container mx-auto px-4">
                <h1 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
                  ยืนยันการจองบริการ
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600 md:text-base">
                  กรุณาตรวจสอบข้อมูลและรายละเอียดการจองให้ถูกต้อง
                </p>
              </div>
            </div>

            {/* Main content */}
            <main className="container mx-auto -mt-6 px-4 pb-20">
              <div className="space-y-6">
                {/* Service Component */}
                {ServiceComponent}

                {/* Device Information */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <div className="flex flex-col gap-4 md:flex-row">
                    {/* Device Image */}
                    <div className="flex items-center justify-center md:w-1/3">
                      {isImageLoading ? (
                        <div className="h-48 w-48 animate-pulse rounded-xl bg-gray-200"></div>
                      ) : productData?.image_url ? (
                        <div className="relative h-48 w-48">
                          <Image
                            src={productData.image_url}
                            alt={assessment.deviceInfo?.model || "Device"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-48 w-48 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                          <HardDrive className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Device Details */}
                    <div className="flex-1">
                      <h2 className="mb-2 text-xl font-bold text-gray-900">
                        {assessment.deviceInfo?.brand} {assessment.deviceInfo?.model}
                      </h2>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          <HardDrive className="h-3 w-3" />
                          {assessment.deviceInfo?.storage || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          <Star className="h-3 w-3" />
                          เกรด {grade || "N/A"}
                        </span>
                      </div>

                      {/* Price Highlight */}
                      <div className="mb-4 rounded-lg bg-orange-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-700">ราคาประเมิน</span>
                          <span className="text-xl font-bold text-orange-700">
                            {finalPrice?.toLocaleString() || "N/A"} บาท
                          </span>
                        </div>
                      </div>

                      {/* Condition Summary */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-700">สภาพเครื่อง</h3>
                        <div className="flex flex-wrap gap-1">
                          {conditionItems.slice(0, 3).map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {item.question}
                            </span>
                          ))}
                          {conditionItems.length > 3 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                              +{conditionItems.length - 3} อื่นๆ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Condition Details Accordion */}
                <Accordion
                  type="single"
                  collapsible
                  className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                >
                  <AccordionItem value="condition" className="border-0 px-6 py-2">
                    <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
                      รายละเอียดสภาพเครื่อง
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="space-y-3">
                        {conditionItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-2 text-sm">
                            <div className="mt-0.5">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.question}</p>
                              <p className="text-gray-600">{item.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Actions section with redesigned buttons */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">การดำเนินการ</h3>

                  {/* Primary Actions Row */}
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Print Button - Primary */}
                    <Button
                      onClick={handlePrint}
                      className="h-14 bg-blue-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                      aria-label="พิมพ์เอกสารการประเมิน"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Printer className="h-5 w-5" />
                        <span className="text-sm font-medium">พิมพ์เอกสาร</span>
                      </div>
                    </Button>

                    {/* Line Contact Button - Green Theme */}
                    <Button
                      onClick={handleLineContact}
                      className="h-14 bg-green-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-xl"
                      aria-label="ติดต่อผ่าน Line"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Line ติดต่อ</span>
                      </div>
                    </Button>

                    {/* Phone Contact Button */}
                    <Button
                      variant="outline"
                      onClick={handleContact}
                      className="h-14 border-2 border-gray-300 bg-white text-gray-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg"
                      aria-label="โทรติดต่อเจ้าหน้าที่"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <PhoneCall className="h-5 w-5" />
                        <span className="text-sm font-medium">โทรติดต่อ</span>
                      </div>
                    </Button>

                    {/* Back Button */}
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="h-14 border-2 border-gray-300 bg-white text-gray-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg"
                      aria-label="กลับไปหน้าก่อนหน้า"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">กลับ</span>
                      </div>
                    </Button>
                  </div>

                  {/* Secondary Actions Row */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Cancel Button - Destructive */}
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelConfirm(true)}
                        className="h-12 bg-red-600 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg sm:w-auto"
                        aria-label="ยกเลิกการจองบริการ"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        <span className="font-medium">ยกเลิกการจอง</span>
                      </Button>

                      {/* Support Info */}
                      <div className="text-center sm:text-right">
                        <p className="text-sm text-gray-600">ต้องการความช่วยเหลือ?</p>
                        <p className="text-lg font-bold text-gray-900">{supportPhone}</p>
                        <p className="text-xs text-gray-500">บริการลูกค้าทุกวัน 9:00 - 18:00 น.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>

        {/* Cancel Confirmation Modal - Simple overlay instead of Dialog */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">ยืนยันการยกเลิกการจอง</h3>
              </div>
              <div className="mb-6 space-y-3 text-sm text-gray-700">
                <p>คุณต้องการยกเลิกการจองบริการนี้หรือไม่?</p>
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-700">
                    การยกเลิกการจองอาจมีผลต่อเงื่อนไขการคืนเงินตามนโยบายบริษัท
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                >
                  ปิด
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelConfirm}
                  className="flex-1 gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  ยืนยันยกเลิก
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* A4 Print Styles */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            body {
              margin: 0;
              padding: 0;
            }

            body * {
              visibility: hidden;
            }

            .hidden > * {
              visibility: visible;
            }

            .hidden {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}
