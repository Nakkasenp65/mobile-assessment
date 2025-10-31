// src/app/confirmed/[assessmentId]/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Icons ---
import { ArrowLeft, HardDrive, Printer, Star, XCircle } from "lucide-react";
import { FaLine, FaPhone } from "react-icons/fa6";

// --- Hooks ---
import { useAssessment } from "@/hooks/useAssessment";
import { useMobile } from "@/hooks/useMobile";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useReactToPrint } from "react-to-print";
import { useLiff } from "@/components/Provider/LiffProvider";
import { useCancelAssessment, AssessmentCancelInput } from "../../../hooks/useUpdateAssessment";

// --- UI Components ---
import Layout from "../../../components/Layout/Layout";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SellNowService from "./components/SellNowService";
import ConsignmentService from "./components/ConsignmentService";
import RefinanceService from "./components/RefinanceService";
import IPhoneExchangeService from "./components/IPhoneExchangeService";
import TradeInService from "./components/TradeInService";
import ConditionInfoDisplay from "./components/ConditionInfoDisplay";

import type { ConditionInfo } from "@/types/device";
import PrintableAssessment from "./components/(print-form)/PrintableAssessment";
import ConfirmCancelModal from "./components/ConfirmCancelModal";
import type { AssessmentServiceType } from "@/types/assessment";
import WebMIcon from "../../../components/ui/WebMIcon";
import { useDeviceDetection } from "../../../hooks/useDeviceDetection";

const LINE_CONTACT_URL = "https://lin.ee/0ab3Rcl";

const PageHeader = () => (
  <div className="py-8 text-center">
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex justify-center">
        <WebMIcon src={"/assets/verification-badge.gif"} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        ยืนยันการจองบริการ
      </h1>
      <p className="mt-3 text-lg text-gray-600">กรุณาตรวจสอบข้อมูลและรายละเอียดการจองให้ถูกต้อง</p>
    </div>
  </div>
);

const DeviceInformation = ({ assessment, productData, isImageLoading, grade, finalPrice }: any) => (
  <Card className="overflow-hidden shadow-sm">
    <CardContent className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Device Image - Compact */}
        <div className="flex flex-1 items-center justify-center">
          {isImageLoading ? (
            <div className="h-24 w-24 animate-pulse rounded-xl bg-gray-200 md:h-28 md:w-28"></div>
          ) : productData?.image_url ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-white md:h-28 md:w-28">
              <Image
                src={productData.image_url}
                alt={assessment.deviceInfo?.model || "Device"}
                fill
                className="object-contain p-2"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 md:h-28 md:w-28">
              <HardDrive className="h-10 w-10 text-gray-400" />
            </div>
          )}
          {/* Device Details - Compact */}

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-sm font-bold text-gray-900 md:text-xl">
                {assessment.deviceInfo?.brand} {assessment.deviceInfo?.model}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
                  <HardDrive className="h-3 w-3" />
                  <span className="text-xs">{assessment.deviceInfo?.storage || "N/A"}</span>
                </Badge>
                <Badge variant="secondary" className="gap-1 bg-amber-50 text-amber-700">
                  <Star className="h-3 w-3" />
                  <span className="text-xs">เกรด {grade || "N/A"}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Price Display - Compact & Modern */}
        <div className="flex-shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 shadow-md">
            <div className="text-center">
              <p className="text-xs font-medium text-orange-100">ราคาประเมิน</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {finalPrice?.toLocaleString() || "N/A"}
              </p>
              <p className="text-xs font-medium text-orange-100">บาท</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ConditionDetails = ({ conditionInfo }: { conditionInfo: ConditionInfo }) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-xl">
        <svg
          className="h-5 w-5 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        รายละเอียดสภาพเครื่อง
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ConditionInfoDisplay conditionInfo={conditionInfo} />
    </CardContent>
  </Card>
);

const ActionButtons = ({ onPrint, onLineContact, onCancel }: any) => (
  <Card className="bg-gradient-to-br shadow-sm">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl">ดำเนินการ</CardTitle>
      <CardDescription>
        จัดการการจองของคุณ หรือติดต่อเจ้าหน้าที่เพื่อรับการช่วยเหลือ
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        {/* Print Document */}
        <Button
          onClick={onPrint}
          size="lg"
          variant="outline"
          className="bg-secondary h-14 gap-1 text-white duration-300 ease-in-out hover:bg-pink-600 hover:text-white"
        >
          <Printer className="h-5 w-5" />
          <span className="font-medium">พิมพ์เอกสาร</span>
        </Button>
        {/* Line Contact */}
        <Button
          onClick={onLineContact}
          size="lg"
          className="h-14 gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <FaLine className="h-5 w-5" />
          <span className="font-medium">ติดต่อผ่าน Line</span>
        </Button>
        {/* Phone Contact */}
        <a
          href="tel:0947878783"
          className="flex h-14 items-center justify-center gap-1 rounded-md bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700"
        >
          <FaPhone className="h-3 w-3" />
          <span className="text-sm font-medium">ติดต่อผ่านโทรศัพท์</span>
        </a>
        {/* WhatsApp Contact */}
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="h-14 gap-1 bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <XCircle className="h-5 w-5" />
          <span className="font-medium">ยกเลิกการจอง</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function ConfirmedAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { lineUserId } = useLiff();
  const assessmentId = params?.assessmentId as string;
  const { isDesktop } = useDeviceDetection();

  // Fetch assessment data from backend
  const {
    data: assessment,
    isLoading,
    error,
    refetch: refetchAssessment,
  } = useAssessment(assessmentId);

  // Product Image Url from Supabase Storage
  const { data: productData, isLoading: isImageLoading } = useMobile(
    assessment?.deviceInfo?.brand,
    assessment?.deviceInfo?.model,
  );
  // Price calculation
  const { grade, finalPrice } = usePriceCalculation(
    assessment?.deviceInfo,
    assessment?.conditionInfo,
  );

  // Cancel assessment mutation
  const cancelAssessment = useCancelAssessment(assessmentId);

  const componentRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handlePrint = useReactToPrint(
    // Print
    {
      documentTitle: `Assessment-Confirmation-${assessmentId}`,
      contentRef: componentRef,
      pageStyle: `
        @font-face {
          font-family: 'LINESeedSansTH';
          src: url('https://fonts.linecorp.com/lineseed-sans-thai/LINESeedSansTH_W_Rg.woff2') format('woff2'),
               url('https://fonts.linecorp.com/lineseed-sans-thai/LINESeedSansTH_W_Rg.woff') format('woff');
          font-weight: 400;
        }
        @font-face {
          font-family: 'LINESeedSansTH';
          src: url('https://fonts.linecorp.com/lineseed-sans-thai/LINESeedSansTH_W_Bd.woff2') format('woff2'),
               url('https://fonts.linecorp.com/lineseed-sans-thai/LINESeedSansTH_W_Bd.woff') format('woff');
          font-weight: 700;
        }
        @page { size: A4; margin: 8mm; }
        @media print {
          html, body {
            font-family: "LINESeedSansTH", sans-serif;
            height: 100%;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            overflow: hidden;
          }
        }
      `,
      suppressErrors: true,
    },
  );

  /**
   * Determines the active service using the type field at root level
   * Much cleaner and simpler than checking for existence of each service info
   */
  const activeService = useMemo(() => {
    if (!assessment) return null;

    // Use the type from root level (new structure)
    const serviceType = assessment.type;

    // Map service type to component
    switch (serviceType) {
      case "SELL_NOW":
        if (assessment.sellNowServiceInfo) {
          return {
            type: serviceType,
            info: assessment.sellNowServiceInfo,
            component: (
              <SellNowService info={assessment.sellNowServiceInfo} assessment={assessment} />
            ),
          };
        }
        break;
      case "CONSIGNMENT":
        if (assessment.consignmentServiceInfo) {
          return {
            type: serviceType,
            info: assessment.consignmentServiceInfo,
            component: (
              <ConsignmentService
                info={assessment.consignmentServiceInfo}
                assessment={assessment}
              />
            ),
          };
        }
        break;
      case "REFINANCE":
        if (assessment.refinanceServiceInfo) {
          return {
            type: serviceType,
            info: assessment.refinanceServiceInfo,
            component: (
              <RefinanceService info={assessment.refinanceServiceInfo} assessment={assessment} />
            ),
          };
        }
        break;
      case "IPHONE_EXCHANGE":
        if (assessment.iphoneExchangeServiceInfo) {
          return {
            type: serviceType,
            info: assessment.iphoneExchangeServiceInfo,
            component: (
              <IPhoneExchangeService
                info={assessment.iphoneExchangeServiceInfo}
                assessment={assessment}
              />
            ),
          };
        }
        break;
      case "TRADE_IN":
        if (assessment.tradeInServiceInfo) {
          return {
            type: serviceType,
            info: assessment.tradeInServiceInfo,
            component: (
              <TradeInService info={assessment.tradeInServiceInfo} assessment={assessment} />
            ),
          };
        }
        break;
    }

    return null;
  }, [assessment]);

  const getAppointmentId = (type: AssessmentServiceType) => {
    switch (type) {
      case "SELL_NOW":
        return assessment?.sellNowServiceInfo?.appointmentId;
      case "CONSIGNMENT":
        return assessment?.consignmentServiceInfo?.appointmentId;
      case "TRADE_IN":
        return assessment?.tradeInServiceInfo?.appointmentId;
      default:
        return undefined;
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const input: AssessmentCancelInput = {
        docId: assessment.docId,
        appointmentId: getAppointmentId(assessment.type),
      };
      await cancelAssessment.mutateAsync(input);
      setIsCancelling(false);
      // const targetPage = lineUserId ? "/line-assessments" : "/my-assessments";
      // router.replace(targetPage);
      // TODO: Show success message
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  const handleBack = () => {
    // Navigate to appropriate page based on user type (LINE or web)
    const targetPage = lineUserId ? "/line-assessments" : "/my-assessments";
    router.push(targetPage);
  };

  useEffect(() => {
    // Don't redirect while loading or before assessment is available
    if (isLoading) return;
    // If we couldn't load assessment, let the error handling render the fallback UI
    if (!assessment) return;

    const confirmed = assessment.status === "reserved" || assessment.status === "completed";
    if (!confirmed) {
      router.replace(`/details/${assessmentId}`);
    }
  }, [isLoading, assessment, assessmentId, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loading />
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลการจอง...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !assessment) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center border bg-gray-50 p-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">ไม่พบข้อมูลการจอง</h1>
          <p className="mt-2 max-w-md text-gray-600">
            ขออภัย, เราไม่พบข้อมูลตามรหัสที่ระบุ หรือข้อมูลอาจถูกลบไปแล้ว
          </p>
          <Button onClick={handleBack} className="mt-6 gap-2" size="lg">
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าก่อนหน้า
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 print:hidden">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader />

            <main className="mx-auto max-w-4xl space-y-8">
              {activeService?.component}

              <DeviceInformation
                assessment={assessment}
                productData={productData}
                isImageLoading={isImageLoading}
                grade={grade}
                finalPrice={finalPrice}
              />

              <ConditionDetails conditionInfo={assessment.conditionInfo} />

              <ActionButtons
                onPrint={handlePrint}
                onLineContact={() =>
                  isDesktop
                    ? window.open(LINE_CONTACT_URL, "_blank")
                    : window.open("https://line.me/R/oaMessage/@okmobile/?ติดต่อเจ้าหน้าที่")
                }
                onCancel={() => setShowCancelModal(true)}
              />

              <div className="flex justify-start pt-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  className="group gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 hover:text-black hover:shadow-md"
                >
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">กลับไปหน้าค้นหาการประเมิน</span>
                </Button>
              </div>
            </main>
          </div>
        </div>

        <ConfirmCancelModal
          assessmentId={assessment?.id}
          isOpen={showCancelModal}
          setIsOpen={setShowCancelModal}
          onConfirm={handleCancelBooking}
          isSuccess={cancelAssessment.isSuccess}
          title="ยืนยันการยกเลิก?"
          isLoading={isCancelling}
          refetchAfterSuccess={() => {
            refetchAssessment();
          }}
          description="ข้อมูลการประเมินจะยังคงอยู่ ท่านสามารถจองบริการอื่นๆได้ทันที หลังจากยกเลิกบริการ"
        />
      </Layout>

      {/* Hidden printable component - positioned absolutely off-screen */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <PrintableAssessment ref={componentRef} assessment={assessment} />
      </div>
    </>
  );
}
