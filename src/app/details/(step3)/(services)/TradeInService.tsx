// src/app/assess/components/(step3)/(services)/TradeInService.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateTimeSelect from "@/components/ui/DateTimeSelect";
import { DeviceInfo } from "../../../../types/device";
import { User, Phone, RefreshCcw, Sparkles, Pencil } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
// DateSelect is now handled inside DateTimeSelect
import { useRouter } from "next/navigation";
import { useUpdateAssessment } from "@/hooks/useUpdateAssessment";
import type { TradeInServiceInfo } from "@/types/service";
import Swal from "sweetalert2";

interface TradeInServiceProps {
  assessmentId: string;
  deviceInfo: DeviceInfo;
  tradeInPrice: number;
  phoneNumber: string;
  onSuccess?: () => void;
}

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

const newDevices = [
  { id: "iphone15pro", name: "iPhone 15 Pro", price: 39900 },
  { id: "iphone15", name: "iPhone 15", price: 32900 },
  { id: "iphone14pro", name: "iPhone 14 Pro", price: 35900 },
  { id: "iphone14", name: "iPhone 14", price: 28900 },
  { id: "iphone13", name: "iPhone 13", price: 24900 },
];

const storageOptions = ["128GB", "256GB", "512GB", "1TB"];
const colorOptions = ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"];

const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

export default function TradeInService({
  assessmentId,
  deviceInfo,
  tradeInPrice,
  phoneNumber,
  onSuccess,
}: TradeInServiceProps) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    customerName: "",
    phone: phoneNumber,
    storeLocation: storeLocations[0],
    newDevice: "",
    storage: "",
    color: "",
    phoneCondition: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  // ✨ 2. อัปเดต Type ของ value ให้รองรับ Date ได้
  const handleInputChange = (field: keyof typeof formState, value: string | Date | undefined) => {
    if (field === "phone") {
      const numericValue = (value as string).replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleEditPhoneClick = async () => {
    const result = await Swal.fire({
      title: "แก้ไขเบอร์โทรศัพท์",
      text: "กรุณากรอกเบอร์ 10 หลัก เช่น 0987654321",
      input: "tel",
      inputValue: formState.phone,
      inputAttributes: {
        maxlength: "10",
        inputmode: "numeric",
        pattern: "[0-9]*",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      preConfirm: (value) => {
        const sanitized = (value || "").replace(/[^0-9]/g, "");
        if (!/^\d{10}$/.test(sanitized)) {
          Swal.showValidationMessage("กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก");
          return;
        }
        return sanitized;
      },
    });
    if (result.value) {
      handleInputChange("phone", result.value);
    }
  };

  const priceCalculation = useMemo(() => {
    const selectedDevice = newDevices.find((d) => d.id === formState.newDevice);
    if (!selectedDevice) return null;

    const additionalPrice = selectedDevice.price - tradeInPrice;
    return {
      newDevicePrice: selectedDevice.price,
      tradeInValue: tradeInPrice,
      additionalPayment: additionalPrice > 0 ? additionalPrice : 0,
    };
  }, [formState.newDevice, tradeInPrice]);

  const isFormComplete =
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.newDevice &&
    formState.storage &&
    formState.color &&
    formState.phoneCondition &&
    formState.appointmentDate &&
    formState.appointmentTime;

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const updateAssessment = useUpdateAssessment(assessmentId);

  const handleConfirmTradeIn = () => {
    const payload: TradeInServiceInfo = {
      customerName: formState.customerName,
      phone: formState.phone,
      storeLocation: formState.storeLocation,
      newDevice: formState.newDevice,
      storage: formState.storage,
      color: formState.color,
      phoneCondition: formState.phoneCondition as "first_hand" | "second_hand",
      appointmentDate: String(formState.appointmentDate),
      appointmentTime: String(formState.appointmentTime),
    };

    updateAssessment.mutate(
      { tradeInServiceInfo: payload },
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

  return (
    <main className="w-full space-y-6">
      {/* Trade-In Value Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-yellow-50 via-amber-50 to-white p-6 text-center shadow-lg"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-yellow-100/50 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-amber-900">มูลค่าเครื่องเก่าของคุณ</h3>
          <p className="mt-2 bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            {THB(tradeInPrice)}
          </p>
          <p className="mt-2 text-sm text-amber-800/80">ใช้ส่วนลดสำหรับซื้อเครื่องใหม่ได้ทันที</p>
        </div>
      </motion.div>

      {/* Price Calculation */}
      <AnimatePresence>
        {priceCalculation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-xl border border-amber-100 bg-amber-50/50 p-4"
          >
            <h4 className="mb-3 text-sm font-semibold text-amber-900">สรุปการคำนวณราคา</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-800">ราคาเครื่องใหม่</span>
                <span className="font-semibold text-amber-900">{THB(priceCalculation.newDevicePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800">หัก มูลค่าเครื่องเก่า</span>
                <span className="font-semibold text-green-600">- {THB(priceCalculation.tradeInValue)}</span>
              </div>
              <div className="my-2 border-t border-amber-200/50" />
              <div className="flex justify-between">
                <span className="font-bold text-amber-900">ยอดที่ต้องจ่ายเพิ่ม</span>
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-2xl font-bold text-transparent">
                  {THB(priceCalculation.additionalPayment)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
        className="space-y-6"
      >
        <motion.div variants={formVariants} className="space-y-6">
          {/* sparkle icon + bigger title */}
          <div className="flex w-full items-center justify-center gap-3">
            <Label className="text-lg font-bold text-black">เลือกเครื่องใหม่ที่ใช่สำหรับคุณ</Label>
          </div>

          {/* 2. เลือกเครื่องมือ 1 มือ 2 */}
          <div className="space-y-3">
            <Label>สภาพเครื่องที่คุณต้องการ</Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => handleInputChange("phoneCondition", "first_hand")}
                className={`h-14 rounded-xl border text-base font-semibold ${
                  formState.phoneCondition === "first_hand"
                    ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  มือหนึ่ง (เครื่องใหม่)
                </div>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                onClick={() => handleInputChange("phoneCondition", "second_hand")}
                className={`h-14 rounded-xl border text-base font-semibold ${
                  formState.phoneCondition === "second_hand"
                    ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCcw className="h-5 w-5" />
                  มือสอง (สภาพดี)
                </div>
              </motion.button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="newDevice-tradein">รุ่นเครื่อง</Label>
            <Select value={formState.newDevice} onValueChange={(value) => handleInputChange("newDevice", value)}>
              <SelectTrigger id="newDevice-tradein" className="h-14 w-full">
                <SelectValue placeholder="เลือกเครื่องที่ต้องการ" />
              </SelectTrigger>
              <SelectContent>
                {newDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{device.name}</span>
                      <span className="text-muted-foreground text-xs">{THB(device.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 1. เลือกความจุและสีของเครื่องใหม่ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="storage-tradein">ความจุ</Label>
              <Select value={formState.storage} onValueChange={(value) => handleInputChange("storage", value)}>
                <SelectTrigger id="storage-tradein" className="h-14 w-full">
                  <SelectValue placeholder="เลือกความจุ" />
                </SelectTrigger>
                <SelectContent>
                  {storageOptions.map((storage) => (
                    <SelectItem key={storage} value={storage}>
                      {storage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="color-tradein">สี</Label>
              <Select value={formState.color} onValueChange={(value) => handleInputChange("color", value)}>
                <SelectTrigger id="color-tradein" className="h-14 w-full">
                  <SelectValue placeholder="เลือกสี" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">กรอกข้อมูลส่วนตัว</Label>
          <div className="space-y-2">
            <Label htmlFor="customerName-tradein">ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-tradein"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-tradein">เบอร์โทรศัพท์ติดต่อ</Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="phone-tradein"
                type="tel"
                placeholder="0xx-xxx-xxxx"
                value={formState.phone}
                readOnly
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className="h-12 pl-10 pr-12"
              />
              <button
                type="button"
                onClick={handleEditPhoneClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border bg-white p-2 text-slate-600 hover:bg-slate-50"
                aria-label="แก้ไขเบอร์โทรศัพท์"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">เลือกสาขาและเวลานัดรับเครื่อง</Label>
          <div className="space-y-2">
            <Label htmlFor="store-branch-tradein">สาขา</Label>
            <Select
              value={formState.storeLocation}
              onValueChange={(value) => handleInputChange("storeLocation", value)}
            >
              <SelectTrigger id="store-branch-tradein" className="h-12 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {storeLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* ✨ ใช้คอมโพเนนต์ DateTimeSelect แบบรวม วัน+เวลา และบังคับเลือกวันก่อน */}
          <div className="grid grid-cols-1 gap-4">
            <DateTimeSelect
              serviceType="บริการขายทันที"
              serviceData={formState}
              dateValue={formState.appointmentDate}
              onDateChange={(value) => handleInputChange("appointmentDate", value)}
              timeValue={formState.appointmentTime}
              onTimeChange={(value) => handleInputChange("appointmentTime", value)}
              className="w-full"
              labelDate="วัน"
              labelTime="เวลา"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3 },
        }}
        className="space-y-4 pt-4"
      >
        <FramerButton
          size="lg"
          disabled={!isFormComplete || updateAssessment.isPending}
          className="h-14 w-full"
          onClick={handleConfirmTradeIn}
        >
          {updateAssessment.isPending ? "กำลังบันทึก..." : "ยืนยันการแลกเปลี่ยนเครื่อง"}
        </FramerButton>
        <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
          การคลิก &quot;ยืนยันการแลกเปลี่ยนเครื่อง&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ
          และยอมรับใน{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
          >
            ข้อตกลงและเงื่อนไขการใช้บริการ
          </a>
        </p>
      </motion.div>
    </main>
  );
}
