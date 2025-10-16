// src/app/assess/components/(step3)/AssessmentLedger.tsx
"use client";

import { useMemo } from "react";
import { RepairItem } from "@/hooks/useRepairPrices";
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
  AlertTriangleIcon,
  CheckCircle,
  ShieldCheck,
  Archive,
  Frame,
  ScanFace,
  Info,
  PhoneCall,
  CircleDot,
  RadioTower,
  LucideIcon,
  Wrench,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import MaintenanceService from "./(services)/MaintenanceService";
import { ASSESSMENT_QUESTIONS } from "@/util/info";
import { ConditionInfo, DeviceInfo } from "../../../../types/device";

const ICON_MAP: Record<string, LucideIcon> = {
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
  call: PhoneCall,
  homeButton: CircleDot,
  sensor: RadioTower,
  buttons: Power,
  openedOrRepaired: Wrench,
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
  call: "การโทร",
  homeButton: "ปุ่ม Home",
  sensor: "Sensor",
  buttons: "ปุ่ม Power / Volume",
  openedOrRepaired: "เคยแกะหรือซ่อมมา",
};

const isConsideredPassed = (key: string, value: string): boolean => {
  const positiveValues = [
    "model_th",
    "model_inter_new",
    "model_inter_old",
    "warranty_active_long",
    "warranty_active_short",
    "acc_full",
    "acc_box_only",
    "body_mint",
    "glass_ok",
    "display_ok",
    "battery_health_high",
    "battery_health_medium",
    "camera_ok",
    "wifi_ok",
    "biometric_ok",
    "mic_ok",
    "speaker_ok",
    "touchscreen_ok",
    "charger_ok",
    "call_ok",
    "home_button_ok",
    "sensor_ok",
    "buttons_ok",
    "passed",
  ];
  if (positiveValues.includes(value)) return true;
  if (key === "touchScreen" && parseInt(value) >= 95) return true;
  return false;
};

// --- Sub-components ---
const TestItem = ({ itemKey, itemValue, label }: { itemKey: string; itemValue: string; label: string }) => {
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
          <Icon className={cn("h-5 w-5 md:h-6 md:w-6", isPassed ? "text-slate-600" : "text-orange-500")} />
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
        <span className={cn("text-sm font-semibold sm:w-max", isPassed ? "text-slate-700" : "text-orange-800")}>
          {LABEL_MAP[itemKey] || itemKey}
        </span>
        <span className={cn("text-xs", isPassed ? "text-slate-500" : "text-orange-600")}>{label}</span>
      </div>
    </div>
  );
};

const GeneralInfoItem = ({ itemKey, label }: { itemKey: string; label: string }) => {
  const Icon = ICON_MAP[itemKey];
  const categoryLabel = LABEL_MAP[itemKey];

  if (!label || !Icon) return null;

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-slate-500" />
      <div className="flex w-full justify-between text-sm">
        <span className="text-slate-600">{categoryLabel}:</span>
        <span className="font-semibold text-slate-800">{label}</span>
      </div>
    </div>
  );
};

// --- Main Component Interface ---
interface AssessmentLedgerProps {
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
  isIcloudLocked?: boolean;
}

// --- Main Component: AssessmentLedger ---
const AssessmentLedger: React.FC<AssessmentLedgerProps> = ({
  deviceInfo,
  conditionInfo,
  repairs,
  totalCost,
  isLoading,
  isIcloudLocked,
}) => {
  const optionsLabelMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    ASSESSMENT_QUESTIONS.forEach((section) => {
      section.questions.forEach((question) => {
        map[String(question.id)] = {};
        question.options.forEach((option) => {
          map[String(question.id)][String(option.id)] = option.label;
        });
      });
    });
    // Add custom option labels for fields not in ASSESSMENT_QUESTIONS
    map["openedOrRepaired"] = {
      repaired_yes: "เคยซ่อม/แกะ",
      repaired_no: "ไม่เคยซ่อม/แกะ",
    };
    return map;
  }, []);

  const allInfo = { ...deviceInfo, ...conditionInfo };

  const generalInfoKeys = ["modelType", "warranty", "accessories", "openedOrRepaired"];
  const conditionKeys = Object.keys(allInfo).filter(
    (key) => allInfo[key as keyof typeof allInfo] && !["brand", "model", "storage", ...generalInfoKeys].includes(key),
  );

  return (
    <Accordion type="single" collapsible className="w-full overflow-hidden rounded-2xl" defaultValue="details">
      <AccordionItem value="details">
        <AccordionTrigger className="flex w-full items-center p-4 text-left hover:no-underline">
          <div className="flex w-full flex-col items-start">
            <h2 className="flex items-center gap-1 text-lg font-bold text-slate-800 md:text-2xl dark:text-zinc-100">
              รายละเอียดสภาพเครื่อง
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">คลิกเพื่อดูรายละเอียดผลการประเมินทั้งหมด</p>
          </div>
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-6 p-4">
          <div className="bg-white">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-800">ข้อมูลทั่วไปของเครื่อง</h3>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-3">
              {generalInfoKeys.map((key) => {
                const value = allInfo[key as keyof typeof allInfo];
                const label = optionsLabelMap[key]?.[String(value)] || value;
                return <GeneralInfoItem key={key} itemKey={key} label={String(label)} />;
              })}
            </div>
          </div>
          <div className={`flex flex-col gap-4 border-t pt-4 lg:border-b lg:pb-4`}>
            <div className="grid grid-cols-2 gap-3">
              {conditionKeys.map((key) => {
                const value = allInfo[key as keyof typeof allInfo];
                const label = optionsLabelMap[key]?.[String(value)] || value;
                return <TestItem key={key} itemKey={key} itemValue={String(value)} label={String(label)} />;
              })}
            </div>
          </div>

          {repairs && repairs.length > 0 && (
            <div className={cn(!isIcloudLocked && "hidden lg:block")}>
              <MaintenanceService
                deviceInfo={deviceInfo}
                repairs={repairs}
                totalCost={totalCost}
                isLoading={isLoading}
              />{" "}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AssessmentLedger;
