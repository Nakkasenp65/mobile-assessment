// src/app/assess/components/(step3)/(services)/SellNowService.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { DeviceInfo } from "../../../page";
import { Store, User, Phone, Home, Train, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FramerButton from "@/components/ui/framer/FramerButton";

// Interface สำหรับ Props ที่ Component นี้ต้องการ
interface SellNowServiceProps {
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

const btsMrtData = {
  "BTS - สายสุขุมวิท": ["สยาม", "ชิดลม", "เพลินจิต", "นานา", "อโศก", "พร้อมพงษ์"],
  "BTS - สายสีลม": ["สยาม", "ศาลาแดง", "ช่องนนทรี", "สุรศักดิ์", "สะพานตากสิน"],
  "MRT - สายสีน้ำเงิน": ["สุขุมวิท", "เพชรบุรี", "พระราม 9", "ศูนย์วัฒนธรรมฯ", "สีลม"],
};

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

// Helper function for currency formatting
const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const SellNowService = ({ service, theme, isSelected }: SellNowServiceProps) => {
  const { id, title, description, icon: Icon, price: sellPrice } = service;

  const [locationType, setLocationType] = useState<"home" | "bts" | "store" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    address: "",
    province: "BKK",
    district: "PHN",
    btsStation: "",
    storeLocation: storeLocations[0],
    date: "",
    time: "",
    termsAccepted: false,
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Structural Integrity Enhancement: Centralized handler for location type changes.
  // This prevents stale state by resetting irrelevant fields, ensuring data consistency.
  const handleLocationTypeChange = (newLocationType: "home" | "bts" | "store") => {
    setLocationType(newLocationType);

    // Reset conditional form fields to maintain state integrity
    setFormState((prev) => ({
      ...prev,
      address: "",
      btsStation: "",
    }));

    // Reset dependent state
    setSelectedBtsLine("");
  };

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.date &&
    formState.time &&
    formState.termsAccepted &&
    locationType !== null &&
    (locationType === "home"
      ? formState.address
      : locationType === "bts"
        ? formState.btsStation
        : locationType === "store"
          ? true
          : false);

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
        isSelected ? `${theme.borderColor} ${theme.soft} ${theme.ring} ring-2` : ` ${theme.ring} `,
      )}
    >
      <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
        <div className="flex w-full items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 shadow-sm dark:bg-zinc-800",
            )}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 text-left">
            <h4 className="text-foreground font-semibold">{title}</h4>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          <div className="ml-2 text-right">
            <p className="text-foreground text-lg font-bold">{THB(sellPrice)}</p>
          </div>
        </div>
      </AccordionTrigger>

      {/* Information Hierarchy Enhancement: Benefits are displayed immediately upon selection, before form expansion. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mb-4 rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50/75 to-orange-500/25 p-4"
      >
        <ul className="text-pink-800 dark:text-pink-200">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600 dark:text-pink-400" />
            <span>รับเงินสดทันทีภายใน 30 นาที</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600 dark:text-pink-400" />
            <span>ไม่มีค่าธรรมเนียมแอบแฝง</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600 dark:text-pink-400" />
            <span>บริการล้างข้อมูลและ iCloud ให้ฟรี</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-600 dark:text-pink-400" />
            <span>มีออฟชั่นซื้อเครื่องคืนภายใน 7 วัน</span>
          </li>
        </ul>
      </motion.div>

      <AccordionContent className="px-4 pb-4">
        <div className="mt-2 space-y-6 border-t pt-4 dark:border-zinc-700/50">
          {/* Price Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-orange-50 via-pink-50 to-white p-6 text-center shadow-lg dark:border-pink-400/30 dark:from-orange-400/10 dark:via-pink-400/10"
          >
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-pink-100/50 blur-2xl dark:bg-pink-400/20" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl dark:bg-orange-400/20" />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                ยอดเงินที่คุณจะได้รับ
              </h3>
              <p className="mt-2 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-pink-400 dark:to-orange-400">
                {THB(sellPrice)}
              </p>
              <p className="mt-2 text-sm text-pink-800/80 dark:text-pink-200/80">
                รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น
              </p>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-6"
          >
            {/* Step 1: Customer Details */}
            <motion.div variants={formVariants} className="space-y-4">
              <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>

              <div className="space-y-2">
                {/* Component Instance Fortification: Using dynamic ID to prevent DOM collisions. */}
                <Label htmlFor={`customerName-${id}`}>ชื่อ-นามสกุล</Label>
                <div className="relative">
                  <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id={`customerName-${id}`}
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={formState.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`phone-${id}`}>เบอร์โทรศัพท์ติดต่อ</Label>
                <div className="relative">
                  <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id={`phone-${id}`}
                    type="tel"
                    placeholder="0xx-xxx-xxxx"
                    value={formState.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>

            {/* Step 2: Location Selection */}
            <motion.div variants={formVariants}>
              <Label className="mb-3 block text-lg font-semibold">เลือกสถานที่รับซื้อ</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={locationType === "home" ? "default" : "outline"}
                  onClick={() => handleLocationTypeChange("home")}
                  className="flex h-auto flex-col items-center gap-2 py-4"
                >
                  <Home className="h-6 w-6" />
                  <span className="text-xs">รับซื้อถึงบ้าน</span>
                </Button>
                <Button
                  type="button"
                  variant={locationType === "bts" ? "default" : "outline"}
                  onClick={() => handleLocationTypeChange("bts")}
                  className="flex h-auto flex-col items-center gap-2 py-4"
                >
                  <Train className="h-6 w-6" />
                  <span className="text-xs">BTS/MRT</span>
                </Button>
                <Button
                  type="button"
                  variant={locationType === "store" ? "default" : "outline"}
                  onClick={() => handleLocationTypeChange("store")}
                  className="flex h-auto flex-col items-center gap-2 py-4"
                >
                  <Store className="h-6 w-6" />
                  <span className="text-xs">รับซื้อที่ร้าน</span>
                </Button>
              </div>
            </motion.div>

            {/* Step 3: Location Details (Conditional) */}
            <AnimatePresence mode="wait">
              {locationType && (
                <motion.div
                  key={locationType}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                  <Label className="block text-lg font-semibold">ระบุรายละเอียดสถานที่</Label>

                  {locationType === "home" && (
                    <motion.div key="home-form" variants={formVariants} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`address-${id}`}>ที่อยู่</Label>
                        <p className="text-sm font-bold text-red-600">
                          *หากต้องการขายด่วนภายในวันนี้ กรุณาติดต่อ 098-950-9222
                        </p>
                        <Textarea
                          id={`address-${id}`}
                          placeholder="กรอกที่อยู่โดยละเอียด"
                          value={formState.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`province-${id}`}>จังหวัด</Label>
                          <Select
                            value={formState.province}
                            onValueChange={(value) => handleInputChange("province", value)}
                          >
                            <SelectTrigger id={`province-${id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BKK">กรุงเทพมหานคร</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`district-${id}`}>เขต</Label>
                          <Select
                            value={formState.district}
                            onValueChange={(value) => handleInputChange("district", value)}
                          >
                            <SelectTrigger id={`district-${id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PHN">เขตพระนคร</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {locationType === "bts" && (
                    <motion.div key="bts-form" variants={formVariants} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`bts-line-${id}`}>สายรถไฟ BTS/MRT</Label>
                          <Select onValueChange={setSelectedBtsLine}>
                            <SelectTrigger id={`bts-line-${id}`} className="w-full">
                              <SelectValue placeholder="เลือกสายรถไฟ" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(btsMrtData).map((line) => (
                                <SelectItem key={line} value={line}>
                                  {line}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`bts-station-${id}`}>ระบุสถานี</Label>
                          <Select
                            disabled={!selectedBtsLine}
                            onValueChange={(value) => handleInputChange("btsStation", value)}
                          >
                            <SelectTrigger id={`bts-station-${id}`} className="w-full">
                              <SelectValue placeholder="เลือกสถานี" />
                            </SelectTrigger>
                            <SelectContent>
                              {(btsMrtData[selectedBtsLine as keyof typeof btsMrtData] || []).map(
                                (station) => (
                                  <SelectItem key={station} value={station}>
                                    {station}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {locationType === "store" && (
                    <motion.div key="store-form" variants={formVariants} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`store-branch-${id}`}>สาขา</Label>
                        <Select
                          value={formState.storeLocation}
                          onValueChange={(value) => handleInputChange("storeLocation", value)}
                        >
                          <SelectTrigger id={`store-branch-${id}`} className="w-full">
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
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Date & Time */}
            <motion.div variants={formVariants} className="space-y-4">
              <Label className="block text-lg font-semibold">เลือกวันและเวลาที่สะดวก</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`date-${id}`}>วัน</Label>
                  <Select onValueChange={(value) => handleInputChange("date", value)}>
                    <SelectTrigger id={`date-${id}`} className="w-full">
                      <SelectValue placeholder="เลือกวัน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">วันนี้</SelectItem>
                      <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`time-${id}`}>เวลา</Label>
                  <Select onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger id={`time-${id}`} className="w-full">
                      <SelectValue placeholder="เลือกเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-12">09:00 - 12:00</SelectItem>
                      <SelectItem value="13-17">13:00 - 17:00</SelectItem>
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
            className="space-y-6 pt-4"
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id={`terms-${id}`}
                checked={formState.termsAccepted}
                onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
                className="mt-1"
              />
              <label
                htmlFor={`terms-${id}`}
                className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ฉันยืนยันว่าข้อมูลข้างต้นเป็นความจริง และยอมรับ{" "}
                <a href="#" className="text-blue-600 underline dark:text-blue-400">
                  ข้อตกลงและเงื่อนไขการขายสินค้า
                </a>
              </label>
            </div>
            <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
              ยืนยันการขายและรับเงินทันที
            </FramerButton>
          </motion.div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SellNowService;
