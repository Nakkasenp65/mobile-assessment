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
  CheckCircle, // 1. Import ไอคอน CheckCircle เพิ่ม
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ----------------------------------------------------------------------------------------------------
// Data Maps: คงเดิม
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
// Component: TestItem (ปรับปรุงใหม่)
// ----------------------------------------------------------------------------------------------------
const TestItem = ({
  itemKey,
  itemValue,
}: {
  itemKey: string;
  itemValue: string;
}) => {
  const label = LABEL_MAP[itemKey] || itemKey;
  const Icon = ICON_MAP[itemKey];

  // 2. ตรวจสอบสถานะว่า "ผ่าน" หรือไม่
  const isPassed =
    ["passed", "success", "good", "excellent"].includes(itemValue) ||
    (itemKey === "touchScreen" && parseInt(itemValue) >= 90);

  // ไม่แสดงผลถ้ารายการนั้นไม่มีข้อมูล หรือไม่มีไอคอน
  if (!itemValue || !Icon) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-slate-100 p-2 md:p-3 dark:bg-zinc-800 ${isPassed ? null : "ring-primary/25 to-primary/20 from-accent via-accent bg-gradient-to-br ring-2"}`}
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-700">
          <Icon className="h-5 w-5 text-zinc-600 md:h-6 md:w-6 dark:text-zinc-300" />
        </div>
        {/* 3. แสดงไอคอนตามสถานะ (ผ่าน/ไม่ผ่าน) */}
        <div
          className={`absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-zinc-800 ${isPassed ? "bg-green-500" : "bg-orange-500"}`}
        >
          {isPassed ? (
            <CheckCircle className="h-2.5 w-2.5 text-white" />
          ) : (
            <AlertTriangle className="h-2.5 w-2.5 text-white" />
          )}
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
// ----------------------------------------------------------------------------------------------------
const AssessmentLedger = ({
  deviceInfo,
  conditionInfo,
}: {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
}) => {
  // 4. รวมข้อมูลทั้งหมดและกรองรายการที่ไม่มีค่า (null, undefined, "") ออก
  const allInfo = { ...deviceInfo, ...conditionInfo };
  const allItems = Object.entries(allInfo).filter(([_, value]) => value);

  // ไม่แสดงผลเลยถ้าไม่มีข้อมูลอะไรเลย
  if (allItems.length === 0) {
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
          <AccordionTrigger className="flex w-full items-center p-4 text-left hover:no-underline">
            <div className="flex w-full flex-col items-start">
              <h2 className="flex items-center gap-1 text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
                รายละเอียดการตรวจสอบ
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                คลิกเพื่อดูรายละเอียดผลการประเมินทั้งหมด
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="border-t pt-4 dark:border-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                {/* 5. แสดงผลทุกรายการที่มีข้อมูล */}
                {allItems.map(([key, value]) => (
                  <TestItem key={key} itemKey={key} itemValue={value} />
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
