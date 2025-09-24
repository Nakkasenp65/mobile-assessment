// src/app/assess/components/(step3)/AssessmentLedger.tsx

"use client";
import { ComponentType } from "react";
import { PriceAdjustment } from "../../../../hooks/usePriceCalculation";
import {
  Bluetooth,
  Camera,
  Mic,
  BatteryCharging,
  Volume2,
  MousePointerClick,
  Wifi,
  SlidersHorizontal,
  AlertTriangle, // ไอคอนสำหรับแจ้งเตือน
} from "lucide-react";
import { ConditionInfo } from "../../page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------------------------------------------------------------------------------------------
// Interface & Data Structure
// โครงสร้างข้อมูลสำหรับแต่ละรายการทดสอบ (คงเดิม)
// ----------------------------------------------------------------------------------------------------
interface TestItem {
  key: keyof ConditionInfo | string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const TEST_ITEMS: TestItem[] = [
  { key: "bluetooth", label: "Bluetooth", Icon: Bluetooth },
  { key: "cameras", label: "Front Camera", Icon: Camera },
  { key: "mic", label: "Microphone", Icon: Mic },
  { key: "charger", label: "Charging", Icon: BatteryCharging },
  { key: "cameras_rear", label: "Rear Camera", Icon: Camera },
  { key: "speaker", label: "Speaker", Icon: Volume2 },
  { key: "touchScreen", label: "Touchscreen", Icon: MousePointerClick },
  { key: "volume_buttons", label: "Volume buttons", Icon: SlidersHorizontal },
  { key: "wifi", label: "WIFI", Icon: Wifi },
];

// ----------------------------------------------------------------------------------------------------
// Component: FailedTestItem
// **ปรับปรุงใหม่:** แสดงผลเฉพาะรายการที่ "ไม่ผ่าน" พร้อมไอคอนแจ้งเตือน
// ----------------------------------------------------------------------------------------------------
const FailedTestItem = ({
  label,
  Icon,
}: {
  label: string;
  Icon: ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-3 dark:bg-zinc-800">
    <div className="relative flex-shrink-0">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-700">
        <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
      </div>
      {/* แสดงไอคอนแจ้งเตือนสีส้มเสมอสำหรับรายการที่เสีย */}
      <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-100 bg-orange-500 dark:border-zinc-800">
        <AlertTriangle className="h-3 w-3 text-white" />
      </div>
    </div>
    <span className="text-sm font-semibold break-words text-slate-700 dark:text-zinc-200">
      {label}
    </span>
  </div>
);

// ----------------------------------------------------------------------------------------------------
// Component: AssessmentLedger (Main)
// **ปรับปรุงใหม่:** ใช้ Accordion และแสดงเฉพาะรายการที่เสียหาย
// ----------------------------------------------------------------------------------------------------
const AssessmentLedger = ({
  adjustments,
}: {
  adjustments: PriceAdjustment[];
}) => {
  // **ปรับปรุงตรรกะ:** กรองเฉพาะรายการทดสอบที่ไม่ผ่านเกณฑ์ (มี impact เป็นลบ)
  const failedItems = TEST_ITEMS.filter((item) => {
    const effectiveKey = item.key === "cameras_rear" ? "cameras" : item.key;
    const adj = adjustments.find((a) => a.key === effectiveKey);
    return adj && adj.impact < 0;
  });

  console.log(adjustments);

  const hasFailed = failedItems.length > 0;

  // ถ้าไม่มีรายการที่เสียเลย จะไม่แสดงผลคอมโพเนนต์นี้
  if (!hasFailed) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 2. แสดงส่วนรายละเอียดแบบ Accordion */}
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="details" // เปิด Accordion ไว้เป็นค่าเริ่มต้น
      >
        <AccordionItem
          value="details"
          className="rounded-2xl border-none bg-white shadow-lg dark:bg-zinc-800"
        >
          <AccordionTrigger className="w-full p-4 text-left hover:no-underline">
            <div className="flex w-full flex-col items-start">
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">
                Functionality tests details
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                Click to see the details of the issues found.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="mt-2 border-t pt-4 dark:border-zinc-700">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {/* 3. แสดง Grid ของรายการที่เสียหายเท่านั้น */}
                {failedItems.map((item) => (
                  <FailedTestItem
                    key={item.label}
                    label={item.label}
                    Icon={item.Icon}
                  />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AssessmentLedger;
