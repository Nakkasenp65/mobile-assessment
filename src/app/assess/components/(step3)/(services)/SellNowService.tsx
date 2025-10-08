// src/app/assess/components/(step3)/(services)/SellNowService.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DeviceInfo } from "../../../../../types/device";
import type { LongdoAddressData } from "../LongdoAddressForm";
import useLocation from "@/hooks/useLocation";
import { useLongdoReverseGeocode } from "@/hooks/useLongdoReverseGeocode";
import type { LatLng } from "leaflet";

// Import new components
import PriceDisplay from "./sell-now-components/PriceDisplay";
import CustomerInfoForm from "./sell-now-components/CustomerInfoForm";
import LocationSelector from "./sell-now-components/LocationSelector";
import LocationDetails from "./sell-now-components/LocationDetails";
import AppointmentScheduler from "./sell-now-components/AppointmentScheduler";
import Confirmation from "./sell-now-components/Confirmation";

interface SellNowServiceProps {
  deviceInfo: DeviceInfo;
  sellPrice: number;
}

const SellNowService = ({ deviceInfo, sellPrice }: SellNowServiceProps) => {
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

  const handleConfirmSell = () => {
    console.log("✅ Final form state on submit:", formState);
    alert("ข้อมูลถูกส่งแล้ว! (ดูใน Console)");
  };

  // ✨ FIX: Ensure the final value is always a boolean
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
  }, []);

  return (
    <main className="w-full space-y-6 pt-4">
      <PriceDisplay sellPrice={sellPrice} />

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        <CustomerInfoForm formState={formState} handleInputChange={handleInputChange} formVariants={formVariants} />

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
    </main>
  );
};

export default SellNowService;
