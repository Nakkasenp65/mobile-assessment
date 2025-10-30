// src/app/assess/components/(step3)/(services)/sell-now-components/LocationDetails.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import type { LongdoAddressData } from "../../LongdoAddressForm";
import type { LatLng } from "leaflet";
import { useBtsStations } from "@/hooks/useBtsStations";
import { Button } from "@/components/ui/button";
import { mergeTrainDataWithApi } from "@/util/trainLines";
import { BRANCHES } from "@/constants/queueBooking";

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
  isLocationLoading: boolean;
  locationError: string | null;
  hasUserLocation: boolean;
  onRetryLocate: () => void;
  geocodeData: LongdoAddressData | null | undefined;
  handleAddressChange: (address: LongdoAddressData) => void;
  formVariants: Variants;
}

const LocationDetails: React.FC<LocationDetailsProps> = ({
  locationType,
  formState,
  handleInputChange,
  selectedBtsLine,
  setSelectedBtsLine,
  mapCenter,
  setMapCenter,
  isLocationLoading,
  locationError,
  hasUserLocation,
  onRetryLocate,
  geocodeData,
  handleAddressChange,
  formVariants,
}) => {
  const { data: btsData, isLoading: isLoadingBts, error: btsError } = useBtsStations();
  const merged = mergeTrainDataWithApi(btsData);

  console.log(merged);

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
              {isLocationLoading && (
                <div className="flex min-h-[300px] w-full items-center justify-center rounded border border-gray-300 bg-gray-100">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
              {!isLocationLoading && locationError && (
                <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  <p className="mb-2">ไม่สามารถเข้าถึงตำแหน่งได้: {locationError}</p>
                  <Button variant="outline" size="sm" onClick={onRetryLocate}>
                    ขอใช้ตำแหน่งอีกครั้ง
                  </Button>
                </div>
              )}
              {!isLocationLoading && !locationError && hasUserLocation && mapCenter && (
                <>
                  {/* MAP ELEMENT FOR LEAFLET */}
                  <LeafletMap center={mapCenter} onLatLngChange={setMapCenter} />
                  {/* LONGDO ADDRESS FORM */}
                  <LongdoAddressForm
                    initialData={geocodeData}
                    onAddressChange={handleAddressChange}
                  />
                </>
              )}
              {!isLocationLoading && !locationError && !hasUserLocation && (
                <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  กดปุ่ม &quot;รับซื้อถึงบ้าน&quot; เพื่ออนุญาตการเข้าถึงตำแหน่ง
                  และรอระบบดึงค่าพิกัดจริง
                </div>
              )}
            </motion.div>
          )}

          {locationType === "bts" && (
            <motion.div key="bts-form" variants={formVariants} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bts-line-sell">สายรถไฟ</Label>
                <Select onValueChange={setSelectedBtsLine} disabled={isLoadingBts || !!btsError}>
                  <SelectTrigger id="bts-line-sell" className="h-12 w-full">
                    <SelectValue
                      placeholder={
                        isLoadingBts ? "กำลังโหลด..." : btsError ? "เกิดข้อผิดพลาด" : "เลือกสายรถไฟ"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {merged.lines.map((line) => {
                      return (
                        <SelectItem key={line.LineId} value={line.LineName_TH} className="h-12">
                          {line.LineName_TH}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bts-station-sell">ระบุสถานี</Label>
                <Select
                  disabled={!selectedBtsLine}
                  onValueChange={(value) => handleInputChange("btsStation", value)}
                >
                  <SelectTrigger id="bts-station-sell" className="h-12 w-full">
                    <SelectValue placeholder="เลือกสถานี" />
                  </SelectTrigger>
                  <SelectContent>
                    {(merged.stationsByLine[selectedBtsLine] || []).map((station) => (
                      <SelectItem
                        key={station.StationId}
                        value={station.StationNameTH}
                        className="h-12"
                      >
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
                <SelectTrigger id="store-branch-sell" className="h-12 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name} className="h-12">
                      {branch.name}
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
