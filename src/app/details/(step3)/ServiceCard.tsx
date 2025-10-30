// src/app/details/(step3)/ServiceCard.tsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CircleDot, LucideIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ServiceOption } from "../../../types/service";
import { DeviceInfo } from "../../../types/device";
import { RepairItem } from "@/hooks/useRepairPrices";
import MaintenanceService from "./(services)/MaintenanceService";
import ServiceBenefits from "./ServiceBenefits";
import ReservedServiceDetails from "./ReservedServiceDetails";
import { formatTHB } from "./serviceConfig";

interface ServiceCardProps {
  service: ServiceOption;
  isSelected: boolean;
  isReserved: boolean;
  isMaintenance: boolean;
  theme: any;
  benefits: string[];
  payload: any;
  assessmentId?: string;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
  deviceInfo: DeviceInfo;
  onSelect: (serviceId: string) => void;
  onNext: () => void;
  onNavError: (error: string) => void;
  itemRef: (el: HTMLDivElement | null) => void;
}

export default function ServiceCard({
  service,
  isSelected,
  isMaintenance,
  theme,
  benefits,
  payload,
  assessmentId,
  repairs,
  totalCost,
  isLoading,
  deviceInfo,
  onSelect,
  onNext,
  onNavError,
  itemRef,
}: ServiceCardProps) {
  const Icon = service.icon as LucideIcon;

  // Hide maintenance if no repairs
  if (isMaintenance && repairs.length === 0) {
    return null;
  }

  return (
    <motion.div
      key={service.id}
      ref={itemRef}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex h-full w-full cursor-pointer flex-col rounded-2xl border p-5 text-left transition-all duration-300",
        isSelected
          ? `ring-2 ${theme.ring} ${theme.borderColor} shadow-lg ${theme.shadow}`
          : "border-border hover:border-slate-300",
        isMaintenance && "lg:hidden",
      )}
      aria-selected={isSelected}
      onClick={() => {
        onSelect(service.id);
      }}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full text-white",
              theme.iconBg,
            )}
          >
            <CircleDot className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service header */}
      <div className="flex flex-1 items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-sm",
            theme.iconBg,
          )}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-foreground font-bold">{service.title}</h4>
          <p className="text-muted-foreground text-sm">{service.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-foreground text-lg font-bold">{formatTHB(service.price)}</p>
        </div>
      </div>

      {/* Service content */}
      {!isMaintenance && (
        <>
          <div className="bg-border my-4 h-px w-full" />

          <ServiceBenefits benefits={benefits} theme={theme} />

          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
                exit={{ opacity: 0, height: 0, marginTop: "0px" }}
                transition={{ duration: 0.3 }}
                className="flex justify-end overflow-hidden"
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  size="lg"
                  className={cn(
                    "h-12 w-full text-base font-bold text-white shadow-lg transition-all duration-300 sm:w-max",
                    theme.solidBg,
                    `hover:${theme.solidBg} hover:brightness-110`,
                  )}
                >
                  ยืนยันบริการนี้
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Maintenance service content */}
      {isMaintenance && (
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
              exit={{ opacity: 0, height: 0, marginTop: "0px" }}
              className="lg:hidden"
            >
              <MaintenanceService
                deviceInfo={deviceInfo}
                repairs={repairs}
                totalCost={totalCost}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
