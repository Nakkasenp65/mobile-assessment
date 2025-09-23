"use client";
import { ComponentType, useMemo } from "react";
import { PriceAdjustment } from "../../../../hooks/usePriceCalculation";
import {
  BatteryCharging,
  Camera,
  Cpu, // Using CPU for Model
  HardDrive, // Using HardDrive for Storage
  Hand,
  Mic,
  Monitor,
  Power,
  Smartphone, // Using Smartphone for Brand/ScreenGlass
  Volume2,
  Wifi,
  AlertTriangle, // For warnings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentLedgerProps {
  adjustments: PriceAdjustment[];
}

const ICON_MAP: Record<string, ComponentType<any>> = {
  brand: Smartphone,
  model: Cpu,
  storage: HardDrive,
  batteryHealth: BatteryCharging,
  screenGlass: Smartphone,
  screenDisplay: Monitor,
  powerOn: Power,
  cameras: Camera,
  charger: BatteryCharging,
  wifi: Wifi,
  touchScreen: Hand,
  mic: Mic,
  speaker: Volume2,
};

// Aria's touch: A new color and icon map for different states
const STATUS_STYLES = {
  normal: {
    iconColor: "text-muted-foreground",
    textColor: "text-foreground",
    valueColor: "text-foreground",
  },
  issue: {
    icon: AlertTriangle,
    iconColor: "text-orange-500",
    textColor: "text-orange-600",
    valueColor: "text-orange-600 font-bold",
  },
};

const AssessmentLedger = ({ adjustments }: AssessmentLedgerProps) => {
  const categorizedAdjustments = useMemo(() => {
    const categories: {
      deviceInfo: PriceAdjustment[];
      conditionInfo: PriceAdjustment[];
    } = {
      deviceInfo: [],
      conditionInfo: [],
    };

    const deviceInfoKeys = ["brand", "model", "storage", "batteryHealth"];

    adjustments.forEach((adj) => {
      if (deviceInfoKeys.includes(adj.key)) {
        categories.deviceInfo.push(adj);
      } else {
        categories.conditionInfo.push(adj);
      }
    });

    return categories;
  }, [adjustments]);

  const renderAdjustmentItem = (adj: PriceAdjustment) => {
    const isIssue = adj.impact < 0;
    const style = isIssue ? STATUS_STYLES.issue : STATUS_STYLES.normal;
    const Icon = isIssue ? null : ICON_MAP[adj.key];

    return (
      <div
        key={adj.key}
        className={cn(
          "flex items-center justify-between rounded-lg p-3 transition-colors",
          isIssue ? "bg-orange-500/10" : "hover:bg-accent/50",
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className={cn("h-5 w-5 flex-shrink-0", style.iconColor)} />
          )}
          <span className={cn("font-medium", style.textColor)}>
            {adj.label}
          </span>
        </div>
        <span className={cn("font-semibold", style.valueColor)}>
          {adj.value}
        </span>
      </div>
    );
  };

  return (
    // Kaia's insight: A clear, sectioned layout is easier to understand.
    <div className="flex flex-col gap-6 text-sm">
      {/* Device Information Section */}
      <div>
        <h3 className="text-foreground mb-2 text-base font-semibold">
          ข้อมูลอุปกรณ์
        </h3>
        <div className="flex flex-col gap-1 rounded-xl border p-2">
          {categorizedAdjustments.deviceInfo.map(renderAdjustmentItem)}
        </div>
      </div>

      {/* Condition Report Section */}
      <div>
        <h3 className="text-foreground mb-2 text-base font-semibold">
          สภาพตัวเครื่อง
        </h3>
        <div className="flex flex-col gap-2 rounded-xl border p-2">
          {categorizedAdjustments.conditionInfo.map(renderAdjustmentItem)}
        </div>
      </div>
    </div>
  );
};

export default AssessmentLedger;
