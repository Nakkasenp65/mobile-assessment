// src/app/assess/components/(step3)/AssessmentLedger.tsx

"use client";
import { ComponentType } from "react";
import { DeviceInfo, ConditionInfo } from "../../page";
import {
  BatteryCharging,
  Camera,
  Cpu,
  HardDrive,
  Hand,
  Mic,
  Monitor,
  Power,
  Smartphone,
  Volume2,
  Wifi,
  AlertTriangle,
  PowerOff,
  Flag,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------------------------------------------------------------------------------------------
// Data Maps: แหล่งข้อมูลหลักสำหรับ Label และ Icon
// ----------------------------------------------------------------------------------------------------
const ICON_MAP: Record<string, ComponentType<any>> = {
  brand: Smartphone,
  model: Cpu,
  storage: HardDrive,
  batteryHealth: BatteryCharging,
  screenGlass: Smartphone,
  screenDisplay: Monitor,
  powerOn: Power,
  camera: Camera,
  charger: BatteryCharging,
  wifi: Wifi,
  touchScreen: Hand,
  mic: Mic,
  speaker: Volume2,
};

const LABEL_MAP: Record<string, string> = {
  brand: "ยี่ห้อ",
  model: "รุ่น",
  storage: "ความจุ",
  batteryHealth: "สุขภาพแบตเตอรี่",
  screenGlass: "สภาพกระจกหน้าจอ",
  screenDisplay: "คุณภาพการแสดงผล",
  powerOn: "การเปิดเครื่อง",
  touchScreen: "ระบบสัมผัส",
  wifi: "Wi-Fi",
  charger: "การชาร์จ",
  speaker: "ลำโพง",
  mic: "ไมโครโฟน",
  camera: "กล้อง",
};

// ----------------------------------------------------------------------------------------------------
// Component: FailedTestItem
// แสดงผลรายการที่ "ไม่ผ่าน" โดยดึงข้อมูลจาก MAPs
// ----------------------------------------------------------------------------------------------------
const FailedTestItem = ({ itemKey }: { itemKey: string }) => {
  const label = LABEL_MAP[itemKey] || itemKey;
  const Icon = ICON_MAP[itemKey];

  if (!Icon) return null; // ไม่แสดงผลถ้าไม่มีไอคอนที่กำหนด

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-2 md:p-3 dark:bg-zinc-800">
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-700">
          <Icon className="h-5 w-5 text-zinc-600 md:h-6 md:w-6 dark:text-zinc-300" />
        </div>
        <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-100 bg-orange-500 dark:border-zinc-800">
          <AlertTriangle className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
      <span className="text-sm font-semibold break-words text-slate-700 dark:text-zinc-200">
        {label}
      </span>
    </div>
  );
};

// ----------------------------------------------------------------------------------------------------
// Component: AssessmentLedger (Main)
// **ปรับปรุงใหม่:** ใช้ข้อมูลจาก deviceInfo และ conditionInfo โดยตรงเพื่อกรองรายการที่เสียหาย
// ----------------------------------------------------------------------------------------------------
const AssessmentLedger = ({
  deviceInfo,
  conditionInfo,
}: {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
}) => {
  // **ตรรกะใหม่:** รวมข้อมูลทั้งหมดและกรองเฉพาะรายการที่มีปัญหา
  const allInfo = { ...deviceInfo, ...conditionInfo };
  const failedKeys = Object.entries(allInfo)
    .filter(([key, value]) => value === "failed" || value === "defect")
    .map(([key]) => key);

  const hasFailed = failedKeys.length > 0;

  // ถ้าไม่มีรายการที่เสียเลย จะไม่แสดงผลคอมโพเนนต์นี้
  if (!hasFailed) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="details"
      >
        <AccordionItem
          value="details"
          className="rounded-2xl border-none bg-white dark:bg-zinc-800"
        >
          <AccordionTrigger className="flex w-full items-center text-left hover:no-underline">
            <div className="flex w-full flex-col items-start">
              <h2 className="flex items-center gap-1 text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
                อาการที่พบ
                <Flag size={18} className="mb-1" />
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                Click to see the details of the issues found.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-0">
            <div className="border-t pt-4 dark:border-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                {/* 3. แสดง Grid ของรายการที่เสียหายเท่านั้น */}
                {failedKeys.map((key) => (
                  <FailedTestItem key={key} itemKey={key} />
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
