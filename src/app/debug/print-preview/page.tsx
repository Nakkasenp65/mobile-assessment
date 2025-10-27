"use client";

import React, { useRef, useState } from "react";
import PrintableAssessment from "@/app/confirmed/[assessmentId]/components/PrintableAssessment";
import type { AssessmentRecord } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Printer, Download, RefreshCw } from "lucide-react";

// Mock assessment data for testing
const MOCK_ASSESSMENT: AssessmentRecord = {
  id: "AS-2024-001-DEBUG",
  phoneNumber: "0812345678",
  status: "completed",
  createdAt: "2024-10-25T10:00:00Z",
  updatedAt: "2024-10-25T10:00:00Z",
  deviceInfo: {
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    productType: "iPhone",
  },
  conditionInfo: {
    warranty: "warranty_active_long",
    openedOrRepaired: "repaired_no",
    canUnlockIcloud: true,
    modelType: "model_th",
    bodyCondition: "body_mint",
    batteryHealth: "battery_health_high",
    accessories: "acc_full",
    screenDisplay: "display_ok",
    screenGlass: "glass_ok",
    faceId: "biometric_ok",
    wifi: "wifi_ok",
    camera: "camera_ok",
    speaker: "speaker_ok",
    mic: "mic_ok",
    touchScreen: "touchscreen_ok",
    charger: "charger_ok",
    call: "call_ok",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
  },
  estimatedValue: 28500,
  sellNowServiceInfo: {
    type: "SELL_NOW",
    customerName: "สมชาย ศรีวิทยา",
    phone: "0812345678",
    locationType: "home",
    appointmentDate: "2024-10-28",
    appointmentTime: "14:00",
    appointmentAt: "2024-10-28T14:00:00Z",
    branchId: "center-one",
    serviceType: "SELL_NOW",
    addressDetails: "123 ซอยสุขุมวิท 45",
    province: "กรุงเทพ",
    district: "พระโขนง",
    subdistrict: "สุขุมวิท",
    postcode: "10110",
  },
};

interface EditableFieldsState {
  customerName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  estimatedValue: number;
  locationType: "store" | "bts" | "home";
  addressDetails: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
}

export default function PrintPreviewDebugPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [editableFields, setEditableFields] = useState<EditableFieldsState>({
    customerName: MOCK_ASSESSMENT.sellNowServiceInfo?.customerName || "",
    phone: MOCK_ASSESSMENT.sellNowServiceInfo?.phone || "",
    appointmentDate: MOCK_ASSESSMENT.sellNowServiceInfo?.appointmentDate || "",
    appointmentTime: MOCK_ASSESSMENT.sellNowServiceInfo?.appointmentTime || "",
    estimatedValue: MOCK_ASSESSMENT.estimatedValue || 0,
    locationType: MOCK_ASSESSMENT.sellNowServiceInfo?.locationType || "home",
    addressDetails: MOCK_ASSESSMENT.sellNowServiceInfo?.addressDetails || "",
    province: MOCK_ASSESSMENT.sellNowServiceInfo?.province || "",
    district: MOCK_ASSESSMENT.sellNowServiceInfo?.district || "",
    subdistrict: MOCK_ASSESSMENT.sellNowServiceInfo?.subdistrict || "",
    postcode: MOCK_ASSESSMENT.sellNowServiceInfo?.postcode || "",
  });

  // Update assessment with current editable fields
  const currentAssessment: AssessmentRecord = {
    ...MOCK_ASSESSMENT,
    estimatedValue: editableFields.estimatedValue,
    sellNowServiceInfo: MOCK_ASSESSMENT.sellNowServiceInfo
      ? {
          ...MOCK_ASSESSMENT.sellNowServiceInfo,
          customerName: editableFields.customerName,
          phone: editableFields.phone,
          appointmentDate: editableFields.appointmentDate,
          appointmentTime: editableFields.appointmentTime,
          locationType: editableFields.locationType,
          addressDetails: editableFields.addressDetails,
          province: editableFields.province,
          district: editableFields.district,
          subdistrict: editableFields.subdistrict,
          postcode: editableFields.postcode,
        }
      : undefined,
  };

  const handleFieldChange = <K extends keyof EditableFieldsState>(
    field: K,
    value: EditableFieldsState[K],
  ) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print Assessment</title><style>body { margin: 0; padding: 0; }</style></head><body>",
        );
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadPDF = () => {
    // This is a placeholder - you would need html2pdf or similar library
    alert("PDF download feature requires additional setup. Use browser print > Save as PDF");
  };

  const handleReset = () => {
    setEditableFields({
      customerName: MOCK_ASSESSMENT.sellNowServiceInfo?.customerName || "",
      phone: MOCK_ASSESSMENT.sellNowServiceInfo?.phone || "",
      appointmentDate: MOCK_ASSESSMENT.sellNowServiceInfo?.appointmentDate || "",
      appointmentTime: MOCK_ASSESSMENT.sellNowServiceInfo?.appointmentTime || "",
      estimatedValue: MOCK_ASSESSMENT.estimatedValue || 0,
      locationType: MOCK_ASSESSMENT.sellNowServiceInfo?.locationType || "home",
      addressDetails: MOCK_ASSESSMENT.sellNowServiceInfo?.addressDetails || "",
      province: MOCK_ASSESSMENT.sellNowServiceInfo?.province || "",
      district: MOCK_ASSESSMENT.sellNowServiceInfo?.district || "",
      subdistrict: MOCK_ASSESSMENT.sellNowServiceInfo?.subdistrict || "",
      postcode: MOCK_ASSESSMENT.sellNowServiceInfo?.postcode || "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🖨️ Print Preview Debug</h1>
          <p className="mt-2 text-gray-600">
            A4 preview page for PrintableAssessment component with live editing
          </p>
        </div>

        {/* Control Panel - Collapsible */}
        <div className="mb-6 rounded-2xl bg-white shadow-md">
          <button
            onClick={() => setShowControls(!showControls)}
            className="flex w-full items-center justify-between rounded-t-2xl border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 transition-all hover:from-orange-100 hover:to-amber-100"
          >
            <h2 className="text-lg font-semibold text-gray-900">📝 Edit Fields</h2>
            {showControls ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {showControls && (
            <div className="space-y-6 border-t border-gray-100 p-6">
              {/* Customer Info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">ข้อมูลลูกค้า</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="ชื่อลูกค้า"
                    value={editableFields.customerName}
                    onChange={(e) => handleFieldChange("customerName", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="เบอร์โทร"
                    value={editableFields.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Appointment Info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">ข้อมูลนัดหมาย</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <input
                    type="date"
                    value={editableFields.appointmentDate}
                    onChange={(e) => handleFieldChange("appointmentDate", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={editableFields.appointmentTime}
                    onChange={(e) => handleFieldChange("appointmentTime", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <select
                    value={editableFields.locationType}
                    onChange={(e) =>
                      handleFieldChange("locationType", e.target.value as "store" | "bts" | "home")
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  >
                    <option value="home">รับซื้อถึงบ้าน</option>
                    <option value="bts">สถานี BTS</option>
                    <option value="store">ร้าน</option>
                  </select>
                </div>
              </div>

              {/* Address Info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">ที่อยู่</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="รายละเอียดที่อยู่"
                    value={editableFields.addressDetails}
                    onChange={(e) => handleFieldChange("addressDetails", e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <input
                      type="text"
                      placeholder="ตำบล"
                      value={editableFields.subdistrict}
                      onChange={(e) => handleFieldChange("subdistrict", e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="อำเภอ"
                      value={editableFields.district}
                      onChange={(e) => handleFieldChange("district", e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="จังหวัด"
                      value={editableFields.province}
                      onChange={(e) => handleFieldChange("province", e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="รหัสไปรษณีย์"
                      value={editableFields.postcode}
                      onChange={(e) => handleFieldChange("postcode", e.target.value)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">ราคา</h3>
                <input
                  type="number"
                  placeholder="ราคาประเมิน"
                  value={editableFields.estimatedValue}
                  onChange={(e) =>
                    handleFieldChange("estimatedValue", parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none md:max-w-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handlePrint} className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button onClick={handleReset} variant="outline" className="ml-auto gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* A4 Preview Container */}
        <div className="flex flex-col items-center gap-6">
          {/* Ruler Top */}
          <div className="flex w-full items-center">
            <div className="w-12 flex-shrink-0 pr-2 text-right text-xs text-gray-400">0</div>
            <div className="relative h-6 flex-1 border-b-2 border-gray-300">
              {Array.from({ length: 21 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 border-l border-gray-300"
                  style={{
                    left: `${(i * 100) / 20}%`,
                    height: i % 2 === 0 ? "8px" : "4px",
                  }}
                >
                  {i % 2 === 0 && (
                    <span className="ml-1 text-[10px] whitespace-nowrap text-gray-400">
                      {i * 20}mm
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-12 flex-shrink-0 pl-2 text-xs text-gray-400">210mm</div>
          </div>

          {/* A4 Container */}
          <div
            ref={containerRef}
            className="relative bg-white shadow-2xl"
            style={{
              width: "210mm",
              minHeight: "297mm",
              aspectRatio: "1 / 1.414",
            }}
          >
            {/* A4 Border */}
            <div className="pointer-events-none absolute inset-0 rounded border-2 border-dashed border-gray-300"></div>

            {/* A4 Dimensions Label */}
            <div className="absolute -top-6 left-0 text-xs font-semibold text-gray-500">
              A4 (210mm × 297mm)
            </div>

            {/* Printable Assessment Component */}
            <div ref={printRef} className="h-full w-full overflow-auto">
              <PrintableAssessment assessment={currentAssessment} />
            </div>
          </div>

          {/* Ruler Bottom */}
          <div className="flex w-full items-center">
            <div className="w-12 flex-shrink-0 pr-2 text-right text-xs text-gray-400">0</div>
            <div className="relative h-6 flex-1 border-t-2 border-gray-300">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 border-l border-gray-300"
                  style={{
                    left: `${(i * 100) / 14}%`,
                    height: i % 2 === 0 ? "8px" : "4px",
                  }}
                >
                  {i % 2 === 0 && (
                    <span className="ml-1 text-[10px] whitespace-nowrap text-gray-400">
                      {i * 28}mm
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-12 flex-shrink-0 pl-2 text-xs text-gray-400">297mm</div>
          </div>

          {/* Info Box */}
          <div className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Tip:</span> Use the controls above to edit the
              assessment data. The preview updates in real-time. Click &quot;Print&quot; to open the
              system print dialog, then save as PDF or print directly.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
