import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Microphone } from "@phosphor-icons/react";
import clsx from "clsx";
import {
  AlertTriangle,
  BatteryCharging,
  BatteryFull,
  Camera,
  Check,
  MonitorPlay,
  Package,
  RectangleHorizontal,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Speaker,
  Wifi,
} from "lucide-react";
import { type ComponentType } from "react";

interface ConditionInfo {
  modelType: string;
  warranty: string;
  accessories: string;
  bodyCondition: string;
  screenGlass: string;
  screenDisplay: string;
  batteryHealth: string;
  camera: string;
  wifi: string;
  faceId: string;
  speaker: string;
  mic: string;
  touchScreen: string;
  charger: string;
}

type IconComponent = ComponentType<{ className?: string }>;

const CONDITION_CONFIG: {
  [K in keyof ConditionInfo]: {
    label: string;
    icon: IconComponent;
    options: {
      [val: string]: {
        label: string;
        icon?: IconComponent;
        severity: "positive" | "warning" | "negative";
      };
    };
  };
} = {
  modelType: {
    label: "รุ่นโมเดล",
    icon: Smartphone,
    options: {
      th: {
        label: "เครื่องไทย (TH)",
        severity: "positive",
      },
      other: { label: "เครื่องนอก", severity: "positive" },
    },
  },
  warranty: {
    label: "ประกันศูนย์",
    icon: ShieldCheck,
    options: {
      active_long: {
        label: "เหลือ > 4 เดือน",
        severity: "positive",
      },
      active_short: {
        label: "เหลือ < 4 เดือน",
        severity: "warning",
      },
      inactive: {
        label: "หมดประกัน",
        severity: "negative",
      },
    },
  },
  accessories: {
    label: "อุปกรณ์",
    icon: Package,
    options: {
      full: { label: "ครบกล่อง", severity: "positive" },
      box_only: {
        label: "มีเฉพาะกล่อง",
        severity: "warning",
      },
      no_box: { label: "ไม่มีกล่อง", severity: "negative" },
    },
  },
  bodyCondition: {
    label: "สภาพเครื่อง",
    icon: Smartphone,
    options: {
      mint: { label: "เหมือนใหม่", severity: "positive" },
      minor_scratch: {
        label: "รอยขนแมว",
        severity: "warning",
      },
      major_scratch: {
        label: "มีรอยตก/บุบ",
        severity: "negative",
      },
      cracked_back: {
        label: "ฝาหลังแตก",
        severity: "negative",
      },
    },
  },
  screenGlass: {
    label: "สภาพหน้าจอ",
    icon: RectangleHorizontal,
    options: {
      passed: { label: "ไม่มีรอย", severity: "positive" },
      failed: {
        label: "มีรอยขีดข่วน",
        severity: "warning",
      },
      defect: {
        label: "กระจกแตก/บิ่น",
        severity: "negative",
      },
    },
  },
  screenDisplay: {
    label: "การแสดงผล",
    icon: MonitorPlay,
    options: {
      passed: { label: "แสดงผลปกติ", severity: "positive" },
      failed: { label: "มีจุด/เส้น", severity: "warning" },
      defect: {
        label: "จอเบิร์น/สีเพี้ยน",
        severity: "negative",
      },
    },
  },
  batteryHealth: {
    label: "สุขภาพแบตเตอรี่",
    icon: BatteryFull,
    options: {
      high: { label: "มากกว่า 85%", severity: "positive" },
      low: { label: "ต่ำกว่า 85%", severity: "negative" },
    },
  },
  camera: {
    label: "กล้อง",
    icon: Camera,
    options: {
      passed: { label: "ทำงานปกติ", severity: "positive" },
      failed: { label: "มีปัญหา", severity: "negative" },
    },
  },
  wifi: {
    label: "Wi-Fi",
    icon: Wifi,
    options: {
      passed: {
        label: "เชื่อมต่อได้",
        severity: "positive",
      },
      failed: { label: "มีปัญหา", severity: "negative" },
    },
  },
  faceId: {
    label: "Face/Touch ID",
    icon: ScanFace,
    options: {
      passed: { label: "สแกนได้", severity: "positive" },
      failed: { label: "สแกนไม่ได้", severity: "negative" },
    },
  },
  speaker: {
    label: "ลำโพง",
    icon: Speaker,
    options: {
      passed: { label: "เสียงปกติ", severity: "positive" },
      failed: {
        label: "ลำโพงแตก/ไม่ดัง",
        severity: "negative",
      },
    },
  },
  mic: {
    label: "ไมโครโฟน",
    icon: Microphone,
    options: {
      passed: { label: "ใช้งานปกติ", severity: "positive" },
      failed: { label: "มีปัญหา", severity: "negative" },
    },
  },
  touchScreen: {
    label: "จอสัมผัส",
    icon: MonitorPlay,
    options: {
      passed: { label: "ใช้งานปกติ", severity: "positive" },
      failed: { label: "มีปัญหา", severity: "negative" },
    },
  },
  charger: {
    label: "การชาร์จไฟ",
    icon: BatteryCharging,
    options: {
      passed: {
        label: "ชาร์จไฟเข้าปกติ",
        severity: "positive",
      },
      failed: {
        label: "ชาร์จไม่เข้า/มีปัญหา",
        severity: "negative",
      },
    },
  },
};

const ALL_CONDITION_KEYS = Object.keys(
  CONDITION_CONFIG,
) as Array<keyof ConditionInfo>;

const ConditionGridItem = ({
  conditionKey,
  value,
}: {
  conditionKey: keyof ConditionInfo;
  value: string;
}) => {
  const config = CONDITION_CONFIG[conditionKey];
  if (!config) return null;
  const option = config.options[value];
  if (!option) return null;

  const MainIcon = config.icon;
  const isPositive = option.severity === "positive";

  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-2xl border p-2 transition-all duration-300 lg:gap-3 lg:p-3",
        isPositive
          ? "border-slate-200/80 bg-gradient-to-br from-white to-slate-50"
          : "border-orange-200/80 bg-gradient-to-br from-white to-orange-50",
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm md:h-11 md:w-11">
          <MainIcon
            className={clsx(
              "h-5 w-5 md:h-6 md:w-6",
              isPositive
                ? "text-slate-600"
                : "text-orange-500",
            )}
          />
        </div>
        <div
          className={clsx(
            "absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white md:h-5 md:w-5",
            isPositive ? "bg-green-500" : "bg-orange-500",
          )}
        >
          {isPositive ? (
            <Check
              className="h-2.5 w-2.5 text-white md:h-3 md:w-3"
              strokeWidth={3}
            />
          ) : (
            <AlertTriangle
              className="h-2.5 w-2.5 fill-white text-orange-500 md:h-3 md:w-3"
              strokeWidth={0}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className={clsx(
            "text-sm font-semibold lg:text-base",
            isPositive
              ? "text-slate-700"
              : "text-orange-800",
          )}
        >
          {config.label}
        </span>
        <span
          className={clsx(
            "text-xs",
            isPositive
              ? "text-slate-500"
              : "text-orange-600",
          )}
        >
          {option.label}
        </span>
      </div>
    </div>
  );
};

export default function ConditionGrid({
  conditionInfo,
}: {
  conditionInfo: ConditionInfo;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="rounded-lg hover:bg-slate-50 hover:no-underline lg:px-4">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-slate-800">
              รายละเอียดการตรวจสอบ
            </span>
            <span className="text-sm text-slate-500">
              คลิกเพื่อดูรายละเอียดผลการประเมินทั้งหมด
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {ALL_CONDITION_KEYS.map((key) => (
              <ConditionGridItem
                key={key}
                conditionKey={key}
                value={conditionInfo[key]}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
