// src/app/confirmed/[assessmentId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import {
  CheckCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Banknote,
  MessageSquare,
  ArrowLeft,
  ClipboardCheck,
  ChevronDown,
  Printer,
  CardSim, // ✨ 1. Import Printer icon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableAssessment from "./components/PrintableAssessment";
import { AssessmentRecord } from "@/types/assessment";
import Footer from "@/app/(landing-page)/components/Footer";
import { useMobile } from "@/hooks/useMobile";
import { ASSESSMENT_QUESTIONS } from "@/util/info";
import type { ConditionInfo } from "@/types/device";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";

// Support contact info (static)
const support = {
  phone: "098-950-9222",
  lineUrl: "https://line.me/ti/p/~@no1money",
};

export default function AssessmentConfirmationPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  // ✨ 5. สร้าง Ref และ Hook สำหรับการพิมพ์
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Assessment-Confirmation-${assessmentId}`,
  });

  // Mock record aligned to global AssessmentRecord type
  const mockRecord: AssessmentRecord = {
    id: assessmentId,
    docId: "AS-202510-0010",
    phoneNumber: "0987444366",
    status: "pending",
    estimatedValue: 19999,
    assessmentDate: "2025-10-15T16:18:51.239Z",
    priceLockExpiresAt: "2025-10-22T16:18:51.239Z",
    deviceInfo: {
      brand: "Apple",
      model: "iPhone 16e",
      storage: "128 GB",
    },
    conditionInfo: {
      canUnlockIcloud: true,
      modelType: "model_th",
      warranty: "warranty_active_long",
      accessories: "acc_full",
      bodyCondition: "body_mint",
      screenGlass: "glass_ok",
      screenDisplay: "display_ok",
      batteryHealth: "battery_health_high",
      camera: "camera_ok",
      wifi: "wifi_failed",
      faceId: "biometric_ok",
      speaker: "speaker_ok",
      mic: "mic_ok",
      touchScreen: "touchscreen_ok",
      charger: "charger_ok",
      call: "call_ok",
      homeButton: "home_button_ok",
      sensor: "sensor_ok",
      buttons: "buttons_ok",
    },
    sellNowServiceInfo: {
      customerName: "นาคเสน พุทธเจริญ",
      phone: "0987777777",
      locationType: "home",
      appointmentDate: "2025-10-17",
      appointmentTime: "12:00",
      addressDetails: "เซ็นเตอร์ วัน ถนนราชวิถี",
      province: "กรุงเทพมหานคร",
      district: "เขตราชเทวี",
      subdistrict: "แขวงถนนพญาไท",
      postcode: "10400",
      nextSteps: [
        "เราจะติดต่อคุณเพื่อยืนยันการนัดหมายภายใน 24 ชั่วโมง",
        "โปรดเตรียมเครื่องโทรศัพท์ของคุณให้พร้อมสำหรับการตรวจสอบสภาพ",
        "นำเครื่องโทรศัพท์ของคุณมายังสถานที่นัดหมายตามวันและเวลาที่กำหนด",
        "เตรียมเอกสารที่จำเป็น เช่น บัตรประชาชน หรือเอกสารยืนยันความเป็นเจ้าของ",
      ],
    },
    createdAt: "2025-10-15T16:18:51.239Z",
    updatedAt: "2025-10-15T16:18:51.239Z",
  };

  // Derive selected service label for UI display
  const selectedServiceLabel = mockRecord.sellNowServiceInfo
    ? "บริการขายทันที"
    : mockRecord.pawnServiceInfo
      ? "บริการจำนำ"
      : mockRecord.consignmentServiceInfo
        ? "บริการฝากขาย"
        : mockRecord.refinanceServiceInfo
          ? "บริการรีไฟแนนซ์"
          : mockRecord.iphoneExchangeServiceInfo
            ? "ไอโฟนแลกเงิน"
            : "บริการไม่ระบุ";

  // ดึงรูปภาพอุปกรณ์จาก Supabase ผ่าน useMobile
  const { data: productData, isLoading: isImageLoading } = useMobile(
    mockRecord.deviceInfo.brand,
    mockRecord.deviceInfo.model,
  );

  // ที่อยู่สถานที่นัดหมาย (รวมค่าให้เป็นข้อความเดียว)
  const locationText =
    mockRecord.sellNowServiceInfo?.locationType === "home"
      ? [
          mockRecord.sellNowServiceInfo.addressDetails,
          mockRecord.sellNowServiceInfo.subdistrict,
          mockRecord.sellNowServiceInfo.district,
          mockRecord.sellNowServiceInfo.province,
          mockRecord.sellNowServiceInfo.postcode,
        ]
          .filter(Boolean)
          .join(" ")
      : "สถานที่นัดหมายตามที่ระบุ";

  return (
    <>
      {/* ส่วนนี้คือ Component ที่ซ่อนไว้สำหรับพิมพ์ จะไม่แสดงบนหน้าจอปกติ */}
      <div className="hidden">
        <PrintableAssessment ref={componentRef} assessment={mockRecord} />
      </div>

      <Layout>
        {/* ใช้ print:hidden เพื่อซ่อน Layout หลักทั้งหมดเมื่อสั่งพิมพ์ */}
        <div className="min-h-screen bg-white print:hidden">
          {/* Header with gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,200,124,0.1),transparent_50%)]" />

            <div className="relative mx-auto max-w-3xl px-6 py-8 sm:px-8">
              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">ยืนยันนัดหมายสำเร็จ</h1>
                  <p className="mt-2 text-lg text-gray-600">
                    รหัสการประเมิน <span className="font-semibold text-gray-900">#{mockRecord.docId}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Price Card - Most Important */}
            <div className="from-primary to-secondary mb-8 overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-center shadow-lg">
              <p className="mb-2 text-sm font-medium tracking-wide text-white/90 uppercase">ราคาประเมินสุดท้าย</p>
              <p className="text-6xl font-bold text-white">฿{mockRecord.estimatedValue.toLocaleString()}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-white/90">
                <Banknote className="h-5 w-5" />
                <span className="text-sm font-medium">{selectedServiceLabel}</span>
              </div>
            </div>

            {/* Device Info */}
            <div className="mb-8 rounded-2xl bg-gray-50 p-6 sm:p-8">
              {/* Device Info Container */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Image + Details wrapper */}
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  {/* Device Image */}
                  <div className="flex-shrink-0">
                    {isImageLoading ? (
                      <div className="h-[100px] w-[100px] rounded-xl bg-white p-2 shadow-sm" />
                    ) : productData?.image_url ? (
                      <Image
                        src={productData.image_url}
                        alt={`${mockRecord.deviceInfo.brand} ${mockRecord.deviceInfo.model}`}
                        width={100}
                        height={100}
                        className="rounded-xl bg-white object-contain p-2 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-xl bg-white p-2 text-xs text-slate-500 shadow-sm">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>
                  {/* Device Details */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-foreground text-md leading-tight font-bold sm:text-xl">
                      {mockRecord.deviceInfo.brand} {mockRecord.deviceInfo.model || mockRecord.deviceInfo.productType}
                    </h3>
                    {mockRecord.deviceInfo.storage && (
                      <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        <CardSim className="h-3.5 w-3.5" />
                        <span>{mockRecord.deviceInfo.storage}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grade badge pushed to the right */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center self-center rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm sm:h-20 sm:w-20 sm:self-auto dark:from-green-900/20 dark:to-emerald-900/20"
                >
                  <span className="text-3xl font-black text-green-600 sm:text-5xl dark:text-green-400">A</span>
                </motion.div>
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900">สภาพตัวเครื่อง</h2>
                {(() => {
                  const ci: Partial<ConditionInfo> = mockRecord.conditionInfo ?? ({} as Partial<ConditionInfo>);
                  const questions = ASSESSMENT_QUESTIONS.flatMap((s) => s.questions);
                  const getMeta = (key: keyof ConditionInfo) => questions.find((q) => q.id === key);
                  const getOptionLabel = (key: keyof ConditionInfo, value?: string) => {
                    if (!value) return "ไม่ระบุ";
                    const meta = getMeta(key);
                    const opt = meta?.options.find((o) => o.id === value);
                    return opt?.label ?? "ไม่ระบุ";
                  };

                  const items: Array<{ label: string; value: string }> = [
                    {
                      label: getMeta("bodyCondition")?.question ?? "สภาพตัวเครื่อง",
                      value: getOptionLabel("bodyCondition", ci.bodyCondition),
                    },
                    {
                      label: getMeta("batteryHealth")?.question ?? "สุขภาพแบตเตอรี่",
                      value: getOptionLabel("batteryHealth", ci.batteryHealth),
                    },
                    {
                      label: getMeta("accessories")?.question ?? "อุปกรณ์ในกล่อง",
                      value: getOptionLabel("accessories", ci.accessories),
                    },
                    {
                      label: getMeta("screenGlass")?.question ?? "สภาพกระจกหน้าจอ",
                      value: getOptionLabel("screenGlass", ci.screenGlass),
                    },
                    {
                      label: getMeta("screenDisplay")?.question ?? "คุณภาพการแสดงผล",
                      value: getOptionLabel("screenDisplay", ci.screenDisplay),
                    },
                    { label: getMeta("wifi")?.question ?? "Wi‑Fi / Bluetooth", value: getOptionLabel("wifi", ci.wifi) },
                    {
                      label: getMeta("faceId")?.question ?? "Face ID / Touch ID",
                      value: getOptionLabel("faceId", ci.faceId),
                    },
                    {
                      label: getMeta("speaker")?.question ?? "ลำโพงและการสั่น",
                      value: getOptionLabel("speaker", ci.speaker),
                    },
                    { label: getMeta("mic")?.question ?? "ไมโครโฟน", value: getOptionLabel("mic", ci.mic) },
                    {
                      label: getMeta("touchScreen")?.question ?? "การสัมผัสหน้าจอ",
                      value: getOptionLabel("touchScreen", ci.touchScreen),
                    },
                    {
                      label: getMeta("charger")?.question ?? "การชาร์จไฟ",
                      value: getOptionLabel("charger", ci.charger),
                    },
                    { label: getMeta("call")?.question ?? "การโทร", value: getOptionLabel("call", ci.call) },
                    {
                      label: getMeta("homeButton")?.question ?? "ปุ่ม Home",
                      value: getOptionLabel("homeButton", ci.homeButton),
                    },
                    { label: getMeta("sensor")?.question ?? "Sensor", value: getOptionLabel("sensor", ci.sensor) },
                    {
                      label: getMeta("buttons")?.question ?? "ปุ่ม Power / Volume",
                      value: getOptionLabel("buttons", ci.buttons),
                    },
                    {
                      label: getMeta("modelType")?.question ?? "รุ่นโมเดลเครื่อง",
                      value: getOptionLabel("modelType", ci.modelType),
                    },
                    {
                      label: getMeta("warranty")?.question ?? "ประกันศูนย์",
                      value: getOptionLabel("warranty", ci.warranty),
                    },
                    { label: "ปลดล็อก iCloud", value: ci.canUnlockIcloud ? "ทำได้" : "ทำไม่ได้" },
                  ];

                  return (
                    <Accordion type="single" collapsible className="rounded-2xl bg-white p-6 shadow-lg">
                      <AccordionItem value="device-condition" className="border-0">
                        <AccordionTrigger className="group flex w-full items-center justify-between text-left text-sm font-bold text-gray-900 hover:no-underline">
                          <span>รายละเอียดสภาพเครื่อง</span>
                          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                            {items.map((item, index) => (
                              <div key={index}>
                                <p className="text-xs text-black">
                                  <span className="font-bold">{item.label}:</span> {item.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>
            </div>

            {/* Booking + Next Steps (Responsive Grid) */}
            <div className="mb-12 grid grid-cols-1 gap-8">
              {/* Booking Info */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
                <h2 className="mb-4 text-lg font-bold text-gray-900">ข้อมูลการจอง</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">รหัสการประเมิน</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{mockRecord.docId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">บริการ</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{selectedServiceLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">วันที่และเวลา</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {mockRecord.sellNowServiceInfo?.appointmentDate}, {mockRecord.sellNowServiceInfo?.appointmentTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="w-max text-sm text-gray-500">สถานที่</span>
                    </div>
                    <span className="text-right text-sm font-semibold text-gray-900">{locationText}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">ชื่อผู้นัดหมาย</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {mockRecord.sellNowServiceInfo?.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">เบอร์โทรศัพท์</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{mockRecord.sellNowServiceInfo?.phone}</span>
                  </div>
                </div>
                <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handlePrint}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-2 py-2 text-white shadow-lg transition hover:scale-[1.02] hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:outline-none"
                    aria-label="พิมพ์เอกสาร"
                  >
                    <Printer className="h-5 w-5" />
                    <span className="font-semibold">พิมพ์เอกสาร</span>
                  </button>
                  <a
                    href={support.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-2 py-2 font-semibold text-gray-700 shadow-sm transition hover:scale-[1.02] hover:border-gray-400"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>ติดต่อเจ้าหน้าที่</span>
                  </a>
                </div>
              </div>

              {/* Next Steps */}
              <div className="rounded-2xl bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">ขั้นตอนต่อไป</h2>
                <ol className="space-y-3 text-gray-800">
                  {mockRecord.sellNowServiceInfo?.nextSteps?.map((text, index) => (
                    <li key={index} className="flex items-center gap-4">
                      {/* Fun gradient number badge */}
                      <div className="relative h-6 w-6">
                        <span className="absolute top-1/2 left-1/2 inline-flex h-6 w-6 flex-shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-xs font-extrabold text-white shadow-md">
                          {index + 1}
                        </span>
                      </div>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Support Section */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-bold text-gray-900">ต้องการความช่วยเหลือ?</h3>
              <p className="mb-6 text-sm text-gray-600">หากมีข้อสงสัยหรือต้องการเปลี่ยนแปลงนัดหมาย</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={support.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-105"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>ติดต่อทาง LINE</span>
                </a>
                <a
                  href={`tel:${support.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-transform hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  <span>{support.phone}</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 border-t border-gray-200 pt-8 sm:flex-row sm:justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">กลับไปที่หน้าแรก</span>
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </Layout>
    </>
  );
}
