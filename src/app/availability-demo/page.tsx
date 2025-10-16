// src/app/availability-demo/page.tsx
"use client";

import React from "react";
import DateTimeSelect from "@/components/ui/DateTimeSelect";

export default function AvailabilityDemoPage() {
  const [serviceType, setServiceType] = React.useState<string>("ซ่อมมือถือ");
  const [date, setDate] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");
  // Simulate service data to auto-detect location: toggle fields
  const [serviceData, setServiceData] = React.useState<Record<string, unknown>>({ storeLocation: "OK Mobile สาขาหลัก" });

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-xl font-bold">Availability Demo</h1>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">บริการ</label>
          <select
            className="w-full rounded border border-gray-300 p-2 text-sm"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="ซื้อขายมือถือ">ซื้อขายมือถือ</option>
            <option value="ขายฝากมือถือ">ขายฝากมือถือ</option>
            <option value="รีไฟแนนซ์">รีไฟแนนซ์</option>
            <option value="ไอโฟนแลกเงิน">ไอโฟนแลกเงิน</option>
            <option value="ซ่อมมือถือ">ซ่อมมือถือ</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">ข้อมูลสถานที่ (จำลอง)</label>
          <select
            className="w-full rounded border border-gray-300 p-2 text-sm"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "store") setServiceData({ storeLocation: "OK Mobile สาขาหลัก" });
              else if (v === "bts") setServiceData({ btsStation: "BTS Siam" });
              else setServiceData({ address: "ซอยตัวอย่าง แขวงตัวอย่าง" });
            }}
          >
            <option value="store">รับซื้อที่ร้าน</option>
            <option value="bts">BTS/MRT</option>
            <option value="home">ที่บ้าน/ออนไลน์</option>
          </select>
        </div>
      </div>

      <DateTimeSelect
        serviceType={serviceType}
        serviceData={serviceData}
        dateValue={date}
        onDateChange={(v) => {
          setDate(v);
          // reset time when date changes
          setTime("");
        }}
        timeValue={time}
        onTimeChange={setTime}
      />

      <div className="mt-4 text-sm text-gray-700">วันที่: {date || "-"} · เวลา: {time || "-"}</div>
    </div>
  );
}