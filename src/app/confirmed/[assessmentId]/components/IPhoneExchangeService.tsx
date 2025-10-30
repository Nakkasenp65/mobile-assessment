// src/app/confirmed/[assessmentId]/components/IPhoneExchangeService.tsx
import React from "react";
import type { Assessment } from "@/types/assessment";
import type { IPhoneExchangeServiceInfo } from "@/types/service";
import {
  Phone as PhoneIcon,
  Calendar,
  Shield,
  AlertCircle,
  FileText,
  Smartphone,
} from "lucide-react";
import { FaLine } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * IPhoneExchangeService
 * Displays details for the iPhone exchange for cash service with prominent contact instructions.
 * Since this is a manual booking service, the next step is to contact our officers.
 */
export interface IPhoneExchangeServiceProps {
  assessment: Assessment;
  info: IPhoneExchangeServiceInfo;
}

const LINE_CONTACT_URL = "https://lin.ee/0ab3Rcl";

export default function IPhoneExchangeService({ assessment, info }: IPhoneExchangeServiceProps) {
  const time = info?.appointmentTime || "-";
  const occupation = info?.occupation || "-";
  const phone = assessment.phoneNumber || info?.phone || "-";

  const handleLineContact = () => {
    window.open(LINE_CONTACT_URL, "_blank");
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:0947878783";
  };

  return (
    <div className="space-y-4">
      {/* Prominent Contact Instructions Alert */}
      <Alert className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
        <AlertCircle className="h-5 w-5 text-purple-600" />
        <AlertTitle className="text-lg font-bold text-purple-900">
          ขั้นตอนถัดไป - โปรดติดต่อเจ้าหน้าที่
        </AlertTitle>
        <AlertDescription className="mt-2 text-base text-purple-800">
          บริการไอโฟนแลกเงินต้องการการตรวจสอบเอกสารและอุปกรณ์เพิ่มเติมจากเจ้าหน้าที่
          <br />
          <span className="font-semibold">
            กรุณาติดต่อเราผ่าน Line หรือโทรศัพท์เพื่อนัดหมายและดำเนินการต่อ
          </span>
        </AlertDescription>
      </Alert>

      {/* Large Contact Buttons */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-center text-xl">ติดต่อเจ้าหน้าที่ทันที</CardTitle>
          <CardDescription className="text-center text-base">
            เลือกช่องทางที่สะดวกสำหรับคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Line Contact - Primary */}
            <Button
              onClick={handleLineContact}
              size="lg"
              className="h-16 gap-2 bg-gradient-to-r from-green-500 to-green-600 text-lg font-semibold hover:from-green-600 hover:to-green-700"
            >
              <FaLine className="h-6 w-6" />
              ติดต่อผ่าน Line
            </Button>

            {/* Phone Contact - Secondary */}
            <Button
              onClick={handlePhoneCall}
              size="lg"
              variant="outline"
              className="h-16 gap-2 border-2 border-sky-500 bg-gradient-to-r from-sky-50 to-sky-100 text-lg font-semibold text-sky-700 hover:bg-sky-200"
            >
              <PhoneIcon className="h-5 w-5" />
              โทร: 094-787-8783
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">ไอโฟนแลกเงิน</CardTitle>
              <CardDescription>รายละเอียดการนัดหมายและเอกสาร</CardDescription>
            </div>
            <div className="rounded-full bg-purple-50 p-2">
              <Smartphone className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">เวลาบันทึก</p>
                <p className="font-semibold text-gray-900">{time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <PhoneIcon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">เบอร์ติดต่อ</p>
                <p className="font-semibold text-gray-900">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-600">อาชีพ</p>
                <p className="font-semibold text-gray-900">{occupation}</p>
              </div>
            </div>

            {info?.documentFileUrl && (
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs text-blue-700">เอกสารประกอบ</p>
                  <a
                    href={info.documentFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    เปิดเอกสาร
                  </a>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
