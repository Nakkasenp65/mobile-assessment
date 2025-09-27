"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ComponentType,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  Calendar,
  ClipboardList,
  Package,
  Wrench,
  HardDrive,
  Cpu,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Smartphone,
  RectangleHorizontal,
  MonitorPlay,
  BatteryFull,
  Camera,
  Wifi,
  ScanFace,
  Speaker,
  Clock,
  AlertTriangle,
  Home,
  MapPin,
  Store,
  User,
  Timer,
  Check,
  HelpCircle,
} from "lucide-react";
import { Microphone } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Layout from "../../../components/Layout/Layout";
import Image from "next/image";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// --- Interfaces (คงเดิม) ---
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
}

interface PawnServiceInfo {
  customerName: string;
  locationType: "home" | "bts" | "store";
  homeAddress?: string;
  province?: string;
  district?: string;
  btsLine?: string;
  btsStation?: string;
  storeBranch?: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
}

interface AssessmentRecord {
  phoneNumber: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl: string;
  };
  conditionInfo: ConditionInfo;
  pawnServiceInfo: PawnServiceInfo;
  selectedService: {
    name: string;
    price: number;
    appointmentDate: string;
  };
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  priceLockExpiresAt: string;
  nextSteps: string[];
}

// --- Mock Data (คงเดิม) ---
const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecords: AssessmentRecord[] = [
  {
    phoneNumber: "0812345678",
    assessmentDate: "25 กันยายน 2568",
    device: {
      brand: "Apple",
      model: "iPhone 15 Pro",
      storage: "256GB",
      imageUrl:
        "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
    },
    conditionInfo: {
      modelType: "th",
      warranty: "active_long",
      accessories: "full",
      bodyCondition: "mint",
      screenGlass: "passed",
      screenDisplay: "passed",
      batteryHealth: "high",
      camera: "passed",
      wifi: "passed",
      faceId: "passed",
      speaker: "passed",
      mic: "passed",
      touchScreen: "passed",
    },
    pawnServiceInfo: {
      customerName: "นางสาวสายฟ้า สมสุข",
      locationType: "bts",
      btsLine: "BTS - สายสุขุมวิท",
      btsStation: "สยาม",
      appointmentDate: "27 กันยายน 2568",
      appointmentTime: "13:00 - 17:00",
      phone: "0812345678",
    },
    selectedService: {
      name: "บริการจำนำ (Pawn Service)",
      price: 22600,
      appointmentDate: "27 กันยายน 2568, 13:00 - 17:00 น.",
    },
    status: "completed",
    estimatedValue: 28500,
    priceLockExpiresAt: getExpiryDate(3),
    nextSteps: [
      "เตรียมบัตรประชาชนและอุปกรณ์ให้พร้อม",
      "ไปพบทีมงานตามวัน-เวลานัด และสถานีที่เลือก",
      "ชำระเงินและรับเอกสารการทำรายการ",
    ],
  },
  {
    phoneNumber: "0987654321",
    assessmentDate: "24 กันยายน 2568",
    device: {
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      storage: "512GB",
      imageUrl:
        "https://images.samsung.com/is/image/samsung/p6pim/th/2302/gallery/th-galaxy-s23-ultra-s918-sm-s918bzghsth-534884024?$650_519_PNG$",
    },
    conditionInfo: {
      modelType: "th",
      warranty: "inactive",
      accessories: "box_only",
      bodyCondition: "minor_scratch",
      screenGlass: "passed",
      screenDisplay: "passed",
      batteryHealth: "low",
      camera: "failed",
      wifi: "failed",
      faceId: "passed",
      speaker: "passed",
      mic: "passed",
      touchScreen: "passed",
    },
    pawnServiceInfo: {
      customerName: "นายสมชาย ใจดี",
      locationType: "store",
      storeBranch: "สาขาเซ็นทรัลลาดพร้าว",
      appointmentDate: "26 กันยายน 2568",
      appointmentTime: "11:00 - 14:00",
      phone: "0987654321",
    },
    selectedService: {
      name: "บริการจำนำ (Pawn Service)",
      price: 15200,
      appointmentDate: "26 กันยายน 2568, 11:00 - 14:00 น.",
    },
    status: "completed",
    estimatedValue: 19800,
    priceLockExpiresAt: getExpiryDate(1),
    nextSteps: [
      "นำอุปกรณ์และกล่องพร้อมบัตรประชาชนมาที่สาขา",
      "เจ้าหน้าที่จะตรวจสอบอุปกรณ์อีกครั้ง",
      "รับเงินสดและสัญญาการจำนำ",
    ],
  },
  {
    phoneNumber: "0611223344",
    assessmentDate: "20 กันยายน 2568",
    device: {
      brand: "Apple",
      model: "iPhone 13",
      storage: "128GB",
      imageUrl:
        "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-product-red?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1656712888956",
    },
    conditionInfo: {
      modelType: "other",
      warranty: "inactive",
      accessories: "no_box",
      bodyCondition: "major_scratch",
      screenGlass: "defect",
      screenDisplay: "defect",
      batteryHealth: "low",
      camera: "failed",
      wifi: "passed",
      faceId: "failed",
      speaker: "failed",
      mic: "failed",
      touchScreen: "failed",
    },
    pawnServiceInfo: {
      customerName: "คุณส้มใส น่ารัก",
      locationType: "home",
      homeAddress: "123/45 ถ.สุขุมวิท",
      province: "กรุงเทพมหานคร",
      district: "วัฒนา",
      appointmentDate: "22 กันยายน 2568",
      appointmentTime: "15:00 - 18:00",
      phone: "0611223344",
    },
    selectedService: {
      name: "บริการจำนำ (Pawn Service)",
      price: 4500,
      appointmentDate: "22 กันยายน 2568, 15:00 - 18:00 น.",
    },
    status: "in-progress",
    estimatedValue: 6000,
    priceLockExpiresAt: new Date(
      "2023-10-20T23:59:59",
    ).toISOString(),
    nextSteps: [
      "ทีมงานกำลังตรวจสอบข้อมูลเพิ่มเติม",
      "จะมีการติดต่อกลับเพื่อยืนยันการประเมินอีกครั้ง",
    ],
  },
];

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
};

const ALL_CONDITION_KEYS = Object.keys(
  CONDITION_CONFIG,
) as Array<keyof ConditionInfo>;

const PriceLockCountdown = ({
  expiryDate,
}: {
  expiryDate: string;
}) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24),
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24,
        ),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [expiryDate]);

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(),
  );
  const [isExpired, setIsExpired] = useState(
    Object.keys(calculateTimeLeft()).length === 0,
  );

  useEffect(() => {
    if (isExpired) return;

    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (Object.keys(newTimeLeft).length === 0) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (isExpired) {
    return (
      <div className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span className="font-semibold">
          ราคานี้หมดอายุแล้ว กรุณาประเมินใหม่อีกครั้ง
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 text-amber-700">
        <Timer className="h-5 w-5" />
        <span className="font-semibold">
          ราคานี้มีผลอีก:
        </span>
      </div>
      <div className="mt-2 flex justify-center gap-2 font-sans sm:gap-3 md:gap-4">
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.days || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            วัน
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.hours || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            ชั่วโมง
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.minutes || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            นาที
          </span>
        </div>
        <div className="flex min-w-[50px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm sm:p-2">
          <span className="text-xl font-bold text-amber-800 sm:text-2xl md:text-3xl">
            {String(timeLeft.seconds || 0).padStart(2, "0")}
          </span>
          <span className="text-[10px] text-amber-700 sm:text-xs">
            วินาที
          </span>
        </div>
      </div>
    </>
  );
};

const SectionDivider = ({
  color = "from-slate-300 to-slate-200",
}) => (
  <div
    className={`my-4 h-[2px] w-full bg-gradient-to-r ${color}`}
  />
);

const SectionHeader = ({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: IconComponent;
  label: string;
  colorClass: string;
}) => (
  <div className="mb-3 flex items-center gap-3">
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br ${colorClass} h-9 w-9`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span className="text-base font-bold text-slate-800 md:text-lg">
      {label}
    </span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      label: "ประเมินเสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-[#f0fdf4] text-[#16a34a]",
    },
    pending: {
      label: "รอการประเมิน",
      icon: Clock,
      color: "bg-[#fefce8] text-[#ca8a04]",
    },
    "in-progress": {
      label: "กำลังประเมิน",
      icon: Wrench,
      color: "bg-[#eff6ff] text-[#2563eb]",
    },
  };
  const config =
    statusConfig[status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
    >
      <Icon className="mr-1 h-4 w-4" />
      {config.label}
    </span>
  );
};

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

const ConditionGrid = ({
  conditionInfo,
}: {
  conditionInfo: ConditionInfo;
}) => {
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
};

const PawnServiceDetails = ({
  pawnServiceInfo,
  selectedService,
}: {
  pawnServiceInfo: PawnServiceInfo;
  selectedService: AssessmentRecord["selectedService"];
}) => {
  return (
    <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
      <SectionHeader
        icon={ClipboardList}
        label="ข้อมูลบริการและการนัดหมาย"
        colorClass="from-amber-500 to-orange-500"
      />
      <div className="mb-4 flex flex-col justify-between gap-2 rounded-xl border border-orange-200 bg-white p-4 shadow-sm md:items-center md:gap-4 lg:flex-row">
        <div>
          <span className="text-base font-bold text-[#f97316] md:text-lg">
            {selectedService.name}
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-[#78716c] md:mt-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium md:text-sm">
              {selectedService.appointmentDate}
            </span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-slate-600 md:text-sm">
            ยอดเงินที่จะได้รับ
          </span>
          <span className="block text-xl font-bold text-[#f97316] md:text-2xl">
            {selectedService.price.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs lg:text-sm">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-violet-500" />
          <span className="font-semibold">ชื่อผู้ใช้:</span>
          <span>{pawnServiceInfo.customerName}</span>
        </div>
        <div className="flex items-start gap-3">
          {pawnServiceInfo.locationType === "home" ? (
            <Home className="h-5 w-5 flex-shrink-0 text-sky-500" />
          ) : pawnServiceInfo.locationType === "bts" ? (
            <MapPin className="h-5 w-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <Store className="h-5 w-5 flex-shrink-0 text-yellow-700" />
          )}
          <div className="flex items-start text-left">
            <span className="font-semibold">
              สถานที่นัดหมาย:
            </span>
            <span>
              {pawnServiceInfo.locationType === "home" &&
                `รับถึงบ้าน (${
                  pawnServiceInfo.homeAddress || ""
                })`}
              {pawnServiceInfo.locationType === "bts" &&
                `${pawnServiceInfo.btsLine} - สถานี ${pawnServiceInfo.btsStation}`}
              {pawnServiceInfo.locationType === "store" &&
                `${pawnServiceInfo.storeBranch}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">โทร:</span>
          <span>{pawnServiceInfo.phone}</span>
        </div>
      </div>
    </div>
  );
};

const SupportSection = () => {
  return (
    <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
      <SectionHeader
        icon={HelpCircle}
        label="ต้องการความช่วยเหลือ?"
        colorClass="from-sky-500 to-blue-500"
      />
      <div className="mt-4 flex flex-col gap-3">
        <Button className="w-full">
          ติดต่อเจ้าหน้าที่
        </Button>
        <Button variant="outline" className="w-full">
          คำถามที่พบบ่อย (FAQ)
        </Button>
        <Button variant="outline" className="w-full">
          ยกเลิก/แก้ไขนัดหมาย
        </Button>
        <Button
          variant="link"
          className="w-full text-slate-500"
        >
          ดูข้อกำหนดและเงื่อนไข
        </Button>
      </div>
    </div>
  );
};

const AssessmentDetails = ({
  record,
}: {
  record: AssessmentRecord;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mt-12 w-full max-w-6xl"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#110e0c]">
          ผลการประเมินอุปกรณ์
        </h2>
        <p className="mt-2 text-[#78716c]">
          อัพเดทล่าสุด: {record.assessmentDate}
        </p>
        <div className="mt-4">
          <StatusBadge status={record.status} />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-2xl lg:p-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:flex-1">
            <div className="flex flex-col items-center gap-6 text-left lg:flex-row lg:items-start">
              <div className="w-full max-w-[180px] flex-shrink-0">
                <div className="relative mx-auto">
                  <Image
                    src={record.device.imageUrl}
                    alt={`${record.device.brand} ${record.device.model}`}
                    width={320}
                    height={320}
                    className="h-auto w-full rounded-2xl object-contain"
                  />
                </div>
              </div>
              <div className="flex w-full flex-1 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#78716c]" />
                  <span className="font-medium text-[#78716c]">
                    รุ่น
                  </span>
                  <span className="ml-auto font-semibold text-[#110e0c]">
                    {record.device.brand}{" "}
                    {record.device.model}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-[#78716c]" />
                  <span className="font-medium text-[#78716c]">
                    ความจุ
                  </span>
                  <span className="ml-auto font-semibold text-[#110e0c]">
                    {record.device.storage}
                  </span>
                </div>
                <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      มูลค่าประเมิน
                    </span>
                    <span className="text-2xl font-bold text-[#f97316]">
                      {record.estimatedValue.toLocaleString(
                        "th-TH",
                        {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        },
                      )}
                    </span>
                  </div>
                  <PriceLockCountdown
                    expiryDate={record.priceLockExpiresAt}
                  />
                </div>
              </div>
            </div>

            <SectionDivider color="from-orange-200 to-pink-200" />

            <ConditionGrid
              conditionInfo={record.conditionInfo}
            />
          </div>

          <div className="flex w-full flex-col gap-6 md:flex-1">
            <PawnServiceDetails
              pawnServiceInfo={record.pawnServiceInfo}
              selectedService={record.selectedService}
            />

            <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
              <SectionHeader
                icon={CheckCircle}
                label="ขั้นตอนต่อไป"
                colorClass="from-amber-400 to-orange-500"
              />
              <div className="mb-4 flex flex-col gap-3">
                {record.nextSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#eff6ff]">
                      <span className="text-sm font-bold text-[#2563eb]">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-left text-[#110e0c]">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-[#dbeafe] bg-[#eff6ff] p-4">
                <p className="flex items-start gap-2 text-left text-sm text-[#1e40af]">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <span>
                    <span className="font-medium">
                      หมายเหตุ:
                    </span>{" "}
                    กรุณานำบัตรประชาชนและอุปกรณ์ทั้งหมดมาด้วยในวันนัดหมาย
                  </span>
                </p>
              </div>
            </div>

            <SupportSection />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AssessmentRecordPage() {
  // --- ✨ FIX: ลบ state ที่เกี่ยวกับการค้นหาทั้งหมด ---
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [foundRecord, setFoundRecord] =
  //   useState<AssessmentRecord | null>(null);
  // const [error, setError] = useState<string | null>(null);

  // --- ✨ FIX: ใช้ข้อมูล mock record แรกโดยตรง ---
  const recordToShow = mockRecords[0];

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-gradient-to-br from-[#fff8f0] via-white to-[#ffeaf5] px-4 py-16 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#fed7aa] opacity-20 blur-3xl" />
          <div className="absolute top-1/4 right-0 h-80 w-80 rounded-full bg-[#fbcfe8] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#ddd6fe] opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
          {/* --- ✨ FIX: ลบส่วน header และ form ของการค้นหา --- */}
          {recordToShow && (
            <AssessmentDetails record={recordToShow} />
          )}
        </div>
      </main>
    </Layout>
  );
}
