// src/app/assess/components/(step3)/(services)/SellNowService.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceInfo } from "../../../../../types/device";
import type { LongdoAddressData } from "../LongdoAddressForm";
import useLocation from "@/hooks/useLocation";
import { useLongdoReverseGeocode } from "@/hooks/useLongdoReverseGeocode";
import type { LatLng } from "leaflet";

// Import components
import PriceDisplay from "./sell-now-components/PriceDisplay";
import CustomerInfoForm from "./sell-now-components/CustomerInfoForm";
import LocationSelector from "./sell-now-components/LocationSelector";
import LocationDetails from "./sell-now-components/LocationDetails";
import AppointmentScheduler from "./sell-now-components/AppointmentScheduler";
import Confirmation from "./sell-now-components/Confirmation";
import DepositPayment from "./sell-now-components/DepositPayment"; // <-- import component ใหม่

interface SellNowServiceProps {
  deviceInfo: DeviceInfo;
  sellPrice: number;
}

// ✨ สร้าง Type สำหรับขั้นตอนต่างๆ
type ServiceStep = "filling_form" | "awaiting_deposit" | "completed";

const SellNowService = ({ deviceInfo, sellPrice }: SellNowServiceProps) => {
  // ✨ เพิ่ม State สำหรับควบคุม Step
  const [serviceStep, setServiceStep] = useState<ServiceStep>("filling_form");

  const [locationType, setLocationType] = useState<"home" | "bts" | "store" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    addressDetails: "",
    province: "",
    district: "",
    subdistrict: "",
    postcode: "",
    btsStation: "",
    storeLocation: "สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)",
    date: "",
    time: "",
  });

  const { location: initialLocation } = useLocation();
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const { data: geocodeData } = useLongdoReverseGeocode(mapCenter ? { lat: mapCenter.lat, lng: mapCenter.lng } : null);

  useEffect(() => {
    if (initialLocation && !mapCenter) {
      import("leaflet").then((L) => {
        setMapCenter(new L.LatLng(initialLocation.latitude, initialLocation.longitude));
      });
    }
  }, [initialLocation, mapCenter]);

  const handleInputChange = (field: keyof typeof formState, value: string | Date | undefined) => {
    setFormState((prev) => ({
      ...prev,
      [field]: field === "phone" ? (value as string).replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleLocationTypeChange = (newLocationType: "home" | "bts" | "store") => {
    setLocationType(newLocationType);
  };

  const handleAddressChange = useCallback((address: LongdoAddressData) => {
    setFormState((prev) => ({
      ...prev,
      province: address.province,
      district: address.district,
      subdistrict: address.subdistrict,
      postcode: address.postcode,
      addressDetails: address.address,
    }));
  }, []);

  // ✨ แก้ไขฟังก์ชันนี้เพื่อเปลี่ยนหน้าจอแทนการใช้ alert
  const handleConfirmSell = () => {
    console.log("✅ Form state on submit:", formState);
    if (locationType === "home" || locationType === "bts") {
      // ถ้าเป็น home หรือ bts ให้เปลี่ยนไปหน้าจ่ายมัดจำ
      setServiceStep("awaiting_deposit");
    } else {
      // ถ้าเป็น store ให้แจ้งเตือนและจบขั้นตอน (ยังใช้ alert ได้สำหรับกรณีนี้)
      alert("นัดหมายสำเร็จ! กรุณาเดินทางไปที่สาขาตามวันและเวลาที่เลือก");
      setServiceStep("completed");
    }
  };

  const isFormComplete = !!(
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.date &&
    formState.time &&
    locationType !== null &&
    (locationType === "home"
      ? formState.province && formState.addressDetails
      : locationType === "bts"
        ? formState.btsStation
        : locationType === "store")
  );

  const formVariants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  useEffect(() => {
    scrollTo(0, 0);
  }, [serviceStep]);

  return (
    <main className="w-full space-y-6 pt-4">
      <AnimatePresence mode="wait">
        {/* ✨ ใช้ State ควบคุมการแสดงผล */}
        {serviceStep === "filling_form" ? (
          <motion.div key="filling_form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PriceDisplay sellPrice={sellPrice} />
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className="mt-6 space-y-6"
            >
              <CustomerInfoForm
                formState={formState}
                handleInputChange={handleInputChange}
                formVariants={formVariants}
              />
              <LocationSelector
                locationType={locationType}
                handleLocationTypeChange={handleLocationTypeChange}
                formVariants={formVariants}
              />
              <LocationDetails
                locationType={locationType}
                formState={formState}
                handleInputChange={handleInputChange}
                selectedBtsLine={selectedBtsLine}
                setSelectedBtsLine={setSelectedBtsLine}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                geocodeData={geocodeData}
                handleAddressChange={handleAddressChange}
                formVariants={formVariants}
              />
              <AppointmentScheduler
                formState={formState}
                handleInputChange={handleInputChange}
                locationType={locationType}
                formVariants={formVariants}
              />
            </motion.div>
            <Confirmation isFormComplete={isFormComplete} handleConfirmSell={handleConfirmSell} />
          </motion.div>
        ) : serviceStep === "awaiting_deposit" ? (
          <motion.div key="awaiting_deposit">
            <DepositPayment />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
};

export default SellNowService;
