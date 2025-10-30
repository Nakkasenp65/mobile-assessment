// src/app/confirmed/[assessmentId]/components/PrintableAssessment.tsx

"use client";

import React from "react";
import QRCode from "react-qr-code";
import { Assessment } from "@/types/assessment";
import type {
  PawnServiceInfo,
  SellNowServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
  TradeInServiceInfo,
} from "@/types/service";

interface PrintableAssessmentProps {
  assessment: Assessment;
}

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="mb-1.5 rounded border-l-3 border-orange-500 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
    {title}
  </h2>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className="flex border-b border-gray-100 py-1 text-[10px]">
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
  iphoneExchangeServiceInfo: { title: "บริการไอโฟนแลกเงิน", icon: "📱" },
  tradeInServiceInfo: { title: "บริการเทรดอิน", icon: "🔄" },
};

// Helper: safely read string property without using 'any'
const readStringProp = <K extends string>(obj: object, key: K): string | undefined => {
  const val = (obj as Record<K, unknown>)[key];
  return typeof val === "string" ? val : undefined;
};

// --- Main Printable Assessment Component ---
const PrintableAssessment = React.forwardRef<HTMLDivElement, PrintableAssessmentProps>(
  ({ assessment }, ref) => {
    const [qrError, setQrError] = React.useState(false);

    // Get QR Value
    const qrValue =
      typeof assessment?.id === "string" && assessment.id ? String(assessment.id) : "";
    React.useEffect(() => {
      setQrError(!qrValue);
    }, [qrValue]);

    // Add print styles
    React.useEffect(() => {
      const style = document.createElement("style");
      style.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            width: 100%;
            min-height: auto;
            margin: 0;
            padding: 0;
            background: white;
            page-break-inside: avoid;
          }
          .print-section {
            page-break-inside: avoid;
          }
          .print-header {
            page-break-after: avoid;
          }
          .print-footer {
            page-break-before: auto;
          }
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }, []);

    // Get current date
    const currentDate = new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const assessmentDate = new Date(assessment.assessmentDate);
    const formattedDated = assessmentDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Get completed service info
    type ServiceKey = keyof typeof SERVICE_CONFIG;

    type AnyServiceInfo =
      | PawnServiceInfo
      | SellNowServiceInfo
      | ConsignmentServiceInfo
      | RefinanceServiceInfo
      | IPhoneExchangeServiceInfo
      | TradeInServiceInfo;

    const { activeService, serviceType } = React.useMemo(() => {
      const candidates: Array<[ServiceKey, unknown]> = [
        ["sellNowServiceInfo", assessment.sellNowServiceInfo],
        ["consignmentServiceInfo", assessment.consignmentServiceInfo],
        ["refinanceServiceInfo", assessment.refinanceServiceInfo],
        ["iphoneExchangeServiceInfo", assessment.iphoneExchangeServiceInfo],
        ["tradeInServiceInfo", assessment.tradeInServiceInfo],
      ];

      for (const [key, value] of candidates) {
        // A more robust check: if the service info object exists, use it.
        if (value && typeof value === "object") {
          return { activeService: value as AnyServiceInfo, serviceType: key };
        }
      }

      return { activeService: null, serviceType: null };
    }, [
      assessment.sellNowServiceInfo,
      assessment.consignmentServiceInfo,
      assessment.refinanceServiceInfo,
      assessment.iphoneExchangeServiceInfo,
      assessment.tradeInServiceInfo,
    ]);

    // Get location text with safe property guards across service variants
    const getLocationText = (service: AnyServiceInfo | null) => {
      if (!service) return "-";

      if (
        "storeLocation" in service &&
        typeof service.storeLocation === "string" &&
        service.storeLocation
      ) {
        return service.storeLocation;
      }

      if ("btsStation" in service && typeof service.btsStation === "string" && service.btsStation) {
        return `สถานี BTS: ${service.btsStation}`;
      }

      const addressDetails =
        "addressDetails" in service && typeof service.addressDetails === "string"
          ? service.addressDetails
          : undefined;
      const address =
        "address" in service && typeof service.address === "string" ? service.address : undefined;
      const subdistrict =
        "subdistrict" in service && typeof service.subdistrict === "string"
          ? service.subdistrict
          : undefined;
      const district =
        "district" in service && typeof service.district === "string"
          ? service.district
          : undefined;
      const province =
        "province" in service && typeof service.province === "string"
          ? service.province
          : undefined;

      const addrLine =
        addressDetails || address || [subdistrict, district, province].filter(Boolean).join(" ");
      return addrLine || "-";
    };

    // Device info
    const deviceInfo = assessment.deviceInfo;
    const deviceName = deviceInfo
      ? `${deviceInfo.brand} ${deviceInfo.model} ${deviceInfo.storage}`
      : "ไม่ระบุ";

    // Condition details - แสดงข้อมูลทั้งหมดที่สำคัญ
    const conditionDetails = React.useMemo(() => {
      const ci = assessment.conditionInfo;
      if (!ci) return [];

      return [
        {
          label: "สภาพตัวเครื่อง",
          value:
            ci.bodyCondition === "body_mint"
              ? "เหมือนใหม่"
              : ci.bodyCondition
                ? "มีรอย/บุบ"
                : "ไม่ระบุ",
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
        <div ref={ref} className="print-container flex w-full flex-col bg-white p-4 text-gray-800">
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-500">ไม่พบข้อมูลบริการที่สมบูรณ์</p>
          </div>
        </div>
      );
    }

    const serviceRecord = activeService as AnyServiceInfo;

    return (
      <div
        ref={ref}
        className="print-container flex w-full flex-col bg-white p-3 text-gray-800"
        style={{ fontFamily: '"LINESeedSansTH", sans-serif' }}
      >
        {/* Header */}
        <header className="print-header mb-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-orange-600">NO.1 Money</h1>
              <p className="mt-0.5 text-[10px] text-gray-500">ใบสรุปการประเมินราคาและนัดหมาย</p>
              <p className="mt-0.5 text-[10px] text-gray-500">
                วันที่ประเมิน {formattedDated ? formattedDated : null}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block rounded-md border-2 border-black bg-white p-1">
                {qrError || !qrValue ? (
                  <div className="flex h-12 w-12 items-center justify-center bg-gray-100 text-[9px] text-gray-500">
                    QR N/A
                  </div>
                ) : (
                  <QRCode value={qrValue} size={48} level="M" />
                )}
              </div>
              <p className="mt-0.5 text-[8px] text-gray-500">รหัสการประเมิน: {assessment.id}</p>
            </div>
          </div>
        </header>

        {/* Main Content - Compact Layout */}
        <main className="space-y-2">
          {/* Service & Device Info in one row */}
          <div className="print-section grid grid-cols-2 gap-2.5">
            {/* Service Information */}
            <section>
              <SectionHeader title={`${SERVICE_CONFIG[serviceType].icon} ข้อมูลบริการ`} />

              <div className="space-y-0.5 p-2">
                <DetailRow
                  label="บริการ"
                  value={SERVICE_CONFIG[serviceType as keyof typeof SERVICE_CONFIG]?.title || "-"}
                />
                <DetailRow label="ชื่อลูกค้า" value={serviceRecord.customerName || "-"} />
                <DetailRow label="เบอร์โทร" value={serviceRecord.phone || "-"} />

                <DetailRow label="ที่อยู่" value={getLocationText(activeService)} />
                <DetailRow
                  label="วันนัดหมาย"
                  value={
                    <div className="flex gap-1">
                      <div>{readStringProp(serviceRecord, "appointmentDate") ?? "-"}</div>
                    </div>
                  }
                />
                <DetailRow
                  label="เวลานัดหมาย"
                  value={
                    <div className="flex gap-1">
                      <div className="text-pink-600">
                        {readStringProp(serviceRecord, "appointmentTime") ?? "-"} น.
                      </div>
                    </div>
                  }
                />
              </div>
            </section>

            {/* Device Information */}
            <section>
              <SectionHeader title="📱 ข้อมูลอุปกรณ์" />
              <div className="flex h-full w-full flex-col gap-0.5 p-2 pb-8">
                <DetailRow label="อุปกรณ์" value={deviceName} />
                <DetailRow
                  label="สถานะประกัน"
                  value={getWarrantyText(assessment.conditionInfo?.warranty || "")}
                />
                {/* <DetailRow
                  label="ประวัติการซ่อม"
                  value={getRepairText(assessment.conditionInfo?.openedOrRepaired || "")}
                /> */}
                <DetailRow
                  label="สามารถปลดล็อค iCloud"
                  value={assessment.conditionInfo?.canUnlockIcloud ? "ได้" : "ไม่ได้"}
                />
                <DetailRow
                  label="ราคาจากการประเมินสภาพ"
                  value={`${assessment.estimatedValue.toLocaleString("th-TH")}฿`}
                />
              </div>
            </section>
          </div>

          {/* Price Summary */}
          <section className="print-section">
            <SectionHeader title="💰 สรุปราคา" />
            <div className="flex w-full flex-col p-2">
              <div className="flex flex-col gap-0.5 rounded border-1 border-pink-300 bg-pink-50 p-1.5 text-center">
                <p className="mb-0.5 text-[10px] text-gray-600">
                  ราคาสำหรับบริการ:{" "}
                  {SERVICE_CONFIG[serviceType as keyof typeof SERVICE_CONFIG]?.title || "-"}
                </p>
                {/* TODO: ต้องคิดราคาต่อ Service จริงๆ */}
                <p className="text-2xl font-bold text-pink-600">
                  {assessment ? (assessment.estimatedValue + 2999).toLocaleString("th-TH") : 0} บาท
                </p>
                <p className="text-[10px]">ราคาประเมินโดยประมาณ อาจเปลี่ยนแปลงหลังตรวจสภาพจริง</p>
              </div>
            </div>
          </section>

          {/* Condition Summary - 2 columns */}
          <section className="print-section">
            <SectionHeader title="🔍 สรุปสภาพเครื่อง" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 p-2 text-[10px]">
              {conditionDetails.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-gray-100 py-0.5">
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

          {/* Important Notes */}
          {/* <section className="print-section">
            <SectionHeader title="⚠️ หมายเหตุสำคัญ" />
            <p className="flex justify-between text-[10px] leading-tight text-gray-700">
              <span className="flex items-center gap-1">
                <Dot className="-m-2" /> ราคาประเมินโดยประมาณ อาจเปลี่ยนแปลงหลังตรวจสภาพจริง
              </span>
              <span className="flex items-center gap-1">
                {" "}
                <Dot className="-m-2" /> เตรียมบัตรประชาชน และอุปกรณ์ให้พร้อม
              </span>
              <span className="flex items-center gap-1">
                <Dot className="-m-2" />
                แจ้งเจ้าหน้าที่ทันทีหากมีการเปลี่ยนแปลงเวลา/สถานที่
              </span>
            </p>
          </section> */}

          {/* Next Steps */}
          <section className="print-section">
            <SectionHeader title="📋 ลูกค้าจะต้องเตรียม" />
            {/* one row instead of 3 rows */}
            <ol className="list-inside list-decimal space-y-0.5 p-2 text-[10px] text-gray-700">
              <li>บัตรประชาชนตัวจริง (ต้องมีอายุมากกว่า 18 ปีขึ้นไป)</li>
              <li>สำรองข้อมูลไว้เรียบร้อย</li>
              <li>
                ชาร์จแบตเตอรี่ให้เต็ม ทำความสะอาดตัวเครื่อง อุปกรณ์ กล่อง ใบเสร็จ (หากมี)
                ให้พร้อมเพื่อความสะดวกรวดเร็วต่อเจ้าหน้าที่ในการตรวจสอบสินค้า
              </li>
            </ol>
          </section>
        </main>

        {/* Footer */}
        <footer className="print-footer mt-2 border-t border-gray-200 pt-1.5">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <span>วันที่ออกเอกสาร: {currentDate}</span>
          </div>
        </footer>
      </div>
    );
  },
);

PrintableAssessment.displayName = "PrintableAssessment";
export default PrintableAssessment;
