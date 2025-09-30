import {
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Hash,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import PriceLockCountdown from "./PirceLockCountdown";
import ConditionGrid from "./ConditionGrid";
import SupportSection from "./SupportSection";
import { motion } from "framer-motion";
import PawnServiceDetails from "./(assessment-details-components)/PawnServiceDetails";

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

export interface PawnServiceInfo {
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

export interface AssessmentRecord {
  id: string; // ✨ 2. เพิ่ม ID เข้าไปใน Interface
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

export default function AssessmentDetails({
  record,
}: {
  record: AssessmentRecord;
}) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative w-full max-w-6xl"
    >
      {/* HEAD */}
      <div className="mb-8 flex-col items-center justify-center gap-8">
        <h2 className="mb-2 text-3xl font-bold text-black">
          ผลการประเมินอุปกรณ์
        </h2>
        <div className="items-center justify-center gap-2 md:flex">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
            <Hash className="h-4 w-4" />
            <span>รหัสการประเมิน: {record.id}</span>
          </div>
          <p className="text-[#78716c]">
            อัพเดทล่าสุด: {record.assessmentDate}
          </p>
          <StatusBadge status={record.status} />
        </div>
      </div>

      {/* FORM  */}
      <div className="rounded-3xl bg-white p-6 shadow-2xl lg:p-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:flex-1">
            <div className="flex flex-col items-center gap-6 text-left lg:flex-row lg:items-start">
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

            <div
              className={`my-4 h-[2px] w-full bg-gradient-to-r from-orange-200 to-pink-200`}
            />
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
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500`}
                >
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-bold text-slate-800 md:text-lg">
                  ขั้นตอนต่อไป
                </span>
              </div>
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
}
