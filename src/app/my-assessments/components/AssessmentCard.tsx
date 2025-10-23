"use client";

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
import { useMobile } from "@/hooks/useMobile";
import { Skeleton } from "@/components/ui/skeleton";

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

import type { Assessment } from "@/types/assessment";
type AssessmentStatus = Assessment["status"];

type AssessmentRecord = Assessment;

const StatusBadge = ({ status }: { status: AssessmentStatus }) => {
  const statusConfig = {
    completed: {
      label: "เสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
      label: "รอประเมิน",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "in-progress": {
      label: "ดำเนินการ",
      icon: Wrench,
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium",
        config.color,
        "min-w-[80px] justify-center",
      )}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default function AssessmentCard({
  assessment,
}: {
  assessment: AssessmentRecord;
  index?: number;
}) {
  const { data: productData, isLoading } = useMobile(
    assessment.deviceInfo.brand,
    assessment.deviceInfo.model,
  );
  const derivedServiceId = (() => {
    if (assessment.sellNowServiceInfo) return "sell";
    if (assessment.pawnServiceInfo) return "pawn";
    if (assessment.tradeInServiceInfo) return "tradein";
    if (assessment.consignmentServiceInfo) return "consignment";
    return "";
  })();
  const service = ALL_SERVICES.find((s) => s.id === derivedServiceId);
  const ServiceIcon = service?.icon;

  return (
    <motion.div className="w-full">
      <Link
        href={`/details/${assessment.id}`}
        className="group block h-full rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:border-orange-300 hover:shadow-md"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center space-x-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
              {isLoading ? (
                <Skeleton className="h-10 w-10 rounded-md" />
              ) : productData?.image_url ? (
                <Image
                  src={productData.image_url}
                  alt={`${assessment.deviceInfo.brand} ${assessment.deviceInfo.model}`}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <div className="text-xs text-slate-500">ไม่มีรูป</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-sm leading-tight font-bold text-slate-900 sm:text-base">
                {assessment.deviceInfo.brand} {assessment.deviceInfo.model}
              </h3>
              <p className="truncate text-xs text-slate-500 sm:text-sm">
                {assessment.deviceInfo.storage}
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-slate-200" />

        {/* Details */}
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">สถานะ:</span>
            <StatusBadge status={assessment.status} />
          </div>
          {service && ServiceIcon && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">บริการ:</span>
              <div
                className={clsx("flex items-center space-x-1.5 font-medium", service.colorClass)}
              >
                <ServiceIcon className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                <span className="truncate">{service.title}</span>
              </div>
            </div>
          )}
          {assessment.assessmentDate && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">วันที่ประเมิน:</span>
              <span className="truncate font-medium text-slate-700">
                {assessment.assessmentDate}
              </span>
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-slate-500">ราคาประเมิน</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-orange-600 sm:text-xl">
                {assessment.estimatedValue.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center text-xs font-semibold text-orange-600 group-hover:text-orange-700 sm:text-sm">
            ดูรายละเอียด
            <ChevronRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
