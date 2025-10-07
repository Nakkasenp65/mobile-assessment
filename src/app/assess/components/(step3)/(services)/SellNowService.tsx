// src/app/assess/components/(step3)/(services)/SellNowService.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DeviceInfo } from "../../../../../types/device";
import { Store, User, Phone, Home, Train, Loader2 } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import dynamic from "next/dynamic";
import type { LongdoAddressData } from "../LongdoAddressForm";

// --- [เพิ่ม] Import ที่จำเป็น ---
import useLocation from "@/hooks/useLocation";
import LongdoScriptLoader from "@/components/Script/LongdoScriptLoader";

// --- [เพิ่ม] Dynamic import สำหรับ Map และ Form ---
const LeafletMap = dynamic(() => import("../LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] w-full items-center justify-center rounded border border-gray-300 bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});
const LongdoAddressForm = dynamic(() => import("../LongdoAddressForm"), {
  ssr: false,
  loading: () => <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>,
});

// --- [เพิ่ม] ประกาศ Type สำหรับพิกัด ---
type LatLngLiteral = { lat: number; lng: number };

interface SellNowServiceProps {
  deviceInfo: DeviceInfo;
  sellPrice: number;
}

const btsMrtData = {
  "BTS - สายสุขุมวิท": ["สยาม", "ชิดลม", "เพลินจิต", "นานา", "อโศก", "พร้อมพงษ์"],
  "BTS - สายสีลม": ["สยาม", "ศาลาแดง", "ช่องนนทรี", "สุรศักดิ์", "สะพานตากสิน"],
  "MRT - สายสีน้ำเงิน": ["สุขุมวิท", "เพชรบุรี", "พระราม 9", "ศูนย์วัฒนธรรมฯ", "สีลม"],
};

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

const THB = (n: number) => n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

const SellNowService = ({ deviceInfo, sellPrice }: SellNowServiceProps) => {
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
    storeLocation: storeLocations[0],
    date: undefined as Date | undefined,
    time: "",
  });

  // --- [เพิ่ม] State และ Hook สำหรับจัดการตำแหน่งและแผนที่ ---
  const { location: initialLocation } = useLocation();
  const [mapCenter, setMapCenter] = useState<LatLngLiteral | null>(null);

  // Effect: ตั้งค่าตำแหน่งเริ่มต้นของแผนที่
  useEffect(() => {
    if (initialLocation && !mapCenter) {
      setMapCenter({ lat: initialLocation.latitude, lng: initialLocation.longitude });
    }
  }, [initialLocation, mapCenter]);

  // --- [เพิ่ม] Effect สำหรับยิง API ของ Longdo ---
  useEffect(() => {
    if (mapCenter) {
      const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
      const url = `https://api.longdo.com/map/services/address?lon=${mapCenter.lng}&lat=${mapCenter.lat}&key=${apiKey}`;

      console.log(`🚀 Firing API Request to: ${url}`);

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log("📍 Longdo API Response:", data);
        })
        .catch((err) => console.error("❌ Failed to fetch Longdo API:", err));
    }
  }, [mapCenter]); // ทำงานทุกครั้งที่ mapCenter เปลี่ยน

  const handleInputChange = (field: keyof typeof formState, value: string | Date | undefined) => {
    if (field === "phone") {
      setFormState((prev) => ({ ...prev, [field]: (value as string).replace(/[^0-9]/g, "") }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationTypeChange = (newLocationType: "home" | "bts" | "store") => {
    setLocationType(newLocationType);
    setFormState((prev) => ({
      ...prev,
      addressDetails: "",
      province: "",
      district: "",
      subdistrict: "",
      postcode: "",
      btsStation: "",
    }));
    setSelectedBtsLine("");
  };

  const handleAddressSelect = (data: LongdoAddressData) => {
    console.log("📝 Form data received from LongdoAddressForm:", data);
    setFormState((prev) => ({
      ...prev,
      province: data.province,
      district: data.district,
      subdistrict: data.subdistrict,
      postcode: data.postcode,
      addressDetails: data.address,
    }));
  };

  const isFormComplete =
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.date &&
    formState.time &&
    locationType !== null &&
    (locationType === "home"
      ? formState.province && formState.addressDetails
      : locationType === "bts"
        ? formState.btsStation
        : locationType === "store");

  const formVariants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full space-y-6 pt-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-orange-50 via-pink-50 to-white p-6 text-center shadow-lg dark:border-pink-400/30 dark:from-orange-400/10 dark:via-pink-400/10"
      >
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-pink-100/50 blur-2xl dark:bg-pink-400/20" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-100/50 blur-2xl dark:bg-orange-400/20" />
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-100">ยอดเงินที่คุณจะได้รับ</h3>
          <p className="mt-2 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-pink-400 dark:to-orange-400">
            {THB(sellPrice)}
          </p>
          <p className="mt-2 text-sm text-pink-800/80 dark:text-pink-200/80">รับเงินสดทันทีเมื่อการตรวจสอบเสร็จสิ้น</p>
        </div>
      </motion.div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        <motion.div variants={formVariants} className="border-border flex flex-col gap-4 border-b pb-8">
          <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>
          <div className="space-y-2">
            <Label htmlFor="customerName-sell">ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="customerName-sell"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-sell">เบอร์โทรศัพท์ติดต่อ</Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id="phone-sell"
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

        <motion.div variants={formVariants} className="flex flex-col gap-4">
          <Label className="block text-lg font-semibold">เลือกสถานที่รับซื้อ</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={locationType === "home" ? "default" : "outline"}
              onClick={() => handleLocationTypeChange("home")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Home className="h-6 w-6" /> <span className="text-xs">รับซื้อถึงบ้าน</span>
            </Button>
            <Button
              type="button"
              variant={locationType === "bts" ? "default" : "outline"}
              onClick={() => handleLocationTypeChange("bts")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Train className="h-6 w-6" /> <span className="text-xs">BTS/MRT</span>
            </Button>
            <Button
              type="button"
              variant={locationType === "store" ? "default" : "outline"}
              onClick={() => handleLocationTypeChange("store")}
              className="flex h-auto flex-col items-center gap-2 py-4"
            >
              <Store className="h-6 w-6" /> <span className="text-xs">รับซื้อที่ร้าน</span>
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
                className="border-border flex flex-col gap-4 border-b pb-8"
              >
                {locationType === "home" && (
                  <motion.div key="home-form" variants={formVariants} className="flex flex-col gap-4">
                    <LongdoScriptLoader />
                    <Label className="block text-base font-semibold">ปักหมุดตำแหน่งของคุณ</Label>
                    <LeafletMap center={mapCenter} onLatLngChange={setMapCenter} />
                    <LongdoAddressForm onAddressSelect={handleAddressSelect} />
                    <div className="space-y-2">
                      <Label htmlFor="addressDetails-sell">บ้านเลขที่, ซอย, ถนน</Label>
                      <Input
                        id="addressDetails-sell"
                        placeholder="กรอกรายละเอียดเพิ่มเติม"
                        value={formState.addressDetails}
                        onChange={(e) => handleInputChange("addressDetails", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </motion.div>
                )}
                {locationType === "bts" && (
                  <motion.div key="bts-form" variants={formVariants} className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bts-line-sell">สายรถไฟ BTS/MRT</Label>
                      <Select onValueChange={setSelectedBtsLine}>
                        <SelectTrigger id="bts-line-sell" className="w-full">
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
                      <Label htmlFor="bts-station-sell">ระบุสถานี</Label>
                      <Select
                        disabled={!selectedBtsLine}
                        onValueChange={(value) => handleInputChange("btsStation", value)}
                      >
                        <SelectTrigger id="bts-station-sell" className="w-full">
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
                  </motion.div>
                )}
                {locationType === "store" && (
                  <motion.div key="store-form" variants={formVariants} className="space-y-2">
                    <Label htmlFor="store-branch-sell">สาขา</Label>
                    <Select
                      value={formState.storeLocation}
                      onValueChange={(value) => handleInputChange("storeLocation", value)}
                    >
                      <SelectTrigger id="store-branch-sell" className="w-full">
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
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={formVariants} className="border-border flex flex-col gap-4 border-b pb-8">
          <Label className="block text-lg font-semibold">เลือกวันและเวลาที่สะดวก</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-sell">วัน</Label>
              <DatePicker
                date={formState.date}
                onDateChange={(date) => handleInputChange("date", date)}
                placeholder="เลือกวันที่"
                className="h-12 w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-sell">เวลา</Label>
              <Select onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger id="time-sell" className="h-12 w-full">
                  <SelectValue placeholder="เลือกเวลา" />
                </SelectTrigger>
                <SelectContent>
                  {locationType === "store" ? (
                    <>
                      <SelectItem value="11">11:00</SelectItem>
                      <SelectItem value="12">12:00</SelectItem>
                      <SelectItem value="13">13:00</SelectItem>
                      <SelectItem value="14">14:00</SelectItem>
                      <SelectItem value="15">15:00</SelectItem>
                      <SelectItem value="16">16:00</SelectItem>
                      <SelectItem value="17">17:00</SelectItem>
                      <SelectItem value="18">18:00</SelectItem>
                      <SelectItem value="19">19:00</SelectItem>
                      <SelectItem value="20">20:00</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="9">09:00</SelectItem>
                      <SelectItem value="10">10:00</SelectItem>
                      <SelectItem value="11">11:00</SelectItem>
                      <SelectItem value="12">12:00</SelectItem>
                      <SelectItem value="13">13:00</SelectItem>
                      <SelectItem value="14">14:00</SelectItem>
                      <SelectItem value="15">15:00</SelectItem>
                      <SelectItem value="16">16:00</SelectItem>
                      <SelectItem value="17">17:00</SelectItem>
                      <SelectItem value="18">18:00</SelectItem>
                      <SelectItem value="19">19:00</SelectItem>
                      <SelectItem value="20">20:00</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        className="space-y-4 pt-4"
      >
        <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
          ยืนยันการขายและรับเงินทันที
        </FramerButton>
        <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
          การคลิก &quot;ยืนยันการขายและรับเงินทันที&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ
          และยอมรับใน{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink-600 underline hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
          >
            ข้อตกลงและเงื่อนไขการใช้บริการ
          </a>
        </p>
      </motion.div>
    </main>
  );
};

export default SellNowService;
