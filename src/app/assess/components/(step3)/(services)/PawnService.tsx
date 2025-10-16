// src/app/assess/step3/(services)/PawnService.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DeviceInfo } from "../../../../../types/device";
import { Store, User, Phone, Home, Train, Check } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { useRouter } from "next/navigation";
import DateTimeSelect from "@/components/ui/DateTimeSelect";

const btsMrtData = {
  "BTS - สายสุขุมวิท": ["สยาม", "ชิดลม", "เพลินจิต", "นานา", "อโศก", "พร้อมพงษ์"],
  "BTS - สายสีลม": ["สยาม", "ศาลาแดง", "ช่องนนทรี", "สุรศักดิ์", "สะพานตากสิน"],
  "MRT - สายสีน้ำเงิน": ["สุขุมวิท", "เพชรบุรี", "พระราม 9", "ศูนย์วัฒนธรรมฯ", "สีลม"],
};

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

interface PawnServiceProps {
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

export default function PawnService({ deviceInfo, pawnPrice }: PawnServiceProps) {
  const router = useRouter();
  const [locationType, setLocationType] = useState<"home" | "bts" | "store">("home");
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

  const handleInputChange = (
    field: keyof typeof formState,
    value: string | Date | boolean | undefined
  ) => {
    if (field === "phone") {
      const numericValue = (value as string).replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const isFormComplete =
    formState.customerName &&
    formState.phone &&
    formState.date &&
    formState.time &&
    formState.termsAccepted &&
    (locationType === "home" ? formState.address : locationType === "bts" ? formState.btsStation : true);

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
      {/* Price Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-6 text-center shadow-lg"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-100/50 blur-2xl" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-orange-900">ยอดเงินที่คุณจะได้รับ (จำนำ)</h3>
          <p className="mt-2 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            {THB(pawnPrice)}
          </p>
          <p className="mt-2 text-sm text-orange-800/80">รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น</p>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-orange-100 bg-orange-50/50 p-4"
      >
        <h4 className="mb-3 text-sm font-semibold text-orange-900">สิทธิประโยชน์ที่คุณได้รับ</h4>
        <ul className="space-y-2 text-sm text-orange-800">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
            <span>รับเงินสดทันที 30 นาที</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
            <span>ไม่มีค่าธรรมเนียมใดๆ ทั้งสิ้น</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
            <span>ไม่ต้องตัดจีพีเอสและไอคราวด์</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
            <span>ไถ่คืนได้ตลอดเวลา ไม่มีดอกเบี้ย</span>
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
          <Label className="mb-3 block text-lg font-semibold">1. เลือกสถานที่จำนำ</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={locationType === "home" ? "default" : "outline"}
              onClick={() => setLocationType("home")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Home className="h-6 w-6" />
              <span className="text-xs">จำนำถึงบ้าน</span>
            </Button>
            <Button
              type="button"
              variant={locationType === "bts" ? "default" : "outline"}
              onClick={() => setLocationType("bts")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Train className="h-6 w-6" />
              <span className="text-xs">BTS/MRT</span>
            </Button>
            <Button
              type="button"
              variant={locationType === "store" ? "default" : "outline"}
              onClick={() => setLocationType("store")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Store className="h-6 w-6" />
              <span className="text-xs">จำนำที่ร้าน</span>
            </Button>
          </div>
        </motion.div>

        {/* Step 2: Customer Details */}
        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">2. กรอกข้อมูลส่วนตัว</Label>

          <div className="space-y-2">
            <Label htmlFor="customerName-pawn">ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-pawn"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-pawn">เบอร์โทรศัพท์ติดต่อ</Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="phone-pawn"
                type="tel"
                placeholder="0xx-xxx-xxxx"
                value={formState.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        {/* Step 3: Location Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={locationType}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            <Label className="block text-lg font-semibold">3. ระบุรายละเอียดสถานที่</Label>

            {locationType === "home" && (
              <motion.div key="home-form" variants={formVariants} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address-pawn">ที่อยู่</Label>
                  <p className="text-sm font-bold text-red-600">
                    *หากต้องการจำนำด่วนภายในวันนี้ กรุณาติดต่อ 098-950-9222
                  </p>
                  <Textarea
                    id="address-pawn"
                    placeholder="กรอกที่อยู่โดยละเอียด"
                    value={formState.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province-pawn">จังหวัด</Label>
                    <Select value={formState.province} onValueChange={(value) => handleInputChange("province", value)}>
                      <SelectTrigger id="province-pawn" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BKK">กรุงเทพมหานคร</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district-pawn">เขต</Label>
                    <Select value={formState.district} onValueChange={(value) => handleInputChange("district", value)}>
                      <SelectTrigger id="district-pawn" className="w-full">
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
                    <Label htmlFor="bts-line-pawn">สายรถไฟ BTS/MRT</Label>
                    <Select onValueChange={setSelectedBtsLine}>
                      <SelectTrigger id="bts-line-pawn" className="w-full">
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
                    <Label htmlFor="bts-station-pawn">ระบุสถานี</Label>
                    <Select
                      disabled={!selectedBtsLine}
                      onValueChange={(value) => handleInputChange("btsStation", value)}
                    >
                      <SelectTrigger id="bts-station-pawn" className="w-full">
                        <SelectValue placeholder="เลือกสถานี" />
                      </SelectTrigger>
                      <SelectContent>
                        {(btsMrtData[selectedBtsLine as keyof typeof btsMrtData] || []).map((station) => (
                          <SelectItem key={station} value={station}>
                            {station}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {locationType === "store" && (
              <motion.div key="store-form" variants={formVariants} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store-branch-pawn">สาขา</Label>
                  <Select
                    value={formState.storeLocation}
                    onValueChange={(value) => handleInputChange("storeLocation", value)}
                  >
                    <SelectTrigger id="store-branch-pawn" className="w-full">
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
        </AnimatePresence>

        {/* Step 4: Date & Time (combined) */}
        <motion.div variants={formVariants} className="space-y-4">
          <Label className="block text-lg font-semibold">4. เลือกวันและเวลา</Label>
          <div className="grid grid-cols-1 gap-4">
            <DateTimeSelect
              serviceType="บริการจำนำ"
              serviceData={{ ...formState, locationType }}
              dateValue={formState.date}
              onDateChange={(value) => handleInputChange("date", value)}
              timeValue={formState.time}
              onTimeChange={(value) => handleInputChange("time", value)}
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
        className="space-y-6 pt-4"
      >
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms-pawn"
            checked={formState.termsAccepted}
            onCheckedChange={(checked) => handleInputChange("termsAccepted", Boolean(checked))}
            className="mt-1"
          />
          <label
            htmlFor="terms-pawn"
            className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ฉันยอมรับข้อตกลงและเงื่อนไข{" "}
            <a href="#" className="text-blue-600 underline">
              การจำนำสินค้าของทางร้าน
            </a>
          </label>
        </div>
        <FramerButton
          size="lg"
          disabled={!isFormComplete}
          className="h-14 w-full"
          onClick={() => router.push("/confirmed/1")}
        >
          ยืนยันการจำนำและรับเงินทันที
        </FramerButton>
      </motion.div>
    </main>
  );
}
