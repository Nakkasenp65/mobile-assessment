// src/app/assess/components/(step3)/(services)/sell-now-components/LocationDetails.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { LongdoAddressData } from "../../LongdoAddressForm";
import type { LatLng } from "leaflet";
import { useBtsStations } from "@/hooks/useBtsStations"; // ✨ 1. Import Hook ใหม่

const LeafletMap = dynamic(() => import("../../LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[300px] w-full items-center justify-center rounded border border-gray-300 bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});
const LongdoAddressForm = dynamic(() => import("../../LongdoAddressForm"), {
  ssr: false,
  loading: () => <p className="text-muted-foreground text-sm">กำลังโหลดฟอร์มที่อยู่...</p>,
});

// ✨ 2. ลบ btsMrtData และ storeLocations ที่เป็นข้อมูลเก่าออก
const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

interface LocationDetailsProps {
  locationType: "home" | "bts" | "store" | null;
  formState: {
    storeLocation: string;
  };
  handleInputChange: (field: string, value: string) => void;
  selectedBtsLine: string;
  setSelectedBtsLine: (line: string) => void;
  mapCenter: LatLng | null;
  setMapCenter: (center: LatLng) => void;
  geocodeData: LongdoAddressData | null | undefined;
  handleAddressChange: (address: LongdoAddressData) => void;
  formVariants: any;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({
  locationType,
  formState,
  handleInputChange,
  selectedBtsLine,
  setSelectedBtsLine,
  mapCenter,
  setMapCenter,
  geocodeData,
  handleAddressChange,
  formVariants,
}) => {
  // ✨ 3. เรียกใช้ Hook เพื่อดึงข้อมูล BTS
  const { data: btsData, isLoading: isLoadingBts, error: btsError } = useBtsStations();

  return (
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
              <Label className="block text-base font-semibold">ปักหมุดตำแหน่งของคุณ</Label>
              <LeafletMap center={mapCenter} onLatLngChange={setMapCenter} />
              <LongdoAddressForm initialData={geocodeData} onAddressChange={handleAddressChange} />
            </motion.div>
          )}

          {locationType === "bts" && (
            <motion.div key="bts-form" variants={formVariants} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bts-line-sell">สายรถไฟ</Label>
                {/* ✨ 4. ใช้ข้อมูลจาก API มาแสดงใน Select */}
                <Select onValueChange={setSelectedBtsLine} disabled={isLoadingBts || !!btsError}>
                  <SelectTrigger id="bts-line-sell" className="w-full">
                    <SelectValue
                      placeholder={isLoadingBts ? "กำลังโหลด..." : btsError ? "เกิดข้อผิดพลาด" : "เลือกสายรถไฟ"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {btsData?.lines.map((line) => (
                      <SelectItem key={line.LineId} value={line.LineName_TH}>
                        {line.LineName_TH}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bts-station-sell">ระบุสถานี</Label>
                <Select disabled={!selectedBtsLine} onValueChange={(value) => handleInputChange("btsStation", value)}>
                  <SelectTrigger id="bts-station-sell" className="w-full">
                    <SelectValue placeholder="เลือกสถานี" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* ✨ 5. ใช้ข้อมูลสถานีจาก API ตามสายที่เลือก */}
                    {(btsData?.stationsByLine[selectedBtsLine] || []).map((station) => (
                      <SelectItem key={station.StationId} value={station.StationNameTH}>
                        {station.StationNameTH}
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
  );
};

export default LocationDetails;
