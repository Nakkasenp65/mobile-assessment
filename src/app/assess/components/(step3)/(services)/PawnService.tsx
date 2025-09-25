// src/app/assess/step3/(services)/PawnService.tsx
"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DeviceInfo } from "../../../page";
import { cn } from "@/lib/utils";

const btsMrtData = {
  "BTS - สายสุขุมวิท": [
    "สยาม",
    "ชิดลม",
    "เพลินจิต",
    "นานา",
    "อโศก",
    "พร้อมพงษ์",
  ],
  "BTS - สายสีลม": ["สยาม", "ศาลาแดง", "ช่องนนทรี", "สุรศักดิ์", "สะพานตากสิน"],
  "MRT - สายสีน้ำเงิน": [
    "สุขุมวิท",
    "เพชรบุรี",
    "พระราม 9",
    "ศูนย์วัฒนธรรมฯ",
    "สีลม",
  ],
};

const storeLocations = ["สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)"];

interface PawnServiceProps {
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

const PawnService = ({ deviceInfo, pawnPrice }: PawnServiceProps) => {
  const [locationType, setLocationType] = useState<"home" | "bts" | "store">(
    "home",
  );
  const [selectedBtsLine, setSelectedBtsLine] = useState("");

  const formVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <main className="w-full pt-4">
      <div className="space-y-8">
        {/* --- Progress Stepper --- */}
        <div className="relative mx-4 mb-8">
          <div className="bg-muted absolute top-5 right-0 left-0 h-1 -translate-y-1/2" />
          <div
            className="bg-primary absolute top-5 h-1 -translate-y-1/2 transition-all duration-300"
            style={{ width: "50%" }}
          />
          <div className="relative z-10 flex h-16 justify-between">
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                1
              </div>
              <p className="absolute bottom-0 w-max text-center text-xs">
                กำลังดำเนินการ
              </p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                2
              </div>
              <p className="absolute bottom-0 w-max text-center text-xs font-medium">
                เลือกสถานที่รับซื้อ
              </p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                3
              </div>
              <p className="text-muted-foreground absolute bottom-0 mt-2 w-max text-center text-xs">
                เสร็จสิ้น
              </p>
            </div>
          </div>
        </div>

        {/* --- ส่วนฟอร์มหลัก --- */}
        <div className="py-6">
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">สถานที่รับซื้อ</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button
                  variant={locationType === "home" ? "default" : "outline"}
                  onClick={() => setLocationType("home")}
                  className="w-full justify-center"
                >
                  รับซื้อถึงบ้าน
                </Button>
                <Button
                  variant={locationType === "bts" ? "default" : "outline"}
                  onClick={() => setLocationType("bts")}
                  className="w-full justify-center"
                >
                  รับซื้อตาม BTS/MRT
                </Button>
                <Button
                  variant={locationType === "store" ? "default" : "outline"}
                  onClick={() => setLocationType("store")}
                  className="w-full justify-center"
                >
                  รับซื้อที่ร้าน
                </Button>
              </div>
            </div>

            <div className="w-full space-y-4">
              <h3 className="text-lg font-semibold">ข้อมูล</h3>
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input id="name" placeholder="กรอกชื่อ-นามสกุล" />
              </div>

              <AnimatePresence mode="wait">
                {locationType === "home" && (
                  <motion.div
                    key="home-form"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="address">ที่อยู่</Label>
                      <p className="text-sm font-bold text-red-600">
                        *หากต้องการขายด่วนภายในวันนี้ กรุณาติดต่อ 098-950-9222
                      </p>
                      <Textarea
                        id="address"
                        placeholder="กรอกที่อยู่โดยละเอียด"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="province">จังหวัด</Label>
                        <Select defaultValue="BKK">
                          <SelectTrigger id="province" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BKK">กรุงเทพมหานคร</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">เขต</Label>
                        <Select defaultValue="PHN">
                          <SelectTrigger id="district" className="w-full">
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
                  <motion.div
                    key="bts-form"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    {/* --- [MOD] เปลี่ยนเป็น grid-cols-2 เพื่อให้อยู่บรรทัดเดียวกันเสมอ --- */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bts-line">สายรถไฟ BTS/MRT</Label>
                        <Select onValueChange={setSelectedBtsLine}>
                          <SelectTrigger id="bts-line" className="w-full">
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
                        <Label htmlFor="bts-station">ระบุสถานี</Label>
                        <Select disabled={!selectedBtsLine}>
                          <SelectTrigger id="bts-station" className="w-full">
                            <SelectValue placeholder="เลือกสถานี" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              btsMrtData[
                                selectedBtsLine as keyof typeof btsMrtData
                              ] || []
                            ).map((station) => (
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
                  <motion.div
                    key="store-form"
                    variants={formVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="store-branch">สาขา</Label>
                      <Select defaultValue={storeLocations[0]}>
                        <SelectTrigger id="store-branch" className="w-full">
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
              </AnimatePresence>

              {/* --- [MOD] เปลี่ยนเป็น grid-cols-2 เพื่อให้อยู่บรรทัดเดียวกันเสมอ --- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">วัน</Label>
                  <Select>
                    <SelectTrigger id="date" className="w-full">
                      <SelectValue placeholder="เลือกวัน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">วันนี้</SelectItem>
                      <SelectItem value="tomorrow">พรุ่งนี้</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">เวลา</Label>
                  <Select>
                    <SelectTrigger id="time" className="w-full">
                      <SelectValue placeholder="เลือกเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-12">09:00 - 12:00</SelectItem>
                      <SelectItem value="13-17">13:00 - 17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">หมายเลขโทรศัพท์</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทร</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0xx-xxx-xxxx"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <label
                  htmlFor="terms"
                  className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ฉันยอมรับข้อตกลงและเงื่อนไข{" "}
                  <a href="#" className="text-blue-600 underline">
                    การรับซื้อสินค้าของทางเยลลี่
                  </a>
                </label>
              </div>
              <Button
                size="lg"
                className="w-full bg-gradient-to-br from-orange-300 to-orange-500 text-base font-bold text-white hover:bg-yellow-600"
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PawnService;
