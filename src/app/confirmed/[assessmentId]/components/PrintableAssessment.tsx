// src/app/confirmed/[assessmentId]/components/PrintableAssessment.tsx

"use client";

import React from "react";
import QRCode from "react-qr-code";
import {
  Banknote,
  Calendar,
  ClipboardCheck,
  LucideIcon,
  MapPin,
  Package,
  Phone,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
import { IconType } from "react-icons";

interface PrintableAssessmentProps {
  assessmentId: string;
  data: {
    device: {
      imageUrl: string;
      name: string;
      storage: string;
    };
    finalPrice: number;
    conditionGrade: string;
    selectedService: string;
    appointment: {
      customerName: string;
      phone: string;
      location: string;
      date: string;
      time: string;
    };
    conditionDetails: Array<{ label: string; value: string }>;
  };
}

const PrintableAssessment = React.forwardRef<HTMLDivElement, PrintableAssessmentProps>(
  ({ assessmentId, data }, ref) => {
    const [qrError, setQrError] = React.useState(false);
    const qrValue = React.useMemo(() => {
      try {
        const val = String(assessmentId ?? "");
        if (!val) throw new Error("Missing assessmentId");
        return val;
      } catch (e) {
        setQrError(true);
        return "";
      }
    }, [assessmentId]);

    const currentDate = new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div
        ref={ref}
        // ปรับ padding ให้เหมาะสมกับ A4
        className="relative min-h-[297mm] w-[210mm] bg-white p-[15mm] text-gray-800 selection:bg-transparent selection:text-gray-800"
        style={{ fontFamily: '"LINESeedSansTH", sans-serif' }}
      >
        {/* Header Layout ใหม่: ใช้ Flexbox แบ่งซ้าย-ขวา ไม่ใช้ absolute positioning */}
        <header className="mb-8 flex items-start justify-between border-b-2 border-gray-200 pb-6">
          {/* Left Side: Company & Document Info */}
          <div className="flex flex-col gap-4">
            <div>
              {/* Brand Name: เพิ่ม fallback color สำหรับ print mode */}
              <p className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent print:text-orange-600">
                NO.1 Money
              </p>
              <div className="mt-1 text-sm text-gray-600">
                <p>123 ถนนสุขุมวิท, กรุงเทพมหานคร 10110</p>
                <p>โทร: 098-950-9222</p>
              </div>
            </div>

            <div className="border-l-4 border-orange-200 pl-3">
              <h1 className="text-2xl font-bold text-gray-900">ใบยืนยันการประเมิน</h1>
              <div className="mt-1 text-sm text-gray-500">
                <p>
                  รหัสเอกสาร: <span className="font-mono font-semibold text-gray-900">{assessmentId}</span>
                </p>
                <p>วันที่ออก: {currentDate}</p>
              </div>
            </div>
          </div>

          {/* Right Side: QR Code ใน Flow ปกติ */}
          <div className="gap-1pt-1 flex flex-col items-end">
            <div className="rounded-md border border-gray-200 bg-white p-2 shadow-sm print:border-gray-300 print:shadow-none">
              {qrError || !qrValue ? (
                <div className="flex h-[100px] w-[100px] items-center justify-center border border-red-100 bg-red-50 text-xs text-red-500">
                  QR N/A
                </div>
              ) : (
                <QRCode value={qrValue} size={100} bgColor="#FFFFFF" fgColor="#000000" level="M" />
              )}
            </div>
            <p className="w-full text-center text-[10px] text-gray-400">Scan for details</p>
          </div>
        </header>

        <main className="grid grid-cols-2 gap-x-12">
          <section>
            <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-pink-600 print:text-pink-700">
              ข้อมูลนัดหมาย
            </h2>
            <div className="mt-3 space-y-3">
              <InfoRow icon={User} label="ชื่อลูกค้า" value={data.appointment.customerName} />
              <InfoRow icon={Phone} label="เบอร์โทรศัพท์" value={data.appointment.phone} />
              <InfoRow
                icon={Calendar}
                label="วันและเวลา"
                value={`${data.appointment.date}, ${data.appointment.time}`}
              />
              <InfoRow icon={MapPin} label="สถานที่" value={data.appointment.location} />
            </div>
          </section>

          <section>
            <h2 className="border-b border-gray-200 pb-2 text-lg font-bold text-orange-600 print:text-orange-700">
              ข้อมูลอุปกรณ์
            </h2>
            <div className="mt-3 space-y-3">
              <InfoRow icon={Package} label="อุปกรณ์" value={`${data.device.name} ${data.device.storage}`} />
              <InfoRow icon={Shield} label="สภาพเครื่อง" value={`เกรด ${data.conditionGrade}`} />
              <InfoRow icon={Banknote} label="บริการที่เลือก" value={data.selectedService} />

              {/* Final Price Box */}
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 print:border-gray-300 print:bg-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">ราคาประเมินสุทธิ</span>
                  <span className="text-2xl font-bold text-green-700 print:text-black">
                    ฿{data.finalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="mt-8">
          <h2 className="text-md font-bold text-gray-800">รายละเอียดสภาพเครื่อง</h2>
          <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 border-t border-gray-200 py-2 text-sm">
            {data.conditionDetails.map((item, index) => (
              <div key={index} className="flex justify-between py-1">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 mb-auto">
          <h2 className="text-md mb-3 font-bold text-gray-800">สิ่งที่ต้องเตรียมในวันนัดหมาย</h2>
          <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
            <StepItem
              icon={UserCheck}
              number="1"
              title="บัตรประชาชน"
              desc="เตรียมบัตรประชาชนตัวจริงของท่านเพื่อยืนยันตัวตน"
            />
            <StepItem
              icon={Package}
              number="2"
              title="อุปกรณ์"
              desc="นำเครื่องและอุปกรณ์เสริม (ถ้ามี) ไปที่จุดนัดหมาย"
            />
            <StepItem
              icon={ClipboardCheck}
              number="3"
              title="การตรวจสอบ"
              desc="เจ้าหน้าที่จะทำการตรวจสอบสภาพเครื่องครั้งสุดท้าย"
            />
          </div>
        </section>

        {/* Footer ดันลงด้านล่างสุด */}
        <footer className="absolute right-[15mm] bottom-[15mm] left-[15mm] border-t border-gray-200 pt-4 text-center">
          <p className="text-sm font-medium text-gray-800">ขอบคุณที่ใช้บริการ NO.1 Money</p>
          <p className="mt-1 text-xs text-gray-500">
            เอกสารฉบับนี้สร้างโดยระบบอัตโนมัติ | เงื่อนไขเป็นไปตามที่บริษัทกำหนด
          </p>
        </footer>

        {/* Global font-face declarations embedded for Printing */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          @font-face {
            font-family: "LINESeedSansTH";
            src: url("https://cdn.jsdelivr.net/gh/ok1developer/NO1Money/LINESeedSansTH_W_Rg.woff") format("woff");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: "LINESeedSansTH";
            src: url("https://cdn.jsdelivr.net/gh/ok1developer/NO1Money/LINESeedSansTH_W_Bd.woff") format("woff");
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
        `}</style>
      </div>
    );
  },
);

PrintableAssessment.displayName = "PrintableAssessment";

// Helper Components for cleaner layout
const InfoRow = ({ icon: Icon, label, value }: { icon: LucideIcon | IconType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-gray-400">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm leading-tight font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const StepItem = ({
  icon: Icon,
  number,
  title,
  desc,
}: {
  icon: LucideIcon;
  number: string;
  title: string;
  desc: string;
}) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 print:border-gray-200 print:bg-white">
    <div className="mb-2 flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 print:border print:border-gray-300 print:bg-white">
        {number}
      </div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
    </div>
    <div className="flex gap-2">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
      <p className="text-xs leading-snug text-gray-600">{desc}</p>
    </div>
  </div>
);

export default PrintableAssessment;
