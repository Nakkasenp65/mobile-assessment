// src/app/confirmed/[assessmentId]/components/ConsignmentService.tsx
import React from "react";
import type { AssessmentRecord } from "@/types/assessment";
import type { ConsignmentServiceInfo } from "@/types/service";
import { Calendar, MapPin, Phone } from "lucide-react";

/**
 * ConsignmentService
 * Renders confirmed details for the Consignment service.
 */
export interface ConsignmentServiceProps {
  assessment: AssessmentRecord;
  info: ConsignmentServiceInfo;
}

export default function ConsignmentService({ assessment, info }: ConsignmentServiceProps) {
  const date = info?.appointmentDate || "-";
  const time = info?.appointmentTime || "-";
  const storeLocation = info?.storeLocation || "สาขาไม่ระบุ";
  const phone = info?.phone || assessment.phoneNumber || "-";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="text-lg font-bold text-gray-900">บริการฝากขาย</h3>
      <p className="mt-1 text-sm text-gray-600">รายละเอียดการฝากขายเครื่อง</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>
            สาขา: <span className="font-semibold text-gray-900">{storeLocation}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="h-4 w-4" />
          <span>
            โทร: <span className="font-semibold text-gray-900">{phone}</span>
          </span>
        </div>
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
      </div>

      {info?.additionalNotes && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">หมายเหตุ</p>
          <p className="mt-1 text-sm text-gray-700">{info.additionalNotes}</p>
        </div>
      )}
    </section>
  );
}