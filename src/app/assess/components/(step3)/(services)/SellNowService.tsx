"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceInfo } from "../../../../../types/device";
import type { LongdoAddressData } from "../LongdoAddressForm";
import useLocation from "@/hooks/useLocation";
import { useLongdoReverseGeocode } from "@/hooks/useLongdoReverseGeocode";
import type { LatLng } from "leaflet";
import dynamic from "next/dynamic";

// Import sub-components
import PriceDisplay from "./sell-now-components/PriceDisplay";
import CustomerInfoForm from "./sell-now-components/CustomerInfoForm";
import LocationSelector from "./sell-now-components/LocationSelector";
import LocationDetails from "./sell-now-components/LocationDetails";
import AppointmentScheduler from "./sell-now-components/AppointmentScheduler";
import Confirmation from "./sell-now-components/Confirmation";
import DepositPayment from "./sell-now-components/DepositPayment";

// Dynamically import the Turnstile component. This is the correct way.
const Turnstile = dynamic(() => import("@/components/Turnstile"), {
  ssr: false,
  loading: () => <div className="h-[65px] w-[300px] animate-pulse rounded-md bg-gray-200"></div>,
});

interface SellNowServiceProps {
  deviceInfo: DeviceInfo;
  sellPrice: number;
}

type ServiceStep = "filling_form" | "awaiting_deposit" | "completed";

const SellNowService = ({ deviceInfo: _deviceInfo, sellPrice }: SellNowServiceProps) => {
  // ✨ REMOVED isClient STATE ✨
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  const [serviceStep, setServiceStep] = useState<ServiceStep>("filling_form");
  void _deviceInfo;
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileError, setShowTurnstileError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

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
    // This is fine, as Leaflet is also dynamically imported inside LocationDetails
    if (initialLocation && !mapCenter) {
      import("leaflet").then((L) => {
        setMapCenter(new L.LatLng(initialLocation.latitude, initialLocation.longitude));
      });
    }
  }, [initialLocation, mapCenter]);

  useEffect(() => {
    if (turnstileToken) {
      setShowTurnstileError(false);
    }
  }, [turnstileToken]);

  const handleTurnstileVerify = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const handleInputChange = useCallback((field: keyof typeof formState, value: string | Date | undefined) => {
    setFormState((prev) => ({
      ...prev,
      [field]: field === "phone" ? (value as string).replace(/[^0-9]/g, "") : value,
    }));
  }, []);

  const handleLocationTypeChange = useCallback((newLocationType: "home" | "bts" | "store") => {
    setLocationType(newLocationType);
  }, []);

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

  const handleConfirmSell = async () => {
    if (!turnstileToken) {
      turnstileRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setShowTurnstileError(true);
      setTimeout(() => setShowTurnstileError(false), 3000);
      return;
    }
    setShowTurnstileError(false);

    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Turnstile verification failed. โปรดลองใหม่");
        return;
      }
    } catch (err) {
      console.warn("Turnstile verification request failed", err);
      alert("ไม่สามารถยืนยัน Turnstile ได้ โปรดลองอีกครั้ง");
      return;
    }

    if (locationType === "home" || locationType === "bts") {
      setServiceStep("awaiting_deposit");
    } else {
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

  // ✨ REMOVED the `if (!isClient)` block ✨

  return (
    <main className="w-full space-y-6 pt-4">
      <AnimatePresence mode="wait">
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

            <div ref={turnstileRef} className="mt-6">
              {showTurnstileError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-sm font-medium text-red-600"
                >
                  กรุณายืนยันว่าคุณไม่ใช่บอทก่อนส่งฟอร์ม
                </motion.p>
              )}
              <Turnstile onVerify={handleTurnstileVerify} />
            </div>

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
