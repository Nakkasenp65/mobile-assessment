"use client";

import React, { useRef } from "react";
import PrintableAssessment from "@/app/confirmed/[assessmentId]/components/(print-form)/PrintableAssessment";
import { Assessment } from "@/types/assessment";

// Mock assessment data for debugging
const mockAssessment: Assessment = {
  id: "ASSESS-20251028-001",
  docId: "doc-12345",
  phoneNumber: "0812345678",
  customerName: "สมชาย ใจดี",
  status: "completed",
  type: "SELL_NOW",
  estimatedValue: 15000,
  assessmentDate: new Date().toISOString(),
  expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  deviceInfo: {
    brand: "Apple",
    model: "iPhone 14 Pro",
    storage: "128GB",
    productType: "iPhone",
  },
  conditionInfo: {
    canUnlockIcloud: true,
    modelType: "model_th",
    warranty: "warranty_active_long",
    openedOrRepaired: "repaired_no",
    accessories: "acc_full",
    bodyCondition: "body_mint",
    screenGlass: "glass_ok",
    screenDisplay: "display_ok",
    batteryHealth: "battery_health_high",
    camera: "camera_ok",
    wifi: "wifi_ok",
    faceId: "biometric_ok",
    speaker: "speaker_ok",
    mic: "mic_ok",
    touchScreen: "touchscreen_ok",
    charger: "charger_ok",
    call: "call_ok",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
  },
  sellNowServiceInfo: {
    customerName: "สมชาย ใจดี",
    phone: "0812345678",
    locationType: "bts",
    btsStation: "สยาม",
    appointmentDate: "29 ตุลาคม 2568",
    appointmentTime: "14:00 - 16:00",
  },
};

export default function PrintDebugPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        {/* Controls */}
        <div className="mb-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">Print Preview - Debugger</h1>
          <div className="space-y-2">
            <button
              onClick={handlePrint}
              className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Print Document
            </button>
            <p className="text-sm text-gray-600">
              The preview below shows the exact A4 size for printing. Edit the mock data to test
              different scenarios.
            </p>
          </div>
        </div>

        {/* A4 Preview Container */}
        <div className="mx-auto flex justify-center bg-white p-4 shadow-lg">
          {/* A4 Size: 210mm × 297mm */}
          <div
            style={{
              width: "210mm",
              height: "297mm",
              overflow: "hidden",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <PrintableAssessment ref={printRef} assessment={mockAssessment} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 space-y-4 rounded bg-yellow-50 p-4 text-sm">
          <h2 className="font-semibold text-yellow-900">Instructions:</h2>
          <ul className="list-inside list-disc space-y-2 text-yellow-800">
            <li>Edit the mock assessment data in this file to test different scenarios</li>
            <li>The preview container is exactly A4 size (210mm × 297mm)</li>
            <li>Use the Print button to print or save as PDF</li>
            <li>Monitor the browser DevTools console for any errors or warnings while editing</li>
          </ul>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
