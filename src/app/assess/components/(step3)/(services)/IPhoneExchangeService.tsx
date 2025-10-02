// src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx
"use client";

import { useState, useMemo, forwardRef } from "react";
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
import { DeviceInfo } from "../../../page";
import { Store, User, Phone, Train, Repeat, Wallet, Cloud, LucideIcon } from "lucide-react";
import FramerButton from "@/components/ui/framer/FramerButton";
import { cn } from "@/lib/utils";

// Interface for Component Props
interface IPhoneExchangeServiceProps {
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
const SERVICE_FEE_RATE = 0.15; // 15%

// Helper function for currency formatting
const THB = (n: number) =>
  n.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const IPhoneExchangeService = forwardRef<HTMLDivElement, IPhoneExchangeServiceProps>(
  ({ service, theme, isSelected }, ref) => {
    const { id, title, description, icon: Icon, price: exchangePrice } = service;

    const [locationType, setLocationType] = useState<"store" | "bts" | null>(null);
    const [selectedBtsLine, setSelectedBtsLine] = useState("");
    const [formState, setFormState] = useState({
      customerName: "",
      phone: "",
      btsStation: "",
      storeLocation: storeLocations[0],
      date: "",
      time: "",
      termsAccepted: false,
    });

    const handleInputChange = (field: keyof typeof formState, value: any) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
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

    const isFormComplete =
      formState.customerName &&
      formState.phone &&
      formState.date &&
      formState.time &&
      formState.termsAccepted &&
      locationType !== null &&
      (locationType === "bts" ? formState.btsStation : locationType === "store" ? true : false);

    const formVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    };

    return (
      <AccordionItem
        ref={ref}
        value={id}
        className={cn(
          "rounded-2xl border shadow-sm transition-all duration-300 ease-in-out",
          isSelected
            ? `${theme.borderColor} ${theme.soft} ${theme.ring} ring-2`
            : ` ${theme.ring} `,
        )}
      >
        <AccordionTrigger className="w-full cursor-pointer p-4 text-left hover:no-underline">
          <div className="flex w-full items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-sm dark:bg-zinc-800",
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-foreground font-semibold">{title}</h4>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <div className="ml-2 text-right">
              <p className="text-foreground text-lg font-bold">{THB(exchangePrice)}</p>
            </div>
          </div>
        </AccordionTrigger>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-4 mb-4 rounded-xl border border-green-100 bg-gradient-to-br from-green-50/75 to-emerald-500/25 p-4"
        >
          <ul className="text-green-800 dark:text-green-200">
            <li className="flex items-start gap-2">
              <Wallet className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
              <span>รับเงินสดทันทีหลังส่งมอบเครื่อง</span>
            </li>
            <li className="flex items-start gap-2">
              <Repeat className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
              <span>ต่อรอบได้ทุก 10 วัน โดยชำระค่าบริการ 15% ของวงเงิน</span>
            </li>
            <li className="flex items-start gap-2">
              <Cloud className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
              <span>ใช้ iCloud ของตัวเองได้ ไม่ติดไอคลาวด์ร้าน</span>
            </li>
          </ul>
        </motion.div>

        <AccordionContent className="px-4 pb-4">
          <div className="mt-2 space-y-6 border-t pt-4 dark:border-zinc-700/50">
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
                    <span className="text-green-800 dark:text-green-200">
                      ค่าบริการรอบแรก (15%)
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      - {THB(feeAmount)}
                    </span>
                  </div>
                </div>
                <div className="!my-3 border-t border-green-200/50 dark:border-green-400/30" />
                <div className="text-center">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ยอดเงินที่จะได้รับทันที
                  </p>
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

              <motion.div variants={formVariants} className="space-y-4">
                <Label className="mb-3 block text-lg font-semibold">
                  เลือกสถานที่ส่งมอบเครื่อง
                </Label>
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
                      )}

                      {locationType === "store" && (
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
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={formVariants} className="space-y-4">
                <Label className="block text-lg font-semibold">เลือกวันและเวลานัดหมาย</Label>
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
                  id={`terms-${id}`}
                  checked={formState.termsAccepted}
                  onCheckedChange={(checked) =>
                    handleInputChange("termsAccepted", Boolean(checked))
                  }
                  className="mt-1"
                />
                <label
                  htmlFor={`terms-${id}`}
                  className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ฉันยอมรับ{" "}
                  <a href="#" className="text-blue-600 underline dark:text-blue-400">
                    ข้อตกลงและเงื่อนไข
                  </a>{" "}
                  สำหรับบริการไอโฟนแลกเงิน และค่าบริการ {SERVICE_FEE_RATE * 100}% ต่อรอบ 10 วัน
                </label>
              </div>
              <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full">
                ยืนยันและนัดหมาย
              </FramerButton>
            </motion.div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  },
);

IPhoneExchangeService.displayName = "IPhoneExchangeService";

export default IPhoneExchangeService;
