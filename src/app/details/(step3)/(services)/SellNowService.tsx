// src/app/assess/components/(step3)/(services)/SellNowService.tsx

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceInfo } from "../../../../types/device";
import type { LongdoAddressData } from "../LongdoAddressForm";
import { useLongdoReverseGeocode } from "@/hooks/useLongdoReverseGeocode";
import type { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
import type { SellNowServiceInfo } from "@/types/service";
import axios from "axios";
import Swal from "sweetalert2";
import { AlertTriangle, ShieldCheck } from "lucide-react";

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
  assessmentId: string;
  deviceInfo: DeviceInfo;
  sellPrice: number;
  phoneNumber: string;
  onSuccess?: () => void;
}

type ServiceStep = "filling_form" | "awaiting_deposit" | "completed";

export default function SellNowService({
  assessmentId,
  deviceInfo: _deviceInfo,
  sellPrice,
  phoneNumber,
  onSuccess,
}: SellNowServiceProps) {
  const [serviceStep, setServiceStep] = useState<ServiceStep>("filling_form");
  void _deviceInfo;
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileError, setShowTurnstileError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const updateAssessment = useUpdateAssessment(assessmentId);
  const isDev = process.env.NODE_ENV !== "production";

  const [locationType, setLocationType] = useState<"home" | "bts" | "store" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    phone: phoneNumber,
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

  console.log("formState", formState);

  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [geoPermission, setGeoPermission] = useState<"prompt" | "granted" | "denied" | null>(null);
  // ✨ [แก้ไข] กำหนด state เริ่มต้นเป็น null ก่อน
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const { data: geocodeData } = useLongdoReverseGeocode(mapCenter ? { lat: mapCenter.lat, lng: mapCenter.lng } : null);


  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        import("leaflet").then((L) => {
          setMapCenter(new L.LatLng(latitude, longitude));
        });
        setHasUserLocation(true);
        setIsLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if ((error as { code?: number }).code === 1) {
          // 1 = PERMISSION_DENIED
          setLocationError("ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง");
        } else {
          setLocationError("ไม่สามารถดึงตำแหน่งได้ โปรดตรวจสอบการตั้งค่าเบราว์เซอร์");
        }
        setHasUserLocation(false);
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  // ขอสิทธิ์การเข้าถึง Location ให้เสร็จสิ้นก่อน แล้วค่อยดึง Lat-Long
  const ensurePermissionThenLocate = useCallback(async () => {
    try {
      const permAPI = (
        navigator as unknown as {
          permissions?: { query: (q: { name: string }) => Promise<{ state: "granted" | "prompt" | "denied" }> };
        }
      ).permissions;
      if (permAPI && permAPI.query) {
        const status = await permAPI.query({ name: "geolocation" });
        setGeoPermission(status.state);
        if (status.state === "denied") {
          setLocationError("ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง");
          return; // ไม่ดึง Lat-Long ถ้า deny
        }
      }
    } catch {
      // บราว์เซอร์บางตัวอาจไม่รองรับ Permissions API — ข้ามไปเรียก geolocation โดยตรง
    }
    requestLocation();
  }, [requestLocation]);

  // เรียกขอสิทธิ์ตำแหน่งทันทีเมื่อโหลด SellNowService
  useEffect(() => {
    ensurePermissionThenLocate();
  }, [ensurePermissionThenLocate]);

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

  // ✨ [แก้ไข] เมื่อเลือก "ที่บ้าน" ให้เรียกขอพิกัด แต่ไม่รีเซ็ตสถานะ
  const handleLocationTypeChange = useCallback(
    (newLocationType: "home" | "bts" | "store") => {
      setLocationType(newLocationType);
      if (newLocationType === "home") {
        // ไม่รีเซ็ต hasUserLocation/mapCenter เพื่อให้แผนที่ขึ้นทันทีหากพิกัดพร้อม
        ensurePermissionThenLocate();
      }
    },
    [ensurePermissionThenLocate],
  );

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
    if (!isDev) {
      if (!turnstileToken) {
        turnstileRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setShowTurnstileError(true);
        setTimeout(() => setShowTurnstileError(false), 3000);
        await Swal.fire({ icon: "error", title: "กรุณายืนยันความปลอดภัย", text: "โปรดยืนยัน Turnstile ก่อนดำเนินการ" });
        return;
      }
      setShowTurnstileError(false);

      try {
        const { data } = await axios.post("/api/verify-turnstile", { token: turnstileToken });
        if (!data?.success) {
          await Swal.fire({ icon: "error", title: "การยืนยันไม่สำเร็จ", text: "โปรดลองใหม่อีกครั้ง" });
          return;
        }
      } catch (err) {
        console.warn("Turnstile verification request failed", err);
        await Swal.fire({ icon: "error", title: "ไม่สามารถยืนยัน Turnstile ได้", text: "โปรดลองอีกครั้ง" });
        return;
      }
    } else {
      // Development mode bypass: proceed without turnstile verification
      setShowTurnstileError(false);
    }

    const base: {
      customerName: string;
      phone: string;
      locationType: "home" | "bts" | "store";
      appointmentDate: string;
      appointmentTime: string;
    } = {
      customerName: formState.customerName,
      phone: formState.phone,
      locationType: (locationType as "home" | "bts" | "store") ?? "store",
      appointmentDate: String(formState.date),
      appointmentTime: String(formState.time),
    };

    const payload: SellNowServiceInfo =
      locationType === "home"
        ? {
            ...base,
            addressDetails: formState.addressDetails,
            province: formState.province,
            district: formState.district,
            subdistrict: formState.subdistrict,
            postcode: formState.postcode,
          }
        : locationType === "bts"
          ? { ...base, btsStation: formState.btsStation }
          : { ...base, storeLocation: formState.storeLocation };

    updateAssessment.mutate(
      { sellNowServiceInfo: payload },
      {
        onSuccess: () => {
          void Swal.fire({ icon: "success", title: "ยืนยันข้อมูลสำเร็จ", text: "เราจะติดต่อคุณเร็วๆ นี้" });
          onSuccess?.();
        },
        onError: () => {
          void Swal.fire({ icon: "error", title: "บันทึกข้อมูลไม่สำเร็จ", text: "กรุณาลองใหม่อีกครั้ง" });
        },
      },
    );
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
        {serviceStep === "filling_form" ? (
          <motion.div key="filling_form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PriceDisplay sellPrice={sellPrice} />
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
              className="mt-16 flex flex-col gap-6"
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
              {locationType && (
                <div
                  className={`rounded-lg border px-4 py-3 flex items-start gap-3 ${
                    locationType === "store"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-blue-300 bg-blue-50 text-blue-800"
                  }`}
                >
                  {locationType === "store" ? (
                    <ShieldCheck className="h-5 w-5 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mt-0.5" />
                  )}
                  <div>
                    {locationType === "store" ? (
                      <>
                        <p className="font-semibold">ไม่มีการชำระมัดจำสำหรับรับซื้อที่ร้าน</p>
                        <p className="text-sm">สามารถนำเครื่องมาที่สาขาเพื่อดำเนินการได้ทันที</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">ต้องชำระเงินมัดจำสำหรับการรับซื้อนอกสถานที่</p>
                        <p className="text-sm">ระบบจะแจ้งขั้นตอนและจำนวนเงินมัดจำหลังกรอกข้อมูลนัดหมายครบถ้วน</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              <LocationDetails
                locationType={locationType}
                formState={formState}
                handleInputChange={handleInputChange}
                selectedBtsLine={selectedBtsLine}
                setSelectedBtsLine={setSelectedBtsLine}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                isLocationLoading={isLocationLoading}
                locationError={locationError}
                hasUserLocation={hasUserLocation}
                onRetryLocate={ensurePermissionThenLocate}
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

            <Confirmation
              isFormComplete={isFormComplete}
              handleConfirmSell={handleConfirmSell}
              disabled={updateAssessment.isPending}
              isLoading={updateAssessment.isPending}
            />
          </motion.div>
        ) : serviceStep === "awaiting_deposit" ? (
          <motion.div key="awaiting_deposit">
            <DepositPayment />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
