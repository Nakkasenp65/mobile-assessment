// src/app/assess/components/(step3)/(services)/TradeInService.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceInfo } from "../../../page";
import {
  Store,
  User,
  Phone,
  Check,
  Smartphone,
  Handshake, // Icon for Trade-in
  LucideIcon,
  TabletSmartphoneIcon,
} from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { cn } from "@/lib/utils";

// --- Interfaces ---

interface TradeInServiceProps {
  deviceInfo: DeviceInfo;
  service: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    price: number;
  };
  theme: {
    text: string;
    borderColor: string;
    soft: string;
    ring: string;
  };
  isSelected: boolean;
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

// --- Helper Functions ---

const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

// --- Main Component ---

const TradeInService = ({ deviceInfo, service, theme, isSelected }: TradeInServiceProps) => {
  const { id, title, description, icon: Icon, price: tradeInPrice } = service;

  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    storeLocation: storeLocations[0],
    newDevice: "",
    storage: "",
    color: "",
    appointmentDate: "",
    appointmentTime: "",
    termsAccepted: false,
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const priceCalculation = useMemo(() => {
    const selectedDevice = newDevices.find((d) => d.id === formState.newDevice);
    if (!selectedDevice) return null;

    const additionalPrice = selectedDevice.price - tradeInPrice;
    return {
      newDevicePrice: selectedDevice.price,
      tradeInValue: tradeInPrice,
      additionalPayment: additionalPrice,
    };
  }, [formState.newDevice, tradeInPrice]);

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.newDevice &&
    formState.storage &&
    formState.color &&
    formState.appointmentDate &&
    formState.appointmentTime &&
    formState.termsAccepted;

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AccordionItem
      value={id}
      className={cn(
        "rounded-2xl border shadow-sm transition-all duration-300 ease-in-out",
        isSelected
          ? `${theme.borderColor} ${theme.soft} ${theme.ring} ring-2`
          : "border-border bg-card",
      )}
    >
      <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
        <div className="flex w-full items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm dark:bg-zinc-800",
            )}
          >
            <TabletSmartphoneIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-foreground font-semibold">{title}</h4>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="ml-2 text-right">
            <p className="text-foreground text-lg font-bold">{THB(tradeInPrice)}</p>
          </div>
        </div>
      </AccordionTrigger>
      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mb-4 rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50/50 to-cyan-400/50 p-4"
      >
        <h4 className="mb-3 text-sm font-semibold text-cyan-900">สิทธิประโยชน์ที่คุณได้รับ</h4>
        <ul className="space-y-2 text-sm text-cyan-800">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
            <span>ลดราคาเครื่องใหม่ทันที ไม่ต้องรอ</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
            <span>ประเมินราคายุติธรรม โปร่งใส</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
            <span>รับประกันเครื่องใหม่ 1 ปีเต็ม</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
            <span>ย้ายข้อมูลให้ฟรี ไม่มีค่าใช้จ่าย</span>
          </li>
        </ul>
      </motion.div>
      <AccordionContent className="px-4 pb-4">
        <div className="mt-2 w-full space-y-6 border-t pt-4 dark:border-zinc-700/50">
          {/* Trade-In Value Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-blue-50 to-white p-6 text-center shadow-lg"
          >
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-100/50 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-100/50 blur-2xl" />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-cyan-900">มูลค่าเครื่องเก่าของคุณ</h3>
              <p className="mt-2 bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                {THB(tradeInPrice)}
              </p>
              <p className="mt-2 text-sm text-cyan-800/80">
                ใช้ส่วนลดสำหรับซื้อเครื่องใหม่ได้ทันที
              </p>
            </div>
          </motion.div>

          {/* Price Calculation */}
          <AnimatePresence>
            {priceCalculation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-cyan-100 bg-cyan-50/50 p-4"
              >
                <h4 className="mb-3 text-sm font-semibold text-cyan-900">สรุปการคำนวณราคา</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cyan-800">ราคาเครื่องใหม่</span>
                    <span className="font-semibold text-cyan-900">
                      {THB(priceCalculation.newDevicePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-800">หัก มูลค่าเครื่องเก่า</span>
                    <span className="font-semibold text-green-600">
                      - {THB(priceCalculation.tradeInValue)}
                    </span>
                  </div>
                  <div className="my-2 border-t border-cyan-200/50" />
                  <div className="flex justify-between">
                    <span className="font-bold text-cyan-900">ยอดที่ต้องจ่ายเพิ่ม</span>
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
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
                <Select
                  value={formState.newDevice}
                  onValueChange={(value) => handleInputChange("newDevice", value)}
                >
                  <SelectTrigger id="newDevice-tradein" className="w-full">
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
                  <Select
                    value={formState.storage}
                    onValueChange={(value) => handleInputChange("storage", value)}
                  >
                    <SelectTrigger id="storage-tradein" className="w-full">
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
                  <Select
                    value={formState.color}
                    onValueChange={(value) => handleInputChange("color", value)}
                  >
                    <SelectTrigger id="color-tradein" className="w-full">
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
                    className="pl-10"
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
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={formVariants} className="space-y-4">
              <Label className="block text-lg font-semibold">
                3. เลือกสาขาและเวลานัดรับเครื่อง
              </Label>
              <div className="space-y-2">
                <Label htmlFor="store-branch-tradein">สาขา</Label>
                <Select
                  value={formState.storeLocation}
                  onValueChange={(value) => handleInputChange("storeLocation", value)}
                >
                  <SelectTrigger id="store-branch-tradein" className="w-full">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-tradein">วัน</Label>
                  <Select
                    value={formState.appointmentDate}
                    onValueChange={(value) => handleInputChange("appointmentDate", value)}
                  >
                    <SelectTrigger id="date-tradein" className="w-full">
                      <SelectValue placeholder="เลือกวัน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">วันนี้</SelectItem>
                      <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-tradein">เวลา</Label>
                  <Select
                    value={formState.appointmentTime}
                    onValueChange={(value) => handleInputChange("appointmentTime", value)}
                  >
                    <SelectTrigger id="time-tradein" className="w-full">
                      <SelectValue placeholder="เลือกเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="11-14">11:00 - 14:00</SelectItem>
                      <SelectItem value="14-17">14:00 - 17:00</SelectItem>
                      <SelectItem value="17-20">17:00 - 20:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 },
            }}
            className="space-y-6 pt-4"
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-tradein"
                checked={formState.termsAccepted}
                onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
                className="mt-1"
              />
              <label
                htmlFor="terms-tradein"
                className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ฉันยอมรับ{" "}
                <a href="#" className="text-blue-600 underline">
                  ข้อตกลงและเงื่อนไข
                </a>{" "}
                สำหรับบริการแลกเปลี่ยนเครื่องใหม่
              </label>
            </div>
            <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
              ยืนยันการแลกเปลี่ยนเครื่อง
            </FramerButton>
          </motion.div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TradeInService;
