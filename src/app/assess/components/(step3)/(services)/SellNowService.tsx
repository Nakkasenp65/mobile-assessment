"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DeviceInfo } from "../../../../../types/device";
import { Store, User, Phone, Home, Train } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";

import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons for React/Next.js environment
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

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

const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const SellNowService = ({ deviceInfo, sellPrice }: SellNowServiceProps) => {
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
  });

  const [clientLatLng, setClientLatLng] = useState<LatLng | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Request geolocation when locationType is "home"
  useEffect(() => {
    if (locationType === "home" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
          setClientLatLng(latlng);
        },
        (error) => {
          console.error(error.message);
          setClientLatLng(null);
        },
      );
    }
  }, [locationType]);

  // Initialize Leaflet map if clientLatLng is set and no map exists yet
  useEffect(() => {
    if (locationType === "home" && clientLatLng && !map) {
      const leafletMap = L.map("leaflet-map", {
        center: clientLatLng,
        zoom: 15,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(leafletMap);

      const leafletMarker = L.marker(clientLatLng, { draggable: true }).addTo(leafletMap);

      leafletMarker.on("dragend", (e) => {
        const markerLatLng = (e.target as L.Marker).getLatLng();
        setClientLatLng(markerLatLng);
      });

      setMarker(leafletMarker);
      setMap(leafletMap);
    }
  }, [clientLatLng, locationType, map]);

  // Update marker position if clientLatLng changes (user moved marker)
  useEffect(() => {
    if (marker && clientLatLng) {
      marker.setLatLng(clientLatLng);
      if (map) {
        map.panTo(clientLatLng);
      }
      // Reverse geocode to get address
      setLoadingAddress(true);
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${clientLatLng.lat}&lon=${clientLatLng.lng}&accept-language=th`,
      )
        .then((response) => response.json())
        .then((data) => {
          const address = data.display_name || "";
          setFormState((prev) => ({ ...prev, address }));
          setLoadingAddress(false);
        })
        .catch(() => {
          setLoadingAddress(false);
        });
    }
  }, [clientLatLng, marker, map]);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    if (field === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormState((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleLocationTypeChange = (newLocationType: "home" | "bts" | "store") => {
    setLocationType(newLocationType);
    setFormState((prev) => ({
      ...prev,
      address: "",
      btsStation: "",
    }));
    setSelectedBtsLine("");
    setClientLatLng(null);
    if (map) {
      map.remove();
      setMap(null);
    }
  };

  const isFormComplete =
    formState.customerName &&
    formState.phone.length === 10 &&
    formState.date &&
    formState.time &&
    locationType !== null &&
    (locationType === "home"
      ? formState.address && !loadingAddress
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

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

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
            <Label htmlFor={`customerName-sell`}>ชื่อ-นามสกุล</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id={`customerName-sell`}
                placeholder="กรอกชื่อ-นามสกุล"
                value={formState.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`phone-sell`}>เบอร์โทรศัพท์ติดต่อ</Label>
            <div className="relative">
              <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <Input
                id={`phone-sell`}
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

              {/* Home pickup with Leaflet map and auto address */}
              {locationType === "home" && (
                <motion.div key="home-form" variants={formVariants} className="space-y-4">
                  <p className="text-sm font-bold text-red-600">
                    *หากต้องการขายด่วนภายในวันนี้ กรุณาติดต่อ 098-950-9222
                  </p>
                  <div
                    className="min-h-[300px] rounded border border-gray-300"
                    id="leaflet-map"
                    style={{ width: "100%" }}
                  />
                  <Label htmlFor={`address-sell`} className="mt-2">
                    ระบุที่อยู่ (ดึงจากตำแหน่งบนแผนที่)
                  </Label>
                  {loadingAddress ? (
                    <p className="text-gray-500 italic">กำลังดึงข้อมูลที่อยู่...</p>
                  ) : (
                    <Textarea
                      id={`address-sell`}
                      placeholder="ที่อยู่โดยละเอียด"
                      value={formState.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="min-h-[80px]"
                    />
                  )}
                </motion.div>
              )}

              {locationType === "bts" && (
                <motion.div key="bts-form" variants={formVariants} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`bts-line-sell`}>สายรถไฟ BTS/MRT</Label>
                      <Select onValueChange={setSelectedBtsLine}>
                        <SelectTrigger id={`bts-line-sell`} className="w-full">
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
                      <Label htmlFor={`bts-station-sell`}>ระบุสถานี</Label>
                      <Select
                        disabled={!selectedBtsLine}
                        onValueChange={(value) => handleInputChange("btsStation", value)}
                      >
                        <SelectTrigger id={`bts-station-sell`} className="w-full">
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
                    <Label htmlFor={`store-branch-sell`}>สาขา</Label>
                    <Select
                      value={formState.storeLocation}
                      onValueChange={(value) => handleInputChange("storeLocation", value)}
                    >
                      <SelectTrigger id={`store-branch-sell`} className="w-full">
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
              <Label htmlFor={`date-sell`}>วัน</Label>
              <Select onValueChange={(value) => handleInputChange("date", value)}>
                <SelectTrigger id={`date-sell`} className="w-full">
                  <SelectValue placeholder="เลือกวัน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">วันนี้</SelectItem>
                  <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`time-sell`}>เวลา</Label>
              <Select onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger id={`time-sell`} className="w-full">
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
