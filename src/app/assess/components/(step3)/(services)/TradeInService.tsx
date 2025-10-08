// src/app/assess/components/(step3)/(services)/TradeInService.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeviceInfo } from "../../../../../types/device";
import { User, Phone } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { DateSelect } from "@/components/ui/date-select"; // ✨ 1. Import DateSelect

interface TradeInServiceProps {
  deviceInfo: DeviceInfo;
  tradeInPrice: number;
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

const TradeInService = ({ deviceInfo, tradeInPrice }: TradeInServiceProps) => {
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    storeLocation: storeLocations[0],
    newDevice: "",
    storage: "",
    color: "",
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

  return (
    <main className="w-full space-y-6 pt-4">
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
        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">1. เลือกเครื่องใหม่ที่ต้องการ</Label>
          <div className="space-y-2">
            <Label htmlFor="newDevice-tradein">รุ่นเครื่อง</Label>
            <Select value={formState.newDevice} onValueChange={(value) => handleInputChange("newDevice", value)}>
              <SelectTrigger id="newDevice-tradein" className="h-12 w-full">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storage-tradein">ความจุ</Label>
              <Select value={formState.storage} onValueChange={(value) => handleInputChange("storage", value)}>
                <SelectTrigger id="storage-tradein" className="h-12 w-full">
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
            <div className="space-y-2">
              <Label htmlFor="color-tradein">สี</Label>
              <Select value={formState.color} onValueChange={(value) => handleInputChange("color", value)}>
                <SelectTrigger id="color-tradein" className="h-12 w-full">
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
          <Label className="block text-lg font-semibold">2. กรอกข้อมูลส่วนตัว</Label>
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
                onChange={(e) => handleInputChange("phone", e.target.value)}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className="h-12 pl-10"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">3. เลือกสาขาและเวลานัดรับเครื่อง</Label>
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
          {/* ✨ 3. แก้ไขส่วนเลือกวันและเวลาทั้งหมด */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-tradein">วัน</Label>
              <DateSelect
                value={formState.appointmentDate}
                onValueChange={(value) => handleInputChange("appointmentDate", value)}
                className="h-12 w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-tradein">เวลา</Label>
              <Select
                value={formState.appointmentTime}
                onValueChange={(value) => handleInputChange("appointmentTime", value)}
              >
                <SelectTrigger id="time-tradein" className="h-12 w-full">
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
          ยืนยันการแลกเปลี่ยนเครื่อง
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
};

export default TradeInService;
