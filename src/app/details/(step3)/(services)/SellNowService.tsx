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
import { combineDateTime } from "@/util/dateTime";
import { SERVICE_TYPES, BRANCHES, getBranchIdFromName } from "@/constants/queueBooking";

// Import sub-components
import PriceDisplay from "./sell-now-components/PriceDisplay";
import CustomerInfoForm from "./sell-now-components/CustomerInfoForm";
import LocationSelector from "./sell-now-components/LocationSelector";
import LocationDetails from "./sell-now-components/LocationDetails";
import AppointmentScheduler from "./sell-now-components/AppointmentScheduler";
import Confirmation from "./sell-now-components/Confirmation";
import ConfirmDepositPaymentModal from "./ConfirmDepositPaymentModal";
import ConfirmServiceNoDepositModal from "./ConfirmServiceNoDepositModal";
import { useCreatePaymentLink } from "../../../../hooks/usePaymentLink";

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
  customerName: string;
  lineUserId?: string | null;
  docId: string;
  handleShowConsent: () => void;
}

export interface SellnowServiceFormState {
  customerName: string;
  phone: string;
  addressDetails: string;
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  btsStation: string;
  storeLocation: "สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)" | "สาขากุดปลาดุก";
  date: string;
  time: string;
}

export default function SellNowService({
  assessmentId,
  deviceInfo, // TODO: ใช้ deviceInfo ในการคิดราคาเพิ่มเติม
  sellPrice,
  phoneNumber,
  customerName,
  lineUserId,
  docId,
  handleShowConsent,
}: SellNowServiceProps) {
  // Environment variables
  const isDev = process.env.NODE_ENV !== "production";

  // State
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstileError, setShowTurnstileError] = useState(false);
  const [locationType, setLocationType] = useState<"home" | "bts" | "store" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const [formState, setFormState] = useState<SellnowServiceFormState>({
    customerName: customerName,
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
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [geoPermission, setGeoPermission] = useState<"prompt" | "granted" | "denied" | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);

  // refs
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Derived state
  const isDepositRequired: boolean = locationType === "bts" || locationType === "home";

  // Hooks
  const { data: geocodeData } = useLongdoReverseGeocode(
    mapCenter ? { lat: mapCenter.lat, lng: mapCenter.lng } : null,
  );

  // Mutations
  const updateAssessment = useUpdateAssessment(assessmentId, "SELL_NOW", lineUserId);
  const createPaymentLinkMutation = useCreatePaymentLink(docId);

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

  const ensurePermissionThenLocate = useCallback(async () => {
    try {
      const permAPI = (
        navigator as unknown as {
          permissions?: {
            query: (q: { name: string }) => Promise<{ state: "granted" | "prompt" | "denied" }>;
          };
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

  useEffect(() => {
    console.log("Form State Updated: ", formState);
  }, [formState]);

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

  const handleInputChange = useCallback(
    (field: keyof typeof formState, value: string | Date | undefined) => {
      setFormState((prev) => ({
        ...prev,
        [field]: field === "phone" ? (value as string).replace(/[^0-9]/g, "") : value,
      }));
    },
    [],
  );

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
    setIsLoadingProcess(true);
    // ตรวจสอบ Turnstile verification หากอยู่ใน production
    if (process.env.NODE_ENV === "production") {
      console.log("🔒 [PAYMENT] Checking Turnstile verification...");

      if (!turnstileToken) {
        console.warn("⚠️ [PAYMENT] No Turnstile token found");
        await Swal.fire({
          icon: "error",
          title: "Verification Required",
          text: "Please complete the security verification.",
        });
        return;
      }

      try {
        console.log("📤 [PAYMENT] Verifying Turnstile token with API...");
        const verifyResponse = await axios.post("/api/verify-turnstile", {
          token: turnstileToken,
        });

        if (!verifyResponse.data.success) {
          console.error("❌ [PAYMENT] Turnstile verification failed:", verifyResponse.data);
          await Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: "Security verification failed. Please try again.",
          });
          // Reset the Turnstile widget
          setTurnstileToken(null);
          return;
        }

        console.log("✅ [PAYMENT] Turnstile verification successful");
      } catch (error) {
        console.error("❌ [PAYMENT] Turnstile verification error:", error);
        await Swal.fire({
          icon: "error",
          title: "Verification Error",
          text: "An error occurred during security verification.",
        });
        return;
      }
    }

    const appointmentAt = combineDateTime(formState.date, formState.time);
    let branchId: string;
    if (locationType === "store" && formState.storeLocation) {
      branchId = getBranchIdFromName(formState.storeLocation);
    } else {
      // For BTS and Home services, use default branch (Center One)
      branchId = BRANCHES[0].id; // "เซ็นเตอร์วัน"
    }

    const base: {
      type: "SELL_NOW";
      customerName: string;
      phone: string;
      locationType: "home" | "bts" | "store";
      appointmentDate: string;
      appointmentTime: string;
      appointmentAt: string;
      branchId: string;
      serviceType: string;
    } = {
      type: "SELL_NOW",
      customerName: formState.customerName,
      phone: formState.phone,
      locationType: (locationType as "home" | "bts" | "store") ?? "store",
      appointmentDate: String(formState.date),
      appointmentTime: String(formState.time),
      // Queue booking fields
      appointmentAt,
      branchId, // Now always set (store-specific or default)
      serviceType: SERVICE_TYPES.SELL_NOW,
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

    console.log("✅ [PAYMENT] Payload created successfully:", {
      locationType: payload.locationType,
      appointmentAt: payload.appointmentAt,
      branchId: payload.branchId,
      serviceType: payload.serviceType,
    });

    // อัพเดทข้อมูลการจองบริการซื้อขายไป และแบ่ง case สำหรับการชำระเงินมัดจำ
    await updateAssessment.mutateAsync(
      { status: "reserved", sellNowServiceInfo: payload },
      {
        onSuccess: async () => {
          console.log("✅ [PAYMENT] Assessment updated successfully");

          // Check if payment is required (for BTS and Home services)
          const requiresPayment = locationType === "bts" || locationType === "home";

          if (requiresPayment) {
            try {
              // Create payment link
              const redirectUrl = `${window.location.origin}/confirmed/${assessmentId}`;

              const paymentResponse = await axios.post("/api/create-payment-link", {
                redirectUrl,
                docId: docId,
              });

              console.log("✅ [PAYMENT] Payment link created successfully:", {
                paymentLinkUrl: paymentResponse.data.paymentLinkUrl,
                paymentLinkId: paymentResponse.data.paymentLinkId,
              });

              const { paymentLinkUrl, paymentLinkId } = paymentResponse.data;

              // เอาลิงก์ไปเก็บในฐานข้อมูลผ่าน mutation บน Supabase
              await createPaymentLinkMutation.mutateAsync({
                link: paymentLinkUrl,
                link_id: paymentLinkId,
              });

              if (!paymentLinkUrl) {
                console.error(
                  "❌ [PAYMENT] No payment link URL in response:",
                  paymentResponse.data,
                );
                throw new Error("Payment link not received");
              }

              // TODO: PAYMENT GATEWAY LINK POP UP
              window.location.assign(paymentLinkUrl);
            } catch (error) {
              console.error("❌ [PAYMENT] Payment flow error:", {
                error,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
              });
              await Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาดในการชำระเงิน",
                text: "กรุณาติดต่อเจ้าหน้าที่",
              });
            }
            setIsLoadingProcess(false);
            // TODO: THIS NAVIGATED TO NEW PAGE ส่งผู้ใช้ไปยังหน้าสรุปการจองทันที?
            // window.location.assign(`${window.location.origin}/confirmed/${assessmentId}`);
          } else {
            // For store service, no payment required
            console.log("🏪 [PAYMENT] Store service - no payment required");
            await Swal.fire({
              icon: "success",
              title: "ยืนยันข้อมูลสำเร็จ",
              text: "เราจะติดต่อคุณเร็วๆ นี้",
            });
            console.log("✅ [PAYMENT] Store service confirmed successfully");
            setIsLoadingProcess(false);
            window.location.assign(`${window.location.origin}/confirmed/${assessmentId}`);
          }
        },
        onError: (error) => {
          console.error("❌ [PAYMENT] Assessment update failed:", {
            error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
          });
          void Swal.fire({
            icon: "error",
            title: "บันทึกข้อมูลไม่สำเร็จ",
            text: "กรุณาลองใหม่อีกครั้ง",
          });
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

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <main className="w-full space-y-6 pt-4">
      {isDepositRequired ? (
        <ConfirmDepositPaymentModal
          isOpen={isShowConfirmModal}
          setIsOpen={setIsShowConfirmModal}
          title={"ยืนยันการจองและชำระค่ามัดจำ"}
          onConfirm={handleConfirmSell}
          isLoading={isLoadingProcess}
        />
      ) : (
        <ConfirmServiceNoDepositModal
          isOpen={isShowConfirmModal}
          setIsOpen={setIsShowConfirmModal}
          title={"ยืนยันการจองบริการ (ไม่มีค่ามัดจำ)"}
          description="เมื่อยืนยันการจองบริการระบบจะนำคุณไปยังหน้าสรุปรายการ"
          onConfirm={handleConfirmSell}
          isLoading={isLoadingProcess}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key="filling_form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PriceDisplay sellPrice={sellPrice} />
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
            className="mt-16 flex flex-col gap-4"
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
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 ${
                  locationType === "store"
                    ? "border-emerald-300 bg-green-50" // เส้นขอบสีเขียว
                    : "border-blue-300 bg-blue-50" // เส้นขอบสีฟ้า
                }`}
              >
                {/* === Text Content === */}
                <div className="flex-1">
                  {locationType === "store" ? (
                    <>
                      <p className="font-semibold text-gray-900">รับซื้อที่ร้าน (ไม่ต้องมัดจำ)</p>
                      <p className="text-sm text-gray-600">
                        นำเครื่องมาที่สาขาเพื่อรับบริการได้ทันที
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900">บริการรับถึงที่ (มัดจำ 200 บาท)</p>
                      <p className="text-sm text-gray-600">
                        การจองนอกสถานที่จะมีค่ามัดจำการบริการและได้รับคืนหลังจบการบริการ
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Location LongdoForm */}
            <LocationDetails
              locationType={locationType}
              formState={formState}
              setFormState={setFormState}
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

          {!isDev && (
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
          )}

          <Confirmation
            isFormComplete={isFormComplete}
            handleConfirmSell={() => setIsShowConfirmModal(true)}
            disabled={updateAssessment.isPending}
            isLoading={updateAssessment.isPending}
            handleShowConsent={handleShowConsent}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
