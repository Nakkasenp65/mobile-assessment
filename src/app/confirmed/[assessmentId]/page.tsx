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
  Shield,
  UserCheck,
  Package,
  ClipboardCheck,
  Printer, // ✨ 1. Import Printer icon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableAssessment from "./components/PrintableAssessment";
import Footer from "@/app/(landing-page)/components/Footer";

const mockData = {
  device: {
    imageUrl: "https://lh3.googleusercontent.com/d/14EB_azrtiSrLtPVlIxWiU5Vg1hS8aw1A",
    name: "Apple iPhone 15 Pro",
    storage: "256GB",
  },
  finalPrice: 28500,
  conditionGrade: "A",
  selectedService: "บริการขายทันที",
  appointment: {
    customerName: "คุณสมชาย ใจดี",
    phone: "081-234-5678",
    location: "BTS สถานีสยาม",
    date: "25 ตุลาคม 2568",
    time: "14:00 - 15:00 น.",
  },
  conditionDetails: [
    { label: "สภาพตัวเครื่อง", value: "เหมือนใหม่" },
    { label: "สุขภาพแบตเตอรี่", value: "มากกว่า 90%" },
    { label: "อุปกรณ์ในกล่อง", value: "ครบกล่อง" },
    { label: "การแสดงผลหน้าจอ", value: "ปกติ" },
  ],
  support: {
    phone: "098-950-9222",
    lineUrl: "https://line.me/ti/p/~@no1money",
  },
};

const nextSteps = [
  {
    icon: UserCheck,
    title: "เตรียมเอกสาร",
    description: "เตรียมบัตรประชาชนตัวจริงของท่านให้พร้อม",
  },
  {
    icon: Package,
    title: "เตรียมอุปกรณ์",
    description: "นำอุปกรณ์และอุปกรณ์เสริม (ถ้ามี) ไปที่จุดนัดหมาย",
  },
  {
    icon: ClipboardCheck,
    title: "รอการตรวจสอบ",
    description: "ทีมงานจะตรวจสอบอุปกรณ์และดำเนินการในขั้นตอนสุดท้าย",
  },
];

export default function AssessmentConfirmationPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  // ✨ 5. สร้าง Ref และ Hook สำหรับการพิมพ์
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Assessment-Confirmation-${assessmentId}`,
  });

  return (
    <>
      {/* ส่วนนี้คือ Component ที่ซ่อนไว้สำหรับพิมพ์ จะไม่แสดงบนหน้าจอปกติ */}
      <div className="hidden">
        <PrintableAssessment ref={componentRef} assessmentId={assessmentId} data={mockData} />
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
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    ยืนยันนัดหมายสำเร็จ
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    รหัสการประเมิน <span className="font-semibold text-gray-900">{assessmentId}</span>
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
              <p className="text-6xl font-bold text-white">฿{mockData.finalPrice.toLocaleString()}</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-white/90">
                <Banknote className="h-5 w-5" />
                <span className="text-sm font-medium">{mockData.selectedService}</span>
              </div>
            </div>

            {/* Device Info */}
            <div className="mb-8 rounded-2xl bg-gray-50 p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="flex-shrink-0">
                  <Image
                    src={mockData.device.imageUrl}
                    alt={mockData.device.name}
                    width={100}
                    height={100}
                    className="rounded-xl bg-white object-contain p-2 shadow-sm"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="mb-1 text-xl font-bold text-gray-900">{mockData.device.name}</h3>
                  <p className="mb-3 text-gray-600">{mockData.device.storage}</p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1">
                    <Shield className="h-4 w-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-700">เกรด {mockData.conditionGrade}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                {mockData.conditionDetails.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">รายละเอียดนัดหมาย</h2>
              <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">วันที่และเวลา</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {mockData.appointment.date}, {mockData.appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">สถานที่</p>
                    <p className="mt-1 font-semibold text-gray-900">{mockData.appointment.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ชื่อผู้นัดหมาย</p>
                    <p className="mt-1 font-semibold text-gray-900">{mockData.appointment.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
                    <p className="mt-1 font-semibold text-gray-900">{mockData.appointment.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">ขั้นตอนต่อไป</h2>
              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-semibold text-gray-800">{step.title}</p>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-bold text-gray-900">ต้องการความช่วยเหลือ?</h3>
              <p className="mb-6 text-sm text-gray-600">หากมีข้อสงสัยหรือต้องการเปลี่ยนแปลงนัดหมาย</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={mockData.support.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-105"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>ติดต่อทาง LINE</span>
                </a>
                <a
                  href={`tel:${mockData.support.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-transform hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  <span>{mockData.support.phone}</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-6 border-t border-gray-200 pt-8 sm:flex-row-reverse sm:justify-between">
              <button
                onClick={handlePrint}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-white shadow-lg transition hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:outline-none sm:w-auto"
                aria-label="พิมพ์เอกสาร"
              >
                <Printer className="h-5 w-5" />
                <span className="font-semibold">พิมพ์เอกสาร</span>
              </button>
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
