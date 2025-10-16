// src/app/confirmed/[assessmentId]/components/PrintableAssessment.tsx

"use client";

import React from "react";
import QRCode from "react-qr-code";
import { AssessmentRecord } from "@/types/assessment";
import type {
  PawnServiceInfo,
  SellNowServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
} from "@/types/service";

interface PrintableAssessmentProps {
  assessment: AssessmentRecord;
}

// --- Helper Components ---
const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="mb-2 rounded border-l-3 border-orange-500 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
    {title}
  </h2>
);

const DetailRow = ({ label, value }: { label: string; value: string | number | React.ReactNode }) => (
  <div className="flex border-b border-gray-100 py-1.5 text-xs">
    <span className="w-2/5 font-medium text-gray-600">{label}</span>
    <span className="w-3/5 font-semibold text-gray-800">{value}</span>
  </div>
);

// --- Service Type Configuration ---
const SERVICE_CONFIG = {
  sellNowServiceInfo: { title: "บริการขายทันที", icon: "💰" },
  pawnServiceInfo: { title: "บริการจำนำ", icon: "🏦" },
  consignmentServiceInfo: { title: "บริการขายฝาก", icon: "📦" },
  refinanceServiceInfo: { title: "บริการรีไฟแนนซ์", icon: "🔄" },
  iphoneExchangeServiceInfo: { title: "บริการแลกเปลี่ยน iPhone", icon: "📱" },
  tradeInServiceInfo: { title: "บริการเทรดอิน", icon: "🔄" },
};

// --- Main Printable Assessment Component ---
const PrintableAssessment = React.forwardRef<HTMLDivElement, PrintableAssessmentProps>(({ assessment }, ref) => {
  const [qrError, setQrError] = React.useState(false);

  // Get QR Value
  const qrValue = typeof assessment?.id === "string" && assessment.id ? String(assessment.id) : "";
  React.useEffect(() => {
    setQrError(!qrValue);
  }, [qrValue]);

  // Get current date
  const currentDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get completed service info
  type ServiceKey =
    | "sellNowServiceInfo"
    | "pawnServiceInfo"
    | "consignmentServiceInfo"
    | "refinanceServiceInfo"
    | "iphoneExchangeServiceInfo";

  type AnyServiceInfo =
    | PawnServiceInfo
    | SellNowServiceInfo
    | ConsignmentServiceInfo
    | RefinanceServiceInfo
    | IPhoneExchangeServiceInfo;

  const isServiceInfo = (val: unknown): val is AnyServiceInfo => {
    if (!val || typeof val !== "object") return false;
    const obj = val as Record<string, unknown>;
    return (
      typeof obj.customerName === "string" &&
      typeof obj.phone === "string" &&
      typeof obj.appointmentDate === "string" &&
      typeof obj.appointmentTime === "string"
    );
  };

  const { activeService, serviceType } = React.useMemo(() => {
    const candidates: Array<[ServiceKey, unknown]> = [
      ["sellNowServiceInfo", assessment.sellNowServiceInfo],
      ["pawnServiceInfo", assessment.pawnServiceInfo],
      ["consignmentServiceInfo", assessment.consignmentServiceInfo],
      ["refinanceServiceInfo", assessment.refinanceServiceInfo],
      ["iphoneExchangeServiceInfo", assessment.iphoneExchangeServiceInfo],
    ];

    for (const [key, value] of candidates) {
      if (isServiceInfo(value)) {
        return { activeService: value, serviceType: key };
      }
    }

    return { activeService: null, serviceType: null };
  }, [
    assessment.sellNowServiceInfo,
    assessment.pawnServiceInfo,
    assessment.consignmentServiceInfo,
    assessment.refinanceServiceInfo,
    assessment.iphoneExchangeServiceInfo,
  ]);

  // Get location text with safe property guards across service variants
  const getLocationText = (service: AnyServiceInfo | null) => {
    if (!service) return "-";
    const rec = service as unknown as Record<string, unknown>;
    const storeLocation = typeof rec.storeLocation === "string" ? rec.storeLocation : undefined;
    const btsStation = typeof rec.btsStation === "string" ? rec.btsStation : undefined;
    const address = typeof rec.address === "string" ? rec.address : undefined;
    const addressDetails = typeof rec.addressDetails === "string" ? rec.addressDetails : undefined;
    const subdistrict = typeof rec.subdistrict === "string" ? rec.subdistrict : undefined;
    const district = typeof rec.district === "string" ? rec.district : undefined;
    const province = typeof rec.province === "string" ? rec.province : undefined;

    if (storeLocation) return storeLocation;
    if (btsStation) return `สถานี BTS: ${btsStation}`;
    const addrLine = addressDetails ?? address ?? [subdistrict, district, province].filter(Boolean).join(" ");
    return addrLine || "-";
  };

  // Device info
  const deviceInfo = assessment.deviceInfo;
  const deviceName = deviceInfo ? `${deviceInfo.brand} ${deviceInfo.model} ${deviceInfo.storage}` : "ไม่ระบุ";
  const finalPrice = assessment.estimatedValue ?? 0;

  // Condition details - แสดงข้อมูลทั้งหมดที่สำคัญ
  const conditionDetails = React.useMemo(() => {
    const ci = assessment.conditionInfo;
    if (!ci) return [];

    return [
      {
        label: "สภาพตัวเครื่อง",
        value: ci.bodyCondition === "body_mint" ? "เหมือนใหม่" : ci.bodyCondition ? "มีรอย/บุบ" : "ไม่ระบุ",
      },
      {
        label: "สุขภาพแบตเตอรี่",
        value:
          ci.batteryHealth === "battery_health_high"
            ? "มากกว่า 90%"
            : ci.batteryHealth === "battery_health_medium"
              ? "70% - 90%"
              : ci.batteryHealth === "battery_health_low"
                ? "ต่ำกว่า 70%"
                : "ไม่ระบุ",
      },
      {
        label: "อุปกรณ์ในกล่อง",
        value:
          ci.accessories === "acc_full"
            ? "ครบกล่อง"
            : ci.accessories === "acc_box_only"
              ? "เฉพาะกล่อง"
              : ci.accessories === "acc_no_box"
                ? "ไม่มีกล่อง"
                : "ไม่ระบุ",
      },
      {
        label: "การแสดงผลหน้าจอ",
        value:
          ci.screenDisplay === "display_ok"
            ? "ปกติ"
            : ci.screenDisplay === "display_pixel_defect"
              ? "พิกเซลเสีย"
              : ci.screenDisplay === "display_burn_in"
                ? "จอเบิร์น"
                : "มีปัญหา",
      },
      { label: "Face ID / Touch ID", value: ci.faceId === "biometric_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "การเชื่อมต่อ Wi-Fi", value: ci.wifi === "wifi_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "กล้อง", value: ci.camera === "camera_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "ลำโพง", value: ci.speaker === "speaker_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "ไมโครโฟน", value: ci.mic === "mic_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "การสัมผัส", value: ci.touchScreen === "touchscreen_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "การชาร์จไฟ", value: ci.charger === "charger_ok" ? "ปกติ" : "มีปัญหา" },
      { label: "ปุ่ม", value: ci.buttons === "buttons_ok" ? "ปกติ" : "มีปัญหา" },
    ];
  }, [assessment.conditionInfo]);

  // Get warranty text
  const getWarrantyText = (warranty: string) => {
    switch (warranty) {
      case "warranty_active_long":
        return "ประกันเหลือมากกว่า 3 เดือน";
      case "warranty_active_short":
        return "ประกันเหลือน้อยกว่า 3 เดือน";
      case "warranty_expired":
        return "ประกันหมดอายุ";
      default:
        return "ไม่ระบุ";
    }
  };

  // Get repair status text
  const getRepairText = (repair: string) => {
    switch (repair) {
      case "repaired_no":
        return "ไม่เคยเปิดซ่อม";
      case "repaired_authorized":
        return "เปิดซ่อมกับศูนย์บริการ";
      case "repaired_third_party":
        return "เปิดซ่อมกับร้านนอก";
      default:
        return "ไม่ระบุ";
    }
  };

  if (!activeService || !serviceType) {
    return (
      <div ref={ref} className="flex min-h-[297mm] w-[210mm] flex-col bg-white p-6 text-gray-800">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-500">ไม่พบข้อมูลบริการที่สมบูรณ์</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex min-h-[297mm] w-[210mm] flex-col bg-white p-6 text-gray-800"
      style={{ fontFamily: '"Sarabun", "LINESeedSansTH", sans-serif' }}
    >
      {/* Header */}
      <header className="mb-3 border-b-2 border-orange-500 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-orange-600">NO.1 Money</h1>
            <p className="mt-0.5 text-xs text-gray-500">ใบสรุปการประเมินราคาและนัดหมาย</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white">
              {qrError || !qrValue ? (
                <div className="flex h-12 w-12 items-center justify-center bg-gray-100 text-[10px] text-gray-500">
                  QR N/A
                </div>
              ) : (
                <QRCode value={qrValue} size={48} level="M" />
              )}
            </div>
            <p className="mt-0.5 text-[10px] text-gray-500">ID: {assessment.id}</p>
          </div>
        </div>
      </header>

      {/* Status Badge */}
      <div className="mb-3 flex justify-center">
        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
          ✅ การประเมินราคาสำเร็จ
        </div>
      </div>

      {/* Main Content - Compact Layout */}
      <main className="flex-1 space-y-4">
        {/* Service & Device Info in one row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Service Information */}
          <section>
            <SectionHeader title={`${SERVICE_CONFIG[serviceType].icon} ข้อมูลบริการ`} />
            <div className="space-y-1">
              <DetailRow
                label="บริการ"
                value={SERVICE_CONFIG[serviceType as keyof typeof SERVICE_CONFIG]?.title || "-"}
              />
              <DetailRow label="ชื่อลูกค้า" value={activeService.customerName || "-"} />
              <DetailRow label="เบอร์โทร" value={activeService.phone || "-"} />
              <DetailRow label="สถานที่" value={getLocationText(activeService)} />
              <DetailRow
                label="วันนัดหมาย"
                value={
                  <div>
                    <div>{activeService.appointmentDate}</div>
                    <div className="text-pink-600">{activeService.appointmentTime}</div>
                  </div>
                }
              />
            </div>
          </section>

          {/* Device Information */}
          <section>
            <SectionHeader title="📱 ข้อมูลอุปกรณ์" />
            <div className="space-y-1">
              <DetailRow label="อุปกรณ์" value={deviceName} />
              <DetailRow label="สถานะประกัน" value={getWarrantyText(assessment.conditionInfo?.warranty || "")} />
              <DetailRow
                label="ประวัติการซ่อม"
                value={getRepairText(assessment.conditionInfo?.openedOrRepaired || "")}
              />
              <DetailRow
                label="สามารถปลดล็อค iCloud"
                value={assessment.conditionInfo?.canUnlockIcloud ? "✅ ได้" : "❌ ไม่ได้"}
              />
            </div>
          </section>
        </div>

        {/* Price Summary */}
        <section>
          <SectionHeader title="💰 สรุปราคา" />
          <div className="rounded border-2 border-pink-300 bg-pink-50 p-3 text-center">
            <p className="mb-1 text-xs text-gray-600">ราคาประเมินสูงสุด</p>
            <p className="text-2xl font-bold text-pink-600">{finalPrice.toLocaleString("th-TH")} บาท</p>
            <p className="mt-1 text-[10px] text-gray-500">
              ราคานี้เป็นราคาประเมินเบื้องต้น ราคาสุดท้ายอาจเปลี่ยนแปลงหลังตรวจสอบสภาพเครื่องจริง
            </p>
          </div>
        </section>

        {/* Condition Summary - 2 columns */}
        <section>
          <SectionHeader title="🔍 สรุปสภาพเครื่อง" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {conditionDetails.map((item, index) => (
              <div key={index} className="flex justify-between border-b border-gray-100 py-1">
                <span className="text-gray-600">{item.label}</span>
                <span
                  className={`font-semibold ${
                    item.value === "ปกติ" ||
                    item.value === "เหมือนใหม่" ||
                    item.value === "ครบกล่อง" ||
                    item.value === "มากกว่า 90%"
                      ? "text-green-600"
                      : item.value === "มีปัญหา" || item.value === "มีรอย/บุบ"
                        ? "text-orange-600"
                        : "text-gray-800"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <SectionHeader title="📝 ขั้นตอนต่อไป" />
          <div className="space-y-2 text-xs text-gray-700">
            {assessment.nextSteps?.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            )) || (
              <>
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                    1
                  </span>
                  <span>เตรียมบัตรประชาชนและอุปกรณ์ให้พร้อม</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                    2
                  </span>
                  <span>ไปพบทีมงานตามวัน-เวลานัด และสถานที่ที่เลือก</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                    3
                  </span>
                  <span>ชำระเงินและรับเอกสารการทำรายการ</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <SectionHeader title="⚠️ ข้อควรทราบ" />
          <div className="rounded border border-orange-200 bg-orange-50 p-2">
            <div className="space-y-1 text-xs text-orange-800">
              <p>• ราคานี้เป็นราคาประเมินเบื้องต้น ราคาสุดท้ายอาจเปลี่ยนแปลงหลังตรวจสอบสภาพเครื่องจริง</p>
              <p>• กรุณานำบัตรประชาชนตัวจริงและอุปกรณ์ทั้งหมดไปด้วยในวันนัดหมาย</p>
              <p>• เอกสารนี้ใช้สำหรับการนัดหมายและอ้างอิงราคาเบื้องต้น</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-4 border-t border-orange-300 pt-3">
        <div className="text-center">
          <p className="text-xs font-semibold text-orange-700">ขอบคุณที่ใช้บริการ NO.1 Money</p>
          <p className="mt-0.5 text-[10px] text-gray-500">
            ออกเอกสารเมื่อ {currentDate} | โทร: 098-950-9222 | 123 ถนนสุขุมวิท กรุงเทพมหานคร 10110
          </p>
        </div>
      </footer>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
        }
        @font-face {
          font-family: "Sarabun";
          src:
            local("Sarabun"),
            url("/fonts/Sarabun-Regular.ttf") format("truetype");
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: "Sarabun";
          src:
            local("Sarabun"),
            url("/fonts/Sarabun-Bold.ttf") format("truetype");
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: "LINESeedSansTH";
          src: url("https://cdn.jsdelivr.net/gh/ok1developer/NO1Money/LINESeedSansTH_W_Rg.woff") format("woff");
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: "LINESeedSansTH";
          src: url("https://cdn.jsdelivr.net/gh/ok1developer/NO1Money/LINESeedSansTH_W_Bd.woff") format("woff");
          font-weight: 700;
          font-style: normal;
        }
      `}</style>
    </div>
  );
});

PrintableAssessment.displayName = "PrintableAssessment";
export default PrintableAssessment;
