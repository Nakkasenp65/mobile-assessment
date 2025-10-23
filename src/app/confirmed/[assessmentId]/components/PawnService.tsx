// src/app/confirmed/[assessmentId]/components/PawnService.tsx
import React from "react";
import type { AssessmentRecord } from "@/types/assessment";
import type { PawnServiceInfo } from "@/types/service";
import { Calendar, MapPin, Phone } from "lucide-react";

/**
 * PawnService
 * Displays details for the Pawn service.
 */
export interface PawnServiceProps {
  assessment: AssessmentRecord;
  info: PawnServiceInfo;
}

export default function PawnService({ assessment, info }: PawnServiceProps) {
  const date = info?.appointmentDate || "-";
  const time = info?.appointmentTime || "-";
  const phone = info?.phone || assessment.phoneNumber || "-";

  const locationSummary = (() => {
    if (!info) return "-";
    if (info.locationType === "store") return info.storeLocation || "สาขาไม่ระบุ";
    if (info.locationType === "bts") return info.btsStation ? `สถานี BTS: ${info.btsStation}` : "สถานี BTS ไม่ระบุ";
    const parts = [info.address, info.subdistrict, info.district, info.province, info.postcode].filter(Boolean);
    return parts.length ? parts.join(" ") : "สถานที่นัดหมายไม่ระบุ";
  })();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="text-lg font-bold text-gray-900">บริการจำนำ</h3>
      <p className="mt-1 text-sm text-gray-600">รายละเอียดการนัดหมาย</p>

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
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <MapPin className="h-4 w-4" />
          <span>
            สถานที่: <span className="font-semibold text-gray-900">{locationSummary}</span>
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
    </section>
  );
}