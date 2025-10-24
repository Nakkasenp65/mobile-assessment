// src/app/details/(step3)/Services.tsx

import React, { useRef, useEffect, useState } from "react";
import { RepairItem } from "@/hooks/useRepairPrices";
import { DeviceInfo } from "../../../types/device";
import { Assessment } from "../../../types/assessment";
import ServiceCard from "./ServiceCard";
import { serviceBenefits, getTheme, ServiceId } from "./serviceConfig";
import { buildServiceOptions, getServicePayload } from "./serviceHelpers";
import { getReservedService, hasReservedService } from "./reservedServiceHelper";

interface ServicesProps {
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  repairs: RepairItem[];
  totalCost: number;
  isLoading: boolean;
  deviceInfo: DeviceInfo;
  onNext: () => void;
  finalPrice: number;
  assessmentId?: string;
  assessmentData?: Assessment;
}

export default function Services({
  selectedService,
  setSelectedService,
  repairs,
  totalCost,
  isLoading,
  deviceInfo,
  onNext,
  finalPrice,
  assessmentId,
  assessmentData,
}: ServicesProps) {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);
  const isAppleDevice = deviceInfo.brand === "Apple";

  // ตรวจสอบว่ามี service ที่จองแล้วหรือไม่
  const reservedServiceId = getReservedService(assessmentData);
  const isReservedMode = hasReservedService(assessmentData);

  // Build services based on device type
  const allServices = buildServiceOptions(isAppleDevice, finalPrice, totalCost);

  // ถ้ามี service ที่จองแล้ว ให้แสดงเฉพาะ service นั้น
  const services =
    isReservedMode && reservedServiceId
      ? allServices.filter((service) => service.id === reservedServiceId)
      : allServices;

  // Handle service selection
  const handleSelect = (serviceId: string) => {
    if (serviceId === "maintenance") {
      setIsMaintenanceOpen(!isMaintenanceOpen);
    } else {
      setSelectedService(serviceId);
    }
  };

  // Scroll to selected service
  useEffect(() => {
    if (selectedService && itemRefs.current[selectedService]) {
      itemRefs.current[selectedService]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedService]);

  return (
    <div className="w-full">
      <h2 className="my-6 text-left text-2xl font-bold text-slate-800 lg:hidden">
        {isReservedMode ? "บริการที่จองไว้" : "เลือกบริการที่ต้องการ"}
      </h2>

      {navError && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {navError}
        </div>
      )}

      <div className="flex w-full flex-col gap-4" role="list">
        {services.map((service) => {
          const isMaintenance = service.id === "maintenance";
          const isSelected = isMaintenance ? isMaintenanceOpen : selectedService === service.id;
          const theme = getTheme(service.id);
          const benefits = serviceBenefits[service.id] || [];
          const payload = getServicePayload(assessmentData, service.id as ServiceId);
          const isReserved = !!payload && !isMaintenance;

          return (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={isSelected}
              isReserved={isReserved}
              isMaintenance={isMaintenance}
              theme={theme}
              benefits={benefits}
              payload={payload}
              assessmentId={assessmentId}
              repairs={repairs}
              totalCost={totalCost}
              isLoading={isLoading}
              deviceInfo={deviceInfo}
              onSelect={handleSelect}
              onNext={onNext}
              onNavError={setNavError}
              itemRef={(el) => {
                itemRefs.current[service.id] = el;
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
