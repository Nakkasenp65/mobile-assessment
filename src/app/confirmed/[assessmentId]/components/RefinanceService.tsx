// src/app/confirmed/[assessmentId]/components/RefinanceService.tsx
import React from "react";
import type { AssessmentRecord } from "@/types/assessment";
import type { RefinanceServiceInfo } from "@/types/service";
import { Shield, Calendar, Phone } from "lucide-react";

/**
 * RefinanceService
 * Displays details for Refinance service.
 */
export interface RefinanceServiceProps {
  assessment: AssessmentRecord;
  info: RefinanceServiceInfo;
}

export default function RefinanceService({ assessment, info }: RefinanceServiceProps) {
  const time = info?.appointmentTime || "-";
  const phone = info?.phone || assessment.phoneNumber || "-";
  const occupation = info?.occupation || "-";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">บริการรีไฟแนนซ์</h3>
          <p className="mt-1 text-sm text-gray-600">ยืนยันรายละเอียดเอกสารและนัดหมาย</p>
        </div>
        <div className="rounded-full bg-blue-50 p-2">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>
            เวลา: <span className="font-semibold text-gray-900">{time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="h-4 w-4" />
          <span>
            โทร: <span className="font-semibold text-gray-900">{phone}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <Shield className="h-4 w-4" />
          <span>
            อาชีพ: <span className="font-semibold text-gray-900">{occupation}</span>
          </span>
        </div>
        {info?.documentFileUrl && (
          <div className="sm:col-span-2">
            <a
              href={info.documentFileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-semibold text-blue-600 hover:underline"
            >
              เปิดเอกสารประกอบ
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
