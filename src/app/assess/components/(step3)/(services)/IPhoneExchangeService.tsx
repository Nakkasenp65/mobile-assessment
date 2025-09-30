// src/app/assess/components/(step3)/(services)/iPhoneExchangeService.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { DeviceInfo } from "../../../page";
import {
  Store,
  User,
  Phone,
  Sparkles,
  Home,
  Train,
  Check,
  Repeat,
  Wallet,
  CalendarDays,
  Cloud,
} from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";

interface iPhoneExchangeServiceProps {
  deviceInfo: DeviceInfo;
  exchangePrice: number;
}

const btsMrtData = {
  "BTS - สายสุขุมวิท": [
    "สยาม",
    "ชิดลม",
    "เพลินจิต",
    "นานา",
    "อโศก",
    "พร้อมพงษ์",
  ],
  "BTS - สายสีลม": [
    "สยาม",
    "ศาลาแดง",
    "ช่องนนทรี",
    "สุรศักดิ์",
    "สะพานตากสิน",
  ],
  "MRT - สายสีน้ำเงิน": [
    "สุขุมวิท",
    "เพชรบุรี",
    "พระราม 9",
    "ศูนย์วัฒนธรรมฯ",
    "สีลม",
  ],
};

const storeLocations = [
  "สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)",
];
const SERVICE_FEE_RATE = 0.15; // 15%

const IPhoneExchangeService = ({
  deviceInfo,
  exchangePrice,
}: iPhoneExchangeServiceProps) => {
  const [locationType, setLocationType] = useState<
    "store" | "bts"
  >("store");
  const [selectedBtsLine, setSelectedBtsLine] =
    useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    btsStation: "",
    storeLocation: storeLocations[0],
    date: "",
    time: "",
    termsAccepted: false,
  });

  const handleInputChange = (
    field: keyof typeof formState,
    value: any,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const { feeAmount, netAmount } = useMemo(() => {
    const fee = exchangePrice * SERVICE_FEE_RATE;
    const net = exchangePrice - fee;
    return { feeAmount: fee, netAmount: net };
  }, [exchangePrice]);

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.date &&
    formState.time &&
    formState.termsAccepted &&
    (locationType === "bts" ? formState.btsStation : true);

  const THB = (n: number) =>
    n.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    });

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <main className="w-full space-y-6 pt-4">
      {/* Price Calculation Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6 text-center shadow-lg dark:border-green-400/30 dark:from-green-400/10 dark:via-emerald-400/10"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-green-100/50 blur-2xl dark:bg-green-400/20" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-400/20" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
            สรุปบริการไอโฟนแลกเงิน
          </h3>
          <div className="space-y-2 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-green-800 dark:text-green-200">
                วงเงินสูงสุด
              </span>
              <span className="font-semibold text-green-900 dark:text-green-100">
                {THB(exchangePrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-800 dark:text-green-200">
                หัก ค่าบริการรอบแรก (15%)
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                - {THB(feeAmount)}
              </span>
            </div>
          </div>
          <div className="my-3 border-t border-green-200/50 dark:border-green-400/30" />
          <div className="text-center">
            <p className="text-sm text-green-800 dark:text-green-200">
              ยอดเงินที่จะได้รับทันที
            </p>
            <p className="mt-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-green-400 dark:to-emerald-400">
              {THB(netAmount)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-green-100 bg-green-50/50 p-4 dark:border-green-400/30 dark:bg-green-400/10"
      >
        <h4 className="mb-3 text-sm font-semibold text-green-900 dark:text-green-100">
          เงื่อนไขบริการ
        </h4>
        <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
          <li className="flex items-start gap-2">
            <Wallet className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
            <span>รับเงินสดทันทีหลังส่งมอบเครื่อง</span>
          </li>
          <li className="flex items-start gap-2">
            <Repeat className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
            <span>
              ต่อรอบได้ทุก 10 วัน โดยชำระค่าบริการ 15%
              ของวงเงิน
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Cloud className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
            <span>ใช้ iCloud ตัวเองไม่ติดไอคลาวร้าน</span>
          </li>
        </ul>
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
        {/* Step 1: Location Selection */}
        <motion.div variants={formVariants}>
          <Label className="mb-3 block text-lg font-semibold">
            1. เลือกสถานที่ส่งมอบเครื่อง
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={
                locationType === "store"
                  ? "default"
                  : "outline"
              }
              onClick={() => setLocationType("store")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Store className="h-6 w-6" />
              <span className="text-xs">ที่ร้าน</span>
            </Button>
            <Button
              type="button"
              variant={
                locationType === "bts"
                  ? "default"
                  : "outline"
              }
              onClick={() => setLocationType("bts")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Train className="h-6 w-6" />
              <span className="text-xs">BTS/MRT</span>
            </Button>
          </div>
        </motion.div>

        {/* Step 2: Personal Info & Location Details */}
        <motion.div
          variants={formVariants}
          className="space-y-4"
        >
          <Label className="block text-lg font-semibold">
            2. กรอกข้อมูลและรายละเอียด
          </Label>
          {/* Customer Details */}
          <div className="space-y-2">
            <Label htmlFor="customerName-exchange">
              ชื่อ-นามสกุล
            </Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-exchange"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) =>
                  handleInputChange(
                    "customerName",
                    e.target.value,
                  )
                }
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-exchange">
              เบอร์โทรศัพท์ติดต่อ
            </Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="phone-exchange"
                type="tel"
                placeholder="0xx-xxx-xxxx"
                value={formState.phone}
                onChange={(e) =>
                  handleInputChange("phone", e.target.value)
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={locationType}
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 pt-2"
            >
              {locationType === "bts" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bts-line-exchange">
                      สายรถไฟ BTS/MRT
                    </Label>
                    <Select
                      onValueChange={setSelectedBtsLine}
                    >
                      <SelectTrigger
                        id="bts-line-exchange"
                        className="w-full"
                      >
                        <SelectValue placeholder="เลือกสายรถไฟ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(btsMrtData).map(
                          (line) => (
                            <SelectItem
                              key={line}
                              value={line}
                            >
                              {line}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bts-station-exchange">
                      ระบุสถานี
                    </Label>
                    <Select
                      disabled={!selectedBtsLine}
                      onValueChange={(value) =>
                        handleInputChange(
                          "btsStation",
                          value,
                        )
                      }
                    >
                      <SelectTrigger
                        id="bts-station-exchange"
                        className="w-full"
                      >
                        <SelectValue placeholder="เลือกสถานี" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          btsMrtData[
                            selectedBtsLine as keyof typeof btsMrtData
                          ] || []
                        ).map((station) => (
                          <SelectItem
                            key={station}
                            value={station}
                          >
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {locationType === "store" && (
                <div className="space-y-2">
                  <Label htmlFor="store-branch-exchange">
                    สาขา
                  </Label>
                  <Select
                    value={formState.storeLocation}
                    onValueChange={(value) =>
                      handleInputChange(
                        "storeLocation",
                        value,
                      )
                    }
                  >
                    <SelectTrigger
                      id="store-branch-exchange"
                      className="w-full"
                    >
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
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Step 3: Date & Time */}
        <motion.div
          variants={formVariants}
          className="space-y-4"
        >
          <Label className="block text-lg font-semibold">
            3. เลือกวันและเวลานัดหมาย
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-exchange">วัน</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("date", value)
                }
              >
                <SelectTrigger
                  id="date-exchange"
                  className="w-full"
                >
                  <SelectValue placeholder="เลือกวัน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">
                    วันนี้
                  </SelectItem>
                  <SelectItem value="tomorrow">
                    พรุ่งนี้
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-exchange">เวลา</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("time", value)
                }
              >
                <SelectTrigger
                  id="time-exchange"
                  className="w-full"
                >
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11-14">
                    11:00 - 14:00
                  </SelectItem>
                  <SelectItem value="14-17">
                    14:00 - 17:00
                  </SelectItem>
                  <SelectItem value="17-20">
                    17:00 - 20:00
                  </SelectItem>
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
            id="terms-exchange"
            checked={formState.termsAccepted}
            onCheckedChange={(checked) =>
              handleInputChange(
                "termsAccepted",
                Boolean(checked),
              )
            }
            className="mt-1"
          />
          <label
            htmlFor="terms-exchange"
            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ฉันยอมรับ{" "}
            <a
              href="#"
              className="text-blue-600 underline dark:text-blue-400"
            >
              ข้อตกลงและเงื่อนไข
            </a>{" "}
            สำหรับบริการไอโฟนแลกเงิน และค่าบริการ 15% ต่อรอบ
            10 วัน
          </label>
        </div>
        <FramerButton
          size="lg"
          disabled={!isFormComplete}
          className="h-14 w-full"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          ยืนยันและนัดหมาย
        </FramerButton>
      </motion.div>
    </main>
  );
};

export default IPhoneExchangeService;
