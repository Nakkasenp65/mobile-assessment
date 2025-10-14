// src/app/confirmed/[assessmentId]/components/PrintableAssessment.tsx
"use client";

import React from "react";
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
    return (
      <div ref={ref} className="min-h-[297mm] w-[210mm] bg-white p-12 font-sans text-gray-800">
        {/* ✨ Header: เพิ่มสีพื้นหลังอ่อนๆ เพื่อให้ดูเด่นขึ้น */}
        <header className="flex items-start justify-between rounded-t-lg bg-gray-50 p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ใบยืนยันการประเมิน</h1>
            <p className="mt-1 text-gray-500">
              รหัส: <span className="font-semibold text-gray-800">{assessmentId}</span>
            </p>
            <p className="text-sm text-gray-500">
              วันที่ออกเอกสาร:{" "}
              {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            {/* ✨ ใช้สีส้ม-ชมพู ตาม Brand */}
            <p className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
              NO.1 Money
            </p>
            <p className="text-sm text-gray-600">123 ถนนสุขุมวิท, กรุงเทพมหานคร 10110</p>
            <p className="text-sm text-gray-600">โทร: 098-950-9222</p>
          </div>
        </header>

        <main className="mt-8 grid grid-cols-2 gap-x-12 px-6">
          <section>
            {/* ✨ ทำให้หัวข้อดูเด่นขึ้น */}
            <h2 className="text-xl font-bold text-pink-600">ข้อมูลนัดหมาย</h2>
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
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
            <h2 className="text-xl font-bold text-orange-600">ข้อมูลอุปกรณ์</h2>
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
              <InfoRow icon={Package} label="อุปกรณ์" value={`${data.device.name} ${data.device.storage}`} />
              <InfoRow icon={Shield} label="สภาพเครื่อง" value={`เกรด ${data.conditionGrade}`} />
              <InfoRow icon={Banknote} label="บริการที่เลือก" value={data.selectedService} />
              {/* ✨ เน้นราคาด้วยสีเขียวที่เข้มพอจะอ่านได้แม้พิมพ์ขาว-ดำ */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Banknote className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ราคาประเมินสุดท้าย</p>
                  <p className="text-2xl font-bold text-green-700">฿{data.finalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="mt-10 px-6">
          <h2 className="text-xl font-bold text-gray-800">สรุปสภาพเครื่อง</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-12 gap-y-2 rounded-lg bg-gray-50/50 p-4">
            {data.conditionDetails.map((item, index) => (
              <div key={index} className="flex justify-between border-b border-gray-100 py-1 text-sm">
                <span className="text-gray-600">{item.label}:</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 px-6">
          <h2 className="text-xl font-bold text-gray-800">สิ่งที่ต้องเตรียม</h2>
          <div className="mt-4 space-y-3 border-t-2 border-dashed border-gray-200 pt-4">
            <InfoRow icon={UserCheck} label="1. บัตรประชาชน" value="เตรียมบัตรประชาชนตัวจริงของท่าน" />
            <InfoRow icon={Package} label="2. อุปกรณ์" value="นำเครื่องและอุปกรณ์เสริม (ถ้ามี) ไปที่จุดนัดหมาย" />
            <InfoRow icon={ClipboardCheck} label="3. การตรวจสอบ" value="ทีมงานจะตรวจสอบและดำเนินการในขั้นตอนสุดท้าย" />
          </div>
        </section>

        <footer className="mt-12 border-t-2 border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-600">ขอบคุณที่ใช้บริการ NO.1 Money</p>
          <p className="text-xs text-gray-400">เอกสารฉบับนี้สร้างโดยระบบอัตโนมัติ</p>
        </footer>
      </div>
    );
  },
);

PrintableAssessment.displayName = "PrintableAssessment";

// ✨ Helper component: เพิ่มสีพื้นหลังให้ไอคอน
const InfoRow = ({ icon: Icon, label, value }: { icon: LucideIcon | IconType; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default PrintableAssessment;
