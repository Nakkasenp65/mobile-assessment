"use client";

import React, {
  useState,
  useMemo,
  type ComponentType,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion } from "framer-motion";

// ... (imports ทั้งหมดเหมือนเดิม)
import {
  Banknote,
  CreditCard,
  Handshake,
  Hash,
  ShoppingBag,
  TabletSmartphone,
  LucideIcon,
  Check,
  Smartphone,
  ShieldCheck,
  Archive,
  Frame,
  MonitorPlay,
  BatteryFull,
  Camera,
  Wifi,
  ScanFace,
  Speaker,
  PhoneCall,
  CircleDot,
  RadioTower,
  Power,
  Info,
  Wrench,
  Loader2,
  BatteryCharging,
  AlertTriangleIcon,
  CheckCircle,
  Menu,
  Clock,
  Timer,
} from "lucide-react";
import { Microphone } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ASSESSMENT_QUESTIONS } from "@/util/info";
import Link from "next/link";

// --- SELF-CONTAINED COMPONENTS & TYPES ---
// [Chiron]: ไม่เปลี่ยนแปลงส่วนนี้
// ... (Interfaces, Types, และ UI Components ย่อยทั้งหมดเหมือนเดิม)
interface RepairItem {
  part: string;
  condition: string;
  cost: number;
  icon: LucideIcon;
}

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
  call: string;
  homeButton: string;
  sensor: string;
  buttons: string;
}

interface AssessmentRecord {
  id: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl: string;
  };
  conditionInfo: ConditionInfo;
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  priceLockExpiresAt: string;
}

interface ServiceOption {
  id: string;
  title: string;
  icon: LucideIcon;
  price: number;
  benefits: string[];
  color: string;
  bgColor: string;
  ringColor: string;
}

// 2. UI Components (Self-contained)
// ============================================================================

const FramerButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof motion.button> & {
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
  }
>(({ className, variant = "solid", size = "md", ...props }, ref) => (
  <motion.button
    ref={ref}
    whileTap={{ scale: 0.97 }}
    className={cn(
      "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      {
        "h-9 px-3 text-sm": size === "sm",
        "h-10 px-4 text-sm": size === "md",
        "h-11 px-5 text-base": size === "lg",
        "h-12 px-6 text-base": size === "xl",
      },
      {
        "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-lg":
          variant === "solid",
        "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50": variant === "outline",
        "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
      },
      className,
    )}
    {...props}
  />
));
FramerButton.displayName = "FramerButton";

const StatusBadge = ({ status }: { status: AssessmentRecord["status"] }) => {
  const statusConfig = {
    completed: {
      label: "ประเมินเสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
      label: "รอการประเมิน",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "in-progress": {
      label: "กำลังดำเนินการ",
      icon: Wrench,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.color,
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

const PriceLockCountdown = ({ expiryDate }: { expiryDate: string }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft: { [key: string]: number } = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }, [expiryDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const isExpired = Object.keys(timeLeft).length === 0;

  useEffect(() => {
    if (isExpired) return;
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isExpired, calculateTimeLeft]);

  if (isExpired) {
    return (
      <div className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-semibold text-red-600">
        <AlertTriangleIcon className="h-5 w-5" />
        <span>ราคานี้หมดอายุแล้ว</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-center gap-1 text-xs text-amber-700">
        <Timer className="h-4 w-4" />
        <span className="font-semibold">ราคานี้มีผลอีก:</span>
      </div>
      <div className="mt-2 flex justify-center gap-2 font-sans">
        {["days", "hours", "minutes", "seconds"].map((interval) => (
          <div
            key={interval}
            className="flex min-w-[45px] flex-col items-center rounded-md bg-white/60 p-1 shadow-sm"
          >
            <span className="text-xl font-bold text-amber-800">
              {String(timeLeft[interval] || 0).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-amber-700 capitalize">
              {interval === "days"
                ? "วัน"
                : interval === "hours"
                  ? "ชั่วโมง"
                  : interval === "minutes"
                    ? "นาที"
                    : "วินาที"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-30 w-full bg-white/95 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-foreground text-lg font-bold">OK Mobile</span>
              </div>
            </Link>
            <div className="md:hidden">
              <button
                onClick={() => {}}
                className="text-foreground rounded-xl p-2"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};

// --- START: Assessment Detail Components ---
// [Chiron]: ส่วนนี้ไม่เปลี่ยนแปลง
const ICON_MAP: Record<string, ComponentType<any>> = {
  modelType: Smartphone,
  warranty: ShieldCheck,
  accessories: Archive,
  bodyCondition: Smartphone,
  screenGlass: Frame,
  screenDisplay: MonitorPlay,
  batteryHealth: BatteryFull,
  camera: Camera,
  wifi: Wifi,
  faceId: ScanFace,
  speaker: Speaker,
  mic: Microphone,
  touchScreen: Handshake,
  charger: BatteryCharging,
  call: PhoneCall,
  homeButton: CircleDot,
  sensor: RadioTower,
  buttons: Power,
};

const LABEL_MAP: Record<string, string> = {
  modelType: "รุ่นโมเดล",
  warranty: "ประกันศูนย์",
  accessories: "อุปกรณ์",
  bodyCondition: "สภาพตัวเครื่อง",
  screenGlass: "สภาพกระจกหน้าจอ",
  screenDisplay: "คุณภาพการแสดงผล",
  batteryHealth: "สุขภาพแบตเตอรี่",
  camera: "กล้อง",
  wifi: "Wi-Fi",
  faceId: "Face ID / Touch ID",
  speaker: "ลำโพง",
  mic: "ไมโครโฟน",
  touchScreen: "ระบบสัมผัส",
  charger: "การชาร์จ",
  call: "การโทร",
  homeButton: "ปุ่ม Home",
  sensor: "Sensor",
  buttons: "ปุ่ม Power / Volume",
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
    "speaker_ok",
    "mic_ok",
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

const TestItem = ({
  itemKey,
  itemValue,
  label,
}: {
  itemKey: string;
  itemValue: string;
  label: string;
}) => {
  const Icon = ICON_MAP[itemKey];
  const isPassed = isConsideredPassed(itemKey, itemValue);
  if (!itemValue || !Icon) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border p-2",
        isPassed ? "border-slate-200/80 bg-slate-50" : "border-orange-200/80 bg-orange-50",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          isPassed ? "bg-green-100/70" : "bg-orange-100",
        )}
      >
        <Icon className={cn("h-5 w-5", isPassed ? "text-green-600" : "text-orange-500")} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700">
          {LABEL_MAP[itemKey] || itemKey}
        </span>
        <span className={cn("text-xs", isPassed ? "text-slate-500" : "text-orange-600")}>
          {label}
        </span>
      </div>
    </div>
  );
};

const GeneralInfoItem = ({ itemKey, label }: { itemKey: string; label: string }) => {
  const Icon = ICON_MAP[itemKey];
  const categoryLabel = LABEL_MAP[itemKey];
  if (!label || !Icon) return null;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0 text-slate-500" />
        <span className="text-sm text-slate-600">{categoryLabel}:</span>
      </div>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
    </div>
  );
};

// --- START: MaintenanceService Component ---
// [Chiron]: ส่วนนี้ไม่เปลี่ยนแปลง
const MaintenanceService = ({
  repairs,
  isLoading,
}: {
  repairs: RepairItem[];
  isLoading: boolean;
}) => {
  const [selectedRepairs, setSelectedRepairs] = useState<RepairItem[]>([]);
  const handleSelectionChange = (repair: RepairItem, isSelected: boolean) => {
    setSelectedRepairs((prev) =>
      isSelected ? [...prev, repair] : prev.filter((r) => r.part !== repair.part),
    );
  };
  const selectedTotalCost = useMemo(
    () => selectedRepairs.reduce((acc, curr) => acc + curr.cost, 0),
    [selectedRepairs],
  );
  const estimatedTime = useMemo(() => {
    if (selectedRepairs.length === 0) return "-";
    return selectedRepairs.length > 1 ? "3-5 วันทำการ" : "2-3 วันทำการ";
  }, [selectedRepairs]);

  return (
    <div className="flex w-full flex-1 flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">เลือกรายการเพื่อซ่อม</h2>
      <p className="text-sm text-slate-600">
        คุณสามารถเลือกอาการที่ต้องการซ่อม เพื่อประเมินค่าใช้จ่ายเบื้องต้น
      </p>
      <div className="flex flex-col gap-2 rounded-xl border bg-white p-3">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : repairs.length > 0 ? (
          repairs.map((repair, index) => (
            <Label
              key={index}
              htmlFor={`repair-${index}`}
              className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`repair-${index}`}
                  checked={selectedRepairs.some((r) => r.part === repair.part)}
                  onCheckedChange={(checked) => handleSelectionChange(repair, !!checked)}
                />
                <div className="flex items-center gap-2">
                  <repair.icon className="h-5 w-5 text-slate-500" />
                  <span className="text-slate-800">{repair.part}</span>
                </div>
              </div>
              <span className="font-semibold text-slate-800">฿{repair.cost.toLocaleString()}</span>
            </Label>
          ))
        ) : (
          <div className="py-4 text-center text-sm text-slate-600">ไม่พบรายการที่ต้องซ่อม</div>
        )}
      </div>
      <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">ค่าบริการซ่อมที่เลือก</h3>
        <p className="text-4xl font-bold text-slate-700">
          ฿{selectedTotalCost.toLocaleString("th-TH")}
        </p>
        <p className="mt-2 text-sm text-slate-500">ระยะเวลาซ่อม: {estimatedTime}</p>
      </div>
      <FramerButton size="lg" className="h-14 w-full" disabled={selectedRepairs.length === 0}>
        <Wrench className="mr-2 h-4 w-4" />
        ติดต่องานซ่อม
      </FramerButton>
    </div>
  );
};

// --- Mock Data ---
// [Chiron]: ไม่เปลี่ยนแปลง
const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

const mockRecord: AssessmentRecord = {
  id: "ASS-2568-0001",
  assessmentDate: new Date().toISOString(),
  device: {
    brand: "Apple",
    model: "iPhone 15 Pro",
    storage: "256GB",
    imageUrl: "https://lh3.googleusercontent.com/d/14EB_azrtiSrLtPVlIxWiU5Vg1hS8aw1A",
  },
  conditionInfo: {
    modelType: "model_th",
    warranty: "warranty_active_long",
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
    touchScreen: "98%",
    charger: "charger_failed",
    call: "call_failed",
    homeButton: "home_button_ok",
    sensor: "sensor_ok",
    buttons: "buttons_ok",
  },
  status: "completed",
  estimatedValue: 28500,
  priceLockExpiresAt: getExpiryDate(3),
};

const mockRepairs: RepairItem[] = [
  { part: "การชาร์จ", condition: "charger_failed", cost: 1200, icon: BatteryCharging },
  { part: "การโทร", condition: "call_failed", cost: 800, icon: PhoneCall },
];

// --- ส่วนหลักของหน้า (MAIN PAGE COMPONENT) ---
export default function AssessmentRecordPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services: ServiceOption[] = useMemo(
    () => [
      {
        id: "sell",
        title: "ขายทันที",
        icon: Banknote,
        price: mockRecord.estimatedValue,
        benefits: ["รับเงินสดทันที", "ไม่มีค่าธรรมเนียม", "ล้างข้อมูลฟรี"],
        color: "text-pink-600",
        bgColor: "bg-pink-50 hover:bg-pink-100",
        ringColor: "ring-pink-500",
      },
      {
        id: "tradein",
        title: "เทิร์นเครื่อง",
        icon: TabletSmartphone,
        price: mockRecord.estimatedValue,
        benefits: ["ลดราคาเครื่องใหม่ทันที", "รับประกัน 1 ปีเต็ม", "ย้ายข้อมูลให้ฟรี"],
        color: "text-amber-600",
        bgColor: "bg-amber-50 hover:bg-amber-100",
        ringColor: "ring-amber-500",
      },
      {
        id: "refinance",
        title: "บริการรีไฟแนนซ์",
        icon: CreditCard,
        price: Math.round(mockRecord.estimatedValue * 0.5),
        benefits: ["รับเงินก้อน", "ผ่อนชำระคืน 6 เดือน", "อนุมัติไว"],
        color: "text-purple-600",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        ringColor: "ring-purple-500",
      },
      {
        id: "refinance",
        title: "บริการรีไฟแนนซ์",
        icon: CreditCard,
        price: Math.round(mockRecord.estimatedValue * 0.5),
        benefits: ["รับเงินก้อน", "ผ่อนชำระคืน 6 เดือน", "อนุมัติไว"],
        color: "text-purple-600",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        ringColor: "ring-purple-500",
      },
      {
        id: "refinance",
        title: "บริการรีไฟแนนซ์",
        icon: CreditCard,
        price: Math.round(mockRecord.estimatedValue * 0.5),
        benefits: ["รับเงินก้อน", "ผ่อนชำระคืน 6 เดือน", "อนุมัติไว"],
        color: "text-purple-600",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        ringColor: "ring-purple-500",
      },
      {
        id: "refinance",
        title: "บริการรีไฟแนนซ์",
        icon: CreditCard,
        price: Math.round(mockRecord.estimatedValue * 0.5),
        benefits: ["รับเงินก้อน", "ผ่อนชำระคืน 6 เดือน", "อนุมัติไว"],
        color: "text-purple-600",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        ringColor: "ring-purple-500",
      },
    ],
    [],
  );

  const optionsLabelMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    ASSESSMENT_QUESTIONS.forEach((s) =>
      s.questions.forEach((q) => {
        map[q.id] = {};
        q.options.forEach((opt) => (map[q.id][opt.id] = opt.label));
      }),
    );
    return map;
  }, []);

  const allInfo = { ...mockRecord.device, ...mockRecord.conditionInfo };
  const generalInfoKeys = ["modelType", "warranty", "accessories"];
  const conditionKeys = Object.keys(allInfo).filter(
    (key) =>
      allInfo[key as keyof typeof allInfo] &&
      !["brand", "model", "storage", ...generalInfoKeys].includes(key),
  );

  return (
    <Layout>
      <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center overflow-x-hidden bg-slate-50 px-4 py-8 sm:py-16">
        {/*
          [Chiron] เสริมความแข็งแกร่งโครงสร้างหลัก:
          - เพิ่ม `padding-bottom` เป็น `pb-96` (24rem) เพื่อรองรับแผงควบคุมที่สูงขึ้นอย่างสมบูรณ์
        */}
        <div className="z-10 container flex w-full flex-col items-center pb-96">
          {/* --- ส่วนหัวของหน้า (Page Header) --- */}
          <div className="mb-8 flex w-full flex-col items-center justify-center gap-2">
            <h2 className="mb-2 text-3xl font-bold text-black">ผลการประเมินอุปกรณ์</h2>
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
                <Hash className="h-4 w-4" />
                <span>รหัสการประเมิน: {mockRecord.id}</span>
              </div>
              <p className="text-[#78716c]">
                อัพเดทล่าสุด:{" "}
                {new Date(mockRecord.assessmentDate).toLocaleDateString("th-TH", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <StatusBadge status={mockRecord.status} />
            </div>
          </div>
          {/* --- จบส่วนหัวของหน้า --- */}

          {/* --- โครงสร้าง Layout หลัก (Main Layout Grid) --- */}
          <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {/* --- คอลัมน์ซ้าย: ข้อมูลสรุปและส่วนดำเนินการ (Left Column: Summary & Actions) --- */}
            <div className="flex flex-col gap-6">
              {/* --- ส่วนแสดงข้อมูลอุปกรณ์และราคาประเมิน (Device Info & Price Estimation) --- */}
              <div className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex w-full items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {mockRecord.device.brand} {mockRecord.device.model}
                    </h3>
                    <p className="text-slate-500">ความจุ: {mockRecord.device.storage}</p>
                  </div>
                  <span className="text-6xl font-black text-green-500">A</span>
                </div>
                <div className="my-2 border-t" />
                <div className="flex flex-col gap-2 rounded-xl border border-orange-200 bg-orange-50/50 p-4">
                  <p className="font-semibold text-slate-700">ราคาประเมิน</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {mockRecord.estimatedValue.toLocaleString("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                    })}
                    .-
                  </p>
                  <PriceLockCountdown expiryDate={mockRecord.priceLockExpiresAt} />
                </div>
              </div>
              {/* --- จบส่วนแสดงข้อมูลอุปกรณ์และราคาประเมิน --- */}

              {/* --- ส่วนบริการซ่อม (Maintenance Service) --- */}
              <MaintenanceService repairs={mockRepairs} isLoading={false} />
              {/* --- จบส่วนบริการซ่อม --- */}
            </div>
            {/* --- จบคอลัมน์ซ้าย --- */}

            {/* --- คอลัมน์ขวา: รายละเอียดการประเมิน (Right Column: Assessment Details) --- */}
            <div className="flex flex-col">
              {/* --- ส่วนรายละเอียดสภาพเครื่อง (Accordion) --- */}
              <Accordion type="single" collapsible defaultValue="details" className="w-full">
                <AccordionItem value="details" className="rounded-xl border bg-white shadow-sm">
                  <AccordionTrigger className="w-full p-4 text-left font-semibold text-slate-800 hover:no-underline">
                    รายละเอียดสภาพเครื่องและผลการตรวจสอบ
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4 border-t pt-4">
                      <div>
                        <h4 className="mb-3 font-bold text-slate-700">ข้อมูลทั่วไปของเครื่อง</h4>
                        <div className="space-y-2">
                          {generalInfoKeys.map((key) => {
                            const value = allInfo[key as keyof typeof allInfo] as string;
                            const label = optionsLabelMap[key]?.[value] || value;
                            return <GeneralInfoItem key={key} itemKey={key} label={label} />;
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-3 font-bold text-slate-700">ผลการตรวจสอบ</h4>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {conditionKeys.map((key) => {
                            const value = allInfo[key as keyof typeof allInfo] as string;
                            const label = optionsLabelMap[key]?.[value] || value;
                            return (
                              <TestItem key={key} itemKey={key} itemValue={value} label={label} />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* --- จบส่วนรายละเอียดสภาพเครื่อง (Accordion) --- */}
            </div>
            {/* --- จบคอลัมน์ขวา --- */}
          </div>
          {/* --- จบโครงสร้าง Layout หลัก --- */}
        </div>
      </main>

      {/* --- [CHIRON] โครงสร้างใหม่: แผงควบคุมถาวรแบบสายพานลำเลียง (Conveyor Belt Command Deck) --- */}
      <div className="fixed right-0 bottom-0 left-0 z-20 w-full border-t border-slate-200 bg-white/90 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="mb-4 text-center text-lg font-bold text-slate-800 md:text-left">
            เลือกบริการและสิทธิพิเศษ
          </h2>
          <div className="flex w-full items-start gap-4">
            {/* --- ส่วนตัวเลือกบริการแบบเลื่อนได้ (Scrollable Service Options) --- */}
            <div
              className={cn(
                "flex flex-1 space-x-4 overflow-x-auto py-4",
                // [Chiron] ติดตั้ง "รางนำทาง" (Scrollbar)
                "scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-slate-200 scrollbar-thumb-rounded-full",
              )}
            >
              {services.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    // [Chiron] คืนสถานะ Micro-architecture เดิม และกำหนดขนาดคงที่
                    className={cn(
                      "group w-80 flex-shrink-0 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                      isSelected
                        ? `border-transparent bg-white shadow-lg ring-2 ${service.ringColor}`
                        : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-md`,
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                            service.bgColor,
                          )}
                        >
                          <Icon className={cn("h-7 w-7", service.color)} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{service.title}</h3>
                          <p className={cn("text-lg font-bold", service.color)}>
                            {service.price.toLocaleString("th-TH", {
                              style: "currency",
                              currency: "THB",
                              minimumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="my-3 h-px w-full bg-slate-200" />
                    <ul className="space-y-1.5 pl-1">
                      {service.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* --- ปุ่มยืนยัน (Confirmation Button) --- */}
            <FramerButton
              size="lg"
              disabled={!selectedService}
              className={cn(
                "mt-2 h-14 w-full self-center rounded-full text-base font-bold sm:w-auto sm:px-12",
                !selectedService && "cursor-not-allowed bg-slate-300 text-slate-500",
                selectedService && "bg-gradient-to-r from-orange-500 to-pink-500 text-white",
              )}
            >
              ยืนยัน
            </FramerButton>
          </div>
        </div>
      </div>
      {/* --- จบแผงควบคุมถาวร --- */}
    </Layout>
  );
}
