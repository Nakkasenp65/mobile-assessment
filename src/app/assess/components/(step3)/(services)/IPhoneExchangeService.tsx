// src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceInfo } from "../../../page";
import { Store, User, Phone, Train, Repeat, Wallet, Cloud } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";

// Interface for Component Props
interface IPhoneExchangeServiceProps {
  deviceInfo: DeviceInfo;
  exchangePrice: number;
}

const btsMrtData = {
  "BTS - สายสุขุมวิท": ["สยาม", "ชิดลม", "เพลินจิต", "นานา", "อโศก", "พร้อมพงษ์"],
  "BTS - สายสีลม": ["สยาม", "ศาลาแดง", "ช่องนนทรี", "สุรศักดิ์", "สะพานตากสิน"],
  "MRT - สายสีน้ำเงิน": ["สุขุมวิท", "เพชรบุรี", "พระราม 9", "ศูนย์วัฒนธรรมฯ", "สีลม"],
};

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];
const SERVICE_FEE_RATE = 0.15; // 15%

// Helper function for currency formatting
const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const IPhoneExchangeService = ({ deviceInfo, exchangePrice }: IPhoneExchangeServiceProps) => {
  const [locationType, setLocationType] = useState<"store" | "bts" | null>(null);
  const [selectedBtsLine, setSelectedBtsLine] = useState("");
  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    btsStation: "",
    storeLocation: storeLocations[0],
    date: "",
    time: "",
    // CHIRON: Forensic Linguist - ลบ `termsAccepted` ออกจาก state
  });

  const handleInputChange = (field: keyof typeof formState, value: any) => {
    // CHIRON: Counter-intelligence Analyst - ดักจับและกรองข้อมูลที่ไม่ใช่ตัวเลขสำหรับเบอร์โทรศัพท์
    if (field === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationTypeChange = (newLocationType: "store" | "bts") => {
    setLocationType(newLocationType);
    setFormState((prev) => ({
      ...prev,
      btsStation: "",
    }));
    setSelectedBtsLine("");
  };

  const { feeAmount, netAmount } = useMemo(() => {
    const fee = exchangePrice * SERVICE_FEE_RATE;
    const net = exchangePrice - fee;
    return { feeAmount: fee, netAmount: net };
  }, [exchangePrice]);

  // CHIRON: Structural Engineer - ปรับแก้ตรรกะการตรวจสอบความสมบูรณ์ของฟอร์ม
  const isFormComplete =
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.date &&
    formState.time &&
    locationType !== null &&
    (locationType === "bts" ? formState.btsStation : locationType === "store" ? true : false);

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  useEffect(() => {
    scrollTo(0, 0);
  });

  return (
    <main className="w-full space-y-6">
      <div className="space-y-6 pt-4 dark:border-zinc-700/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6 shadow-lg dark:border-green-400/30 dark:from-green-400/10 dark:via-emerald-400/10"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-green-100/50 blur-2xl dark:bg-green-400/20" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl dark:bg-emerald-400/20" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-center text-lg font-semibold text-green-900 dark:text-green-100">
              สรุปบริการไอโฟนแลกเงิน
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">วงเงินสูงสุด</span>
                <span className="font-semibold text-green-900 dark:text-green-100">
                  {THB(exchangePrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800 dark:text-green-200">ค่าบริการรอบแรก (15%)</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  - {THB(feeAmount)}
                </span>
              </div>
            </div>
            <div className="!my-3 border-t border-green-200/50 dark:border-green-400/30" />
            <div className="text-center">
              <p className="text-sm text-green-800 dark:text-green-200">ยอดเงินที่จะได้รับทันที</p>
              <p className="mt-1 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-green-400 dark:to-emerald-400">
                {THB(netAmount)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
          className="space-y-6"
        >
          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>
            <div className="space-y-2">
              <Label htmlFor={`customerName-exchange`}>ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id={`customerName-exchange`}
                  placeholder="กรอกชื่อ-นามสกุล"
                  value={formState.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`phone-exchange`}>เบอร์โทรศัพท์ติดต่อ</Label>
              <div className="relative">
                <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                {/* CHIRON: Structural Engineer - บังคับใช้ "สัญญาอินพุต" ตามกฎที่กำหนด */}
                <Input
                  id={`phone-exchange`}
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  value={formState.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={formVariants} className="space-y-4">
            <Label className="mb-3 block text-lg font-semibold">เลือกสถานที่ส่งมอบเครื่อง</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={locationType === "store" ? "default" : "outline"}
                onClick={() => handleLocationTypeChange("store")}
                className="flex h-auto flex-col items-center gap-2 py-4"
              >
                <Store className="h-6 w-6" />
                <span className="text-xs">ที่ร้าน</span>
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
            </div>

            <AnimatePresence mode="wait">
              {locationType && (
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
                        <Label htmlFor={`bts-line-exchange`}>สายรถไฟ BTS/MRT</Label>
                        <Select onValueChange={setSelectedBtsLine}>
                          <SelectTrigger id={`bts-line-exchange`} className="w-full">
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
                        <Label htmlFor={`bts-station-exchange`}>ระบุสถานี</Label>
                        <Select
                          disabled={!selectedBtsLine}
                          onValueChange={(value) => handleInputChange("btsStation", value)}
                        >
                          <SelectTrigger id={`bts-station-exchange`} className="w-full">
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
                  )}

                  {locationType === "store" && (
                    <div className="space-y-2">
                      <Label htmlFor={`store-branch-exchange`}>สาขา</Label>
                      <Select
                        value={formState.storeLocation}
                        onValueChange={(value) => handleInputChange("storeLocation", value)}
                      >
                        <SelectTrigger id={`store-branch-exchange`} className="w-full">
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
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={formVariants} className="space-y-4">
            <Label className="block text-lg font-semibold">เลือกวันและเวลานัดหมาย</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`date-exchange`}>วัน</Label>
                <Select onValueChange={(value) => handleInputChange("date", value)}>
                  <SelectTrigger id={`date-exchange`} className="w-full">
                    <SelectValue placeholder="เลือกวัน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">วันนี้</SelectItem>
                    <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`time-exchange`}>เวลา</Label>
                <Select onValueChange={(value) => handleInputChange("time", value)}>
                  <SelectTrigger id={`time-exchange`} className="w-full">
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
          className="space-y-4 pt-4"
        >
          <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
            ยืนยันและนัดหมาย
          </FramerButton>
          {/* CHIRON: Forensic Linguist - เปลี่ยนกลไกการยอมรับเงื่อนไข */}
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
            การคลิก &quot;ยืนยันและนัดหมาย&quot;
            ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน{" "}
            <a
              href="#" // CHIRON: ควรเปลี่ยนเป็นลิงก์ไปยังหน้าข้อตกลงจริง
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-green-600 underline hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              ข้อตกลงและเงื่อนไขการใช้บริการ
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default IPhoneExchangeService;
