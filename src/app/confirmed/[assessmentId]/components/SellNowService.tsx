// src/app/confirmed/[assessmentId]/components/SellNowService.tsx
import React from "react";
import type { AssessmentRecord } from "@/types/assessment";
import type { SellNowServiceInfo } from "@/types/service";
import { Calendar, MapPin, Phone, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SellNowService
 * Renders the confirmed details for the "Sell Now" service.
 *
 * Props:
 * - assessment: AssessmentRecord for contextual display and future actions
 * - info: SellNowServiceInfo with appointment and location details
 *
 * Behavior:
 * - Displays appointment date/time, location type, and location details
 * - Validates props and shows friendly fallbacks if data is missing
 * - Responsive layout for mobile/tablet/desktop
 */
export interface SellNowServiceProps {
  assessment: AssessmentRecord;
  info: SellNowServiceInfo;
}

export default function SellNowService({ assessment, info }: SellNowServiceProps) {
  const date = info?.appointmentDate || "-";
  const time = info?.appointmentTime || "-";
  const phone = info?.phone || assessment.phoneNumber || "-";
  const locationType = info?.locationType || "-";

  const locationDetail = (() => {
    if (!info) return "-";
    if (locationType === "store") return info.storeLocation || "สาขาไม่ระบุ";
    if (locationType === "bts") return info.btsStation ? `สถานี BTS: ${info.btsStation}` : "สถานี BTS ไม่ระบุ";
    const parts = [
      info.addressDetails,
      info.subdistrict,
      info.district,
      info.province,
      info.postcode,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "สถานที่นัดหมายไม่ระบุ";
  })();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">บริการขายทันที</h3>
          <p className="mt-1 text-sm text-gray-600">ยืนยันรายละเอียดการขายเครื่อง</p>
        </div>
        <div className="rounded-full bg-emerald-50 p-2">
          <Banknote className="h-5 w-5 text-emerald-600" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>
            วันที่: <span className="font-semibold text-gray-900">{date}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>
            เวลา: <span className="font-semibold text-gray-900">{time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>
            รูปแบบสถานที่: <span className="font-semibold text-gray-900">{locationType}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate">
            สถานที่: <span className="font-semibold text-gray-900">{locationDetail}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <Phone className="h-4 w-4" />
          <span>
            โทร: <span className="font-semibold text-gray-900">{phone}</span>
          </span>
        </div>
      </div>

      {Array.isArray(info?.nextSteps) && info.nextSteps.length > 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">ขั้นตอนถัดไป</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
            {info.nextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" className="h-10">รายละเอียดเพิ่มเติม</Button>
        <Button className="h-10">พิมพ์เอกสาร</Button>
      </div>
    </section>
  );
}