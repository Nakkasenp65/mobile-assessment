"use client";

import { ComponentType } from "react";
import { DeviceInfo, ConditionInfo } from "../../page";
import { RepairItem } from "@/hooks/useRepairPrices"; // CHIRON: Import Type ที่จำเป็นสำหรับส่วนบริการซ่อม
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
  CheckCircle,
  ShieldCheck,
  Archive,
  Frame,
  ScanFace,
  Info,
  AlertTriangleIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import MaintenanceService from "./(services)/MaintenanceService";

// --- ICON and LABEL MAPs ---
// CHIRON: โครงสร้างข้อมูลเหล่านี้ทำหน้าที่เป็น "พจนานุกรม" สำหรับการแสดงผล ทำให้โค้ดส่วน JSX สะอาดและจัดการง่าย
const ICON_MAP: Record<string, ComponentType<any>> = {
  brand: Smartphone,
  model: Cpu,
  storage: HardDrive,
  batteryHealth: BatteryCharging,
  screenGlass: Frame,
  screenDisplay: Monitor,
  powerOn: Power,
  camera: Camera,
  charger: BatteryCharging,
  wifi: Wifi,
  touchScreen: Hand,
  mic: Mic,
  speaker: Volume2,
  modelType: Smartphone,
  warranty: ShieldCheck,
  accessories: Archive,
  bodyCondition: Smartphone,
  faceId: ScanFace,
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
  modelType: "รุ่นโมเดล",
  warranty: "ประกันศูนย์",
  accessories: "อุปกรณ์",
  bodyCondition: "สภาพตัวเครื่อง",
  faceId: "Face ID / Touch ID",
};

const TRANSLATION_MAP: Record<string, string> = {
  th: "เครื่องไทย (TH)",
  other: "เครื่องนอก (ZP, LL, etc.)",
  active_long: "เหลือมากกว่า 4 เดือน",
  active_short: "เหลือน้อยกว่า 4 เดือน",
  inactive: "หมดประกันแล้ว",
  full: "ครบกล่อง",
  box_only: "มีเฉพาะกล่อง",
  no_box: "ไม่มีกล่อง",
};

// --- Helper Function ---
// CHIRON: ฟังก์ชันเล็กๆ ที่มีหน้าที่เดียว (Single Responsibility) ช่วยลดความซับซ้อนของตรรกะใน JSX
const isConsideredPassed = (key: string, value: string): boolean => {
  const positiveValues = [
    "passed",
    "perfect",
    "mint",
    "high",
    "excellent",
    "good",
    "th",
    "full",
    "active_long",
  ];
  if (positiveValues.includes(value)) return true;
  if (key === "touchScreen" && parseInt(value) >= 95) return true;
  return false;
};

// --- Sub-component: TestItem ---
// CHIRON: Component ย่อยสำหรับแสดงผลการทดสอบแต่ละรายการ ทำให้โค้ดหลักอ่านง่ายขึ้น
const TestItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: string }) => {
  const Icon = ICON_MAP[itemKey];
  const isPassed = isConsideredPassed(itemKey, itemValue);

  if (!itemValue || !Icon) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border p-2 transition-all duration-300 lg:gap-3 lg:p-3",
        isPassed
          ? "border-slate-200/80 bg-gradient-to-br from-white to-slate-50"
          : "border-orange-200/80 bg-gradient-to-br from-white to-orange-50",
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm md:h-11 md:w-11">
          <Icon
            className={cn("h-5 w-5 md:h-6 md:w-6", isPassed ? "text-slate-600" : "text-orange-500")}
          />
        </div>
        <div
          className={cn(
            "absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white md:h-5 md:w-5",
            isPassed ? "bg-green-500" : "bg-orange-500",
          )}
        >
          {isPassed ? (
            <CheckCircle className="h-2.5 w-2.5 text-white md:h-3 md:w-3" strokeWidth={3} />
          ) : (
            <AlertTriangleIcon className="h-2 w-2 text-white md:h-2.5 md:w-2.5" strokeWidth={3} />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-semibold sm:w-max",
            isPassed ? "text-slate-700" : "text-orange-800",
          )}
        >
          {LABEL_MAP[itemKey] || itemKey}
        </span>
        <span className={cn("text-xs", isPassed ? "text-slate-500" : "text-orange-600")}>
          {itemValue}
        </span>
      </div>
    </div>
  );
};

// --- Sub-component: GeneralInfoItem ---
// CHIRON: Component ย่อยสำหรับข้อมูลทั่วไป ช่วยลดการเขียนโค้ดซ้ำซ้อน
const GeneralInfoItem = ({ itemKey, itemValue }: { itemKey: string; itemValue: string }) => {
  const Icon = ICON_MAP[itemKey];
  const label = LABEL_MAP[itemKey];
  const translatedValue = TRANSLATION_MAP[itemValue] || itemValue;

  if (!itemValue || !Icon) return null;

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-slate-500" />
      <div className="flex w-full justify-between text-sm">
        <span className="text-slate-600">{label}:</span>
        <span className="font-semibold text-slate-800">{translatedValue}</span>
      </div>
    </div>
  );
};

// --- Main Component Interface ---
// CHIRON: Structural Engineer - นี่คือ "สัญญา" (Contract) ของ Component
// การรวม props ทั้งหมดที่นี่ทำให้เห็นภาพรวมความรับผิดชอบของ AssessmentLedger ได้อย่างชัดเจน
interface AssessmentLedgerProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
}

// --- Main Component: AssessmentLedger ---
const AssessmentLedger: React.FC<AssessmentLedgerProps> = ({
  deviceInfo,
  conditionInfo,
  repairs,
  totalCost,
  isLoading,
}) => {
  const allInfo = { ...deviceInfo, ...conditionInfo };

  const generalInfoKeys = ["modelType", "warranty", "accessories"];
  const conditionKeys = Object.keys(allInfo).filter(
    (key) =>
      allInfo[key as keyof typeof allInfo] &&
      !["brand", "model", "storage", ...generalInfoKeys].includes(key),
  );

  return (
    // CHIRON: Root element ที่ครอบคลุมทั้งสองส่วนหลัก (รายละเอียดสภาพ และ ค่าซ่อม)
    <div className="flex w-full flex-col gap-6">
      {/* ส่วนที่ 1: Accordion แสดงรายละเอียดสภาพเครื่อง */}
      <Accordion type="single" collapsible className="w-full" defaultValue="details">
        <AccordionItem
          value="details"
          className="overflow-hidden rounded-2xl border-none bg-white shadow-sm dark:bg-zinc-800"
        >
          <AccordionTrigger className="flex w-full items-center p-4 text-left hover:no-underline">
            <div className="flex w-full flex-col items-start">
              <h2 className="flex items-center gap-1 text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
                รายละเอียดสภาพเครื่อง
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                คลิกเพื่อดูรายละเอียดผลการประเมินทั้งหมด
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col gap-6 p-4">
            {/* ข้อมูลเครื่องโดยทั่วไป */}
            <div className="bg-white">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-500" />
                <h3 className="font-bold text-slate-800">ข้อมูลทั่วไปของเครื่อง</h3>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-3">
                {generalInfoKeys.map((key) => (
                  <GeneralInfoItem
                    key={key}
                    itemKey={key}
                    itemValue={allInfo[key as keyof typeof allInfo]}
                  />
                ))}
              </div>
            </div>
            {/* อาการที่ตรวจพบ */}
            <div className="flex flex-col gap-4 border-t border-b pt-4 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {conditionKeys.map((key) => (
                  <TestItem
                    key={key}
                    itemKey={key}
                    itemValue={allInfo[key as keyof typeof allInfo]}
                  />
                ))}
              </div>
            </div>
            {/* ค่าบริาการซ่อม */}
            <MaintenanceService
              deviceInfo={deviceInfo}
              repairs={repairs}
              totalCost={totalCost}
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ส่วนที่ 2: แสดงผลค่าบริการซ่อม ซึ่งตอนนี้เป็นความรับผิดชอบของ Component นี้ */}
      {/* CHIRON: การส่งผ่าน props ทั้งหมดลงไป ทำให้ MaintenanceService เป็น "Pure Component" ที่ควบคุมจากภายนอกได้ง่าย */}
    </div>
  );
};

export default AssessmentLedger;
