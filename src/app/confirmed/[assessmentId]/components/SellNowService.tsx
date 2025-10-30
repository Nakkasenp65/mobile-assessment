// src/app/confirmed/[assessmentId]/components/SellNowService.tsx
"use client";

import React, { useState } from "react";
import type { Assessment } from "@/types/assessment";
import type { SellNowServiceInfo } from "@/types/service";
import { Calendar, MapPin, Phone, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { usePaymentLink } from "../../../../hooks/usePaymentLink";

export interface SellNowServiceProps {
  assessment: Assessment;
  info: SellNowServiceInfo;
}

export default function SellNowService({ assessment, info }: SellNowServiceProps) {
  const depositoAmountConst = 200;
  const assessmentDocId = assessment.docId || "-";
  const date = info?.appointmentDate || "-";
  const time = info?.appointmentTime || "-";
  const phone = info?.phone || assessment.phoneNumber || "-";
  const locationType = info?.locationType || "-";
  const { data: paymentLinkData } = usePaymentLink(assessment.docId);

  // Check if this service requires payment (BTS or Home)
  const requiresPayment = locationType === "bts" || locationType === "home";

  // Check if payment is pending (status is "reserved" and not "completed")
  const isPendingPayment = requiresPayment && assessment.status === "reserved";

  // Check if payment is completed
  const isPaymentCompleted = requiresPayment && assessment.status === "completed";

  // Determine if assessment is expired: expiredAt - today <= 0
  const isExpired = (() => {
    const exp = assessment?.expiredAt;
    if (!exp) return false;
    const expMs = new Date(exp).getTime();
    if (Number.isNaN(expMs)) return false;
    return expMs - Date.now() <= 0;
  })();

  // Can user still pay? Only when pending and not expired
  const canPay = isPendingPayment && !isExpired;

  const handlePayNow = async () => {
    if (isExpired) return;
    window.open(paymentLinkData?.payment_link, "_blank");
  };

  const locationDetail = (() => {
    if (!info) return "-";
    if (locationType === "store") return info.storeLocation || "สาขาไม่ระบุ";
    if (locationType === "bts")
      return info.btsStation ? `สถานี BTS: ${info.btsStation}` : "สถานี BTS ไม่ระบุ";
    const parts = [
      info.addressDetails,
      info.subdistrict,
      info.district,
      info.province,
      info.postcode,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "สถานที่นัดหมายไม่ระบุ";
  })();

  const renderLocationTypeWord = (type: string) => {
    switch (type) {
      case "store":
        return "รับซื้อที่หน้าร้าน";
      case "bts":
        return "รับซื้อที่สถานี BTS";
      case "home":
        return "รับซื้อถึงบ้าน";
      default:
        return "-";
    }
  };

  const renderLocationDetailsPrefix = (type: string) => {
    switch (type) {
      case "store":
        return "สาขา: ";
      case "bts":
        return "สถานี BTS: ";
      case "home":
        return "ที่อยู่: ";
      default:
        return "";
    }
  };

  return (
    <section className="border-border rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">บริการขายทันที</h3>
        </div>
      </div>

      {/* Payment Expired Alert */}
      {isExpired && (
        <Alert className="mt-4 flex items-center justify-center border-red-200 bg-red-50 shadow-sm">
          <AlertDescription className="text-red-800">
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold">⏰ คำขอหมดอายุแล้ว</p>
              <p className="text-sm leading-relaxed">
                การชำระเงินมัดจำไม่สามารถทำได้ เนื่องจากรายการนี้หมดอายุแล้ว
                กรุณาสร้างการประเมินใหม่ หรือ ติดต่อเจ้าหน้าที่เพื่อสอบถามข้อมูลเพิ่มเติม
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Success Alert */}
      {isPaymentCompleted && (
        <Alert className="mt-4 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex flex-col gap-2">
              <p className="font-medium">✅ ชำระเงินมัดจำสำเร็จแล้ว</p>
              <p className="text-sm">
                ขอบคุณที่ชำระเงินมัดจำ {depositoAmountConst} บาท การจองของคุณได้รับการยืนยันแล้ว
                เจ้าหน้าที่จะติดต่อกลับเร็วๆ นี้
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Required Alert */}
      {canPay && (
        <Alert className="mt-4 border-orange-200 bg-orange-50 shadow-sm">
          <AlertDescription className="text-orange-800">
            <div className="flex flex-col gap-2">
              <p className="text-base font-semibold">⚠️ กรุณาชำระเงินมัดจำเพื่อยืนยันการจอง</p>
              <p className="text-sm leading-relaxed">
                การจองของคุณยังไม่สมบูรณ์ <b>กรุณาชำระเงินมัดจำ {depositoAmountConst} บาท</b>{" "}
                เพื่อยืนยันการจองและดำเนินการต่อ
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <DocumentIcon className="h-4 w-4" />
          <span className="font-bold">
            รหัสการประเมิน: <span className="font-normal text-gray-900">{assessmentDocId}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span className="font-bold">
            วันที่ประเมิน: <span className="font-normal text-gray-900">{date}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span className="font-bold">
            เวลา: <span className="font-normal text-gray-900">{time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4" />
          <span className="font-bold">ประเภทสถานที่บริการ: </span>
          {renderLocationTypeWord(locationType)}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate font-bold">
            {renderLocationDetailsPrefix(locationType)}{" "}
            <span className="font-normal text-gray-900">
              {locationDetail.replace(renderLocationDetailsPrefix(locationType), "")}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
          <Phone className="h-4 w-4" />
          <span className="font-bold">
            โทร: <span className="font-normal text-gray-900">{phone}</span>
          </span>
        </div>
      </div>

      {Array.isArray(info?.nextSteps) && info.nextSteps.length > 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-normal text-gray-900">ขั้นตอนถัดไป</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
            {info.nextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Pay Now Button */}
      {canPay && (
        <div className="mt-4">
          <Button
            onClick={handlePayNow}
            size="lg"
            className="h-14 w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
          >
            <CreditCard className="h-5 w-5" />
            ชำระเงินมัดจำ {depositoAmountConst} บาท
          </Button>
        </div>
      )}
    </section>
  );
}
