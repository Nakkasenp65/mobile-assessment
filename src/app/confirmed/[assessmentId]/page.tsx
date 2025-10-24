// src/app/confirmed/[assessmentId]/page.tsx

"use client";

import { useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Icons ---
import {
  ArrowLeft,
  HardDrive,
  Printer,
  Star,
  XCircle,
  MessageCircle, // Kept for potential future use
} from "lucide-react";
import { FaLine } from "react-icons/fa6";

// --- Hooks ---
import { useAssessment } from "@/hooks/useAssessment";
import { useMobile } from "@/hooks/useMobile";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { useReactToPrint } from "react-to-print";

// --- UI Components ---
import Layout from "../../../components/Layout/Layout";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Service Components ---
import SellNowService from "./components/SellNowService";
import ConsignmentService from "./components/ConsignmentService";
import RefinanceService from "./components/RefinanceService";
import IPhoneExchangeService from "./components/IPhoneExchangeService";
import PawnService from "./components/PawnService";
import TradeInService from "./components/TradeInService";
import ConditionInfoDisplay from "./components/ConditionInfoDisplay";

// --- Types ---
import type { Assessment } from "@/types/assessment";
import type { ConditionInfo, DeviceInfo } from "@/types/device";
import type {
  SellNowServiceInfo,
  PawnServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
  TradeInServiceInfo,
} from "@/types/service";
import PrintableAssessment from "./components/PrintableAssessment";

// --- Constants ---
const LINE_CONTACT_URL = "https://lin.ee/0ab3Rcl";

// --- Sub-components for better organization ---

const PageHeader = () => (
  <div className="py-8 text-center">
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
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
        <div className="flex-shrink-0">
          {isImageLoading ? (
            <div className="h-24 w-24 animate-pulse rounded-xl bg-gray-200 md:h-28 md:w-28"></div>
          ) : productData?.image_url ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white md:h-28 md:w-28">
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
        </div>

        {/* Device Details - Compact */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 md:text-xl">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Button
          onClick={onPrint}
          size="lg"
          variant="outline"
          className="bg-secondary h-14 gap-3 text-white duration-300 ease-in-out hover:bg-pink-600 hover:text-white"
        >
          <Printer className="h-5 w-5" />
          <span className="font-medium">พิมพ์เอกสาร</span>
        </Button>
        <Button
          onClick={onLineContact}
          size="lg"
          className="h-14 gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <FaLine className="h-5 w-5" />
          <span className="font-medium">ติดต่อผ่าน Line</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="h-14 gap-3 bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          <XCircle className="h-5 w-5" />
          <span className="font-medium">ยกเลิกการจอง</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const CancelBookingModal = ({ open, onClose, onConfirm, isCancelling }: any) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
        <DialogTitle className="text-center text-xl">ยืนยันการยกเลิกการจอง</DialogTitle>
        <DialogDescription className="text-center text-base">
          คุณต้องการยกเลิกการจองบริการนี้ใช่หรือไม่?
          <br />
          การดำเนินการนี้อาจส่งผลต่อเงื่อนไขการใช้บริการในอนาคต
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isCancelling}
          className="w-full sm:w-auto"
        >
          ปิด
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isCancelling}
          className="w-full gap-2 sm:w-auto"
        >
          {isCancelling ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              กำลังยกเลิก...
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              ยืนยันการยกเลิก
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// --- Main Page Component ---
export default function ConfirmedAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.assessmentId as string;

  const { data: assessment, isLoading, error } = useAssessment(assessmentId);
  const { data: productData, isLoading: isImageLoading } = useMobile(
    assessment?.deviceInfo?.brand,
    assessment?.deviceInfo?.model,
  );
  const { grade, finalPrice } = usePriceCalculation(
    assessment?.deviceInfo,
    assessment?.conditionInfo,
  );

  const componentRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handlePrint = useReactToPrint({
    documentTitle: `Assessment-Confirmation-${assessmentId}`,
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 8mm;
      }
      @media print {
        html, body {
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
  });

  const serviceComponentMap: Record<string, React.ReactElement | null> = useMemo(() => {
    if (!assessment) return {};
    return {
      sellNow: assessment.sellNowServiceInfo ? (
        <SellNowService info={assessment.sellNowServiceInfo} assessment={assessment} />
      ) : null,
      pawn: assessment.pawnServiceInfo ? (
        <PawnService info={assessment.pawnServiceInfo} assessment={assessment} />
      ) : null,
      consignment: assessment.consignmentServiceInfo ? (
        <ConsignmentService info={assessment.consignmentServiceInfo} assessment={assessment} />
      ) : null,
      refinance: assessment.refinanceServiceInfo ? (
        <RefinanceService info={assessment.refinanceServiceInfo} assessment={assessment} />
      ) : null,
      iphoneExchange: assessment.iphoneExchangeServiceInfo ? (
        <IPhoneExchangeService
          info={assessment.iphoneExchangeServiceInfo}
          assessment={assessment}
        />
      ) : null,
      tradeIn: assessment.tradeInServiceInfo ? (
        <TradeInService info={assessment.tradeInServiceInfo} assessment={assessment} />
      ) : null,
    };
  }, [assessment]);

  const activeService = useMemo(() => {
    if (!assessment) return null;
    const services = [
      { key: "sellNow", info: assessment.sellNowServiceInfo },
      { key: "pawn", info: assessment.pawnServiceInfo },
      { key: "consignment", info: assessment.consignmentServiceInfo },
      { key: "refinance", info: assessment.refinanceServiceInfo },
      { key: "iphoneExchange", info: assessment.iphoneExchangeServiceInfo },
      { key: "tradeIn", info: assessment.tradeInServiceInfo },
    ];
    const found = services.find((service) => service.info);
    return found ? { type: found.key, component: serviceComponentMap[found.key] } : null;
  }, [assessment, serviceComponentMap]);

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      // TODO: Implement the actual API call to cancel the booking
      // await cancelBookingAPI(assessmentId);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use a toast notification for better UX
      // toast.success("ยกเลิกการจองเรียบร้อยแล้ว");
      alert("ยกเลิกการจองเรียบร้อยแล้ว");

      router.back();
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      // toast.error("เกิดข้อผิดพลาดในการยกเลิกการจอง");
      alert("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  const handleBack = () => router.back();

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

              {assessment.conditionInfo && (
                <ConditionDetails conditionInfo={assessment.conditionInfo} />
              )}

              <ActionButtons
                onPrint={handlePrint}
                onLineContact={() => window.open(LINE_CONTACT_URL, "_blank")}
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
                  <span className="font-medium">กลับ</span>
                </Button>
              </div>
            </main>
          </div>
        </div>

        <CancelBookingModal
          open={showCancelModal}
          onClose={() => !isCancelling && setShowCancelModal(false)}
          onConfirm={handleCancelBooking}
          isCancelling={isCancelling}
        />
      </Layout>

      {/* Hidden printable component - positioned absolutely off-screen */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <PrintableAssessment ref={componentRef} assessment={assessment} />
      </div>
    </>
  );
}
