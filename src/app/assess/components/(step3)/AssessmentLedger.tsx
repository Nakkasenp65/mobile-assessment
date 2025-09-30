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
  CheckCircle,
  ShieldCheck,
  Archive,
  Frame,
  ScanFace,
  Info,
  AlertTriangleIcon, // 👈 เพิ่มไอคอนสำหรับกล่องข้อมูล
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils"; // 👈 import cn utility

// --- ICON and LABEL MAPs (เหมือนเดิม) ---
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

// --- ✨ [เพิ่ม] TRANSLATION_MAP สำหรับแปลค่า value ---
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

// --- ฟังก์ชัน isConsideredPassed (เหมือนเดิม) ---
const isConsideredPassed = (
  key: string,
  value: string,
): boolean => {
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
  if (key === "touchScreen" && parseInt(value) >= 95)
    return true;
  return false;
};

// --- Component TestItem (เหมือนเดิม) ---
const TestItem = ({
  itemKey,
  itemValue,
}: {
  itemKey: string;
  itemValue: string;
}) => {
  const label = LABEL_MAP[itemKey] || itemKey;
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
            className={cn(
              "h-5 w-5 md:h-6 md:w-6",
              isPassed
                ? "text-slate-600"
                : "text-orange-500",
            )}
          />
        </div>
        <div
          className={cn(
            "absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white md:h-5 md:w-5",
            isPassed ? "bg-green-500" : "bg-orange-500",
          )}
        >
          {isPassed ? (
            <CheckCircle
              className="h-2.5 w-2.5 text-white md:h-3 md:w-3"
              strokeWidth={3}
            />
          ) : (
            <AlertTriangleIcon
              className="h-2 w-2 text-white md:h-2.5 md:w-2.5"
              strokeWidth={3}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-semibold lg:text-base",
            isPassed ? "text-slate-700" : "text-orange-800",
          )}
        >
          {LABEL_MAP[itemKey] || itemKey}
        </span>
        <span
          className={cn(
            "text-xs",
            isPassed ? "text-slate-500" : "text-orange-600",
          )}
        >
          {itemValue}
        </span>
      </div>
    </div>
  );
};

// --- ✨ [สร้าง] Component ใหม่สำหรับแสดงข้อมูลทั่วไป ---
const GeneralInfoItem = ({
  itemKey,
  itemValue,
}: {
  itemKey: string;
  itemValue: string;
}) => {
  const Icon = ICON_MAP[itemKey];
  const label = LABEL_MAP[itemKey];
  const translatedValue =
    TRANSLATION_MAP[itemValue] || itemValue;

  if (!itemValue || !Icon) return null;

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-slate-500" />
      <div className="flex w-full justify-between text-sm">
        <span className="text-slate-600">{label}:</span>
        <span className="font-semibold text-slate-800">
          {translatedValue}
        </span>
      </div>
    </div>
  );
};

const AssessmentLedger = ({
  deviceInfo,
  conditionInfo,
}: {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
}) => {
  const allInfo = { ...deviceInfo, ...conditionInfo };

  // --- ✨ [แก้ไข] แยก Key ของข้อมูลทั่วไป และข้อมูลสภาพเครื่องออกจากกัน ---
  const generalInfoKeys = [
    "modelType",
    "warranty",
    "accessories",
  ];
  const conditionKeys = Object.keys(allInfo).filter(
    (key) =>
      allInfo[key as keyof typeof allInfo] &&
      ![
        "brand",
        "model",
        "storage",
        ...generalInfoKeys,
      ].includes(key),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* --- ✨ [สร้าง] กล่องแสดงข้อมูลทั่วไป (General Info Box) --- */}

      {/* --- Accordion สำหรับแสดงสภาพเครื่อง (เหมือนเดิม แต่ใช้ข้อมูลที่กรองแล้ว) --- */}
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
                รายละเอียดสภาพเครื่อง
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                คลิกเพื่อดูรายละเอียดผลการประเมินทั้งหมด
              </p>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-4 pt-0">
            <div className="rounded-2xl bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-500" />
                <h3 className="font-bold text-slate-800">
                  ข้อมูลทั่วไปของเครื่อง
                </h3>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-3">
                {generalInfoKeys.map((key) => (
                  <GeneralInfoItem
                    key={key}
                    itemKey={key}
                    itemValue={
                      allInfo[key as keyof typeof allInfo]
                    }
                  />
                ))}
              </div>
            </div>
            <div className="border-t pt-4 dark:border-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                {conditionKeys.map((key) => (
                  <TestItem
                    key={key}
                    itemKey={key}
                    itemValue={
                      allInfo[key as keyof typeof allInfo]
                    }
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
