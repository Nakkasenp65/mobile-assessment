// src/app/confirmed/[assessmentId]/components/IPhoneExchangeService.tsx
import React from "react";
import type { AssessmentRecord } from "@/types/assessment";
import type { IPhoneExchangeServiceInfo } from "@/types/service";
import { Phone as PhoneIcon, Calendar, Shield } from "lucide-react";

/**
 * IPhoneExchangeService
 * Displays details for the iPhone exchange for cash service.
 */
export interface IPhoneExchangeServiceProps {
  assessment: AssessmentRecord;
  info: IPhoneExchangeServiceInfo;
}

export default function IPhoneExchangeService({ assessment, info }: IPhoneExchangeServiceProps) {
  const time = info?.appointmentTime || "-";
  const occupation = info?.occupation || "-";
  const phone = assessment.phoneNumber || info?.phone || "-";

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <h3 className="text-lg font-bold text-gray-900">ไอโฟนแลกเงิน</h3>
      <p className="mt-1 text-sm text-gray-600">รายละเอียดการนัดหมายและเอกสาร</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>
            เวลา: <span className="font-semibold text-gray-900">{time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <PhoneIcon className="h-4 w-4" />
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