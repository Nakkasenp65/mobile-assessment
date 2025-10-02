import {
  Banknote,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  RefreshCw,
  Shield,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { ComponentType } from "react";

type IconComponent = ComponentType<{ className?: string }>;

interface ServiceOption {
  id: string;
  title: string;
  icon: IconComponent;
  colorClass: string;
  bgColorClass: string;
}

const ALL_SERVICES: ServiceOption[] = [
  {
    id: "sell",
    title: "ขายทันที",
    icon: Banknote,
    colorClass: "text-pink-600",
    bgColorClass: "bg-pink-50",
  },
  {
    id: "pawn",
    title: "บริการจำนำ",
    icon: Shield,
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-50",
  },
  {
    id: "tradein",
    title: "แลกซื้อเครื่องใหม่",
    icon: RefreshCw,
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-50",
  },
  {
    id: "consignment",
    title: "ฝากขาย",
    icon: ShoppingBag,
    colorClass: "text-sky-600",
    bgColorClass: "bg-sky-50",
  },
  {
    id: "installment",
    title: "ผ่อนชำระ",
    icon: CreditCard,
    colorClass: "text-red-600",
    bgColorClass: "bg-red-50",
  },
];

type AssessmentStatus = "completed" | "pending" | "in-progress";

interface AssessmentRecord {
  id: string;
  email: string;
  phoneNumber: string;
  assessmentDate: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl: string;
  };
  status: AssessmentStatus;
  estimatedValue: number;
  selectedServiceId: string;
}

const StatusBadge = ({ status }: { status: AssessmentStatus }) => {
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
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.color,
        "border",
        "min-w-[100px]",
        "justify-center",
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default function AssessmentCard({
  assessment,
  index,
}: {
  assessment: AssessmentRecord;
  index: number;
}) {
  const service = ALL_SERVICES.find((s) => s.id === assessment.selectedServiceId);
  const ServiceIcon = service?.icon;
  return (
    <motion.div className="w-full">
      <Link
        href={`/my-assessment-details/${assessment.id}`}
        className="group block h-full rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:border-orange-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Image
                src={assessment.device.imageUrl}
                alt={`${assessment.device.brand} ${assessment.device.model}`}
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {assessment.device.brand} {assessment.device.model}
              </h3>
              <p className="text-sm text-slate-500">{assessment.device.storage}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
        </div>
        <div className="my-4 h-px bg-slate-200" />
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">สถานะ:</span>
            <StatusBadge status={assessment.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">บริการ:</span>
            {service && ServiceIcon && (
              <div
                className={clsx("flex items-center space-x-1.5 font-medium", service.colorClass)}
              >
                <ServiceIcon className="h-4 w-4 flex-shrink-0" />
                <span>{service.title}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">วันที่ประเมิน:</span>
            <span className="font-medium text-slate-700">{assessment.assessmentDate}</span>
          </div>
        </div>
        <div className="my-4 h-px bg-slate-200" />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-500">ราคาประเมิน</p>
            <p className="text-xl font-bold text-orange-600">
              {assessment.estimatedValue.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="inline-flex items-center text-sm font-semibold text-orange-600 group-hover:text-orange-700">
            ดูรายละเอียด
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
