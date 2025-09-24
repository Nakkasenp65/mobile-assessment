// src/app/assess/step3/(services)/PawnService.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// ----------------------------------------------------------------------------------------------------
// Interface: PawnServiceProps
// ปรับปรุง Interface โดยนำ onBack ออกไป เนื่องจากคอมโพเนนต์นี้จะถูกแสดงผลภายใน Accordion
// ----------------------------------------------------------------------------------------------------
interface PawnServiceProps {
  deviceInfo: DeviceInfo;
  pawnPrice: number;
}

// ----------------------------------------------------------------------------------------------------
// Component: PawnService
// ถูกปรับโครงสร้างให้เป็น "Form Fragment" คือมีแต่ส่วนของฟอร์มเท่านั้น
// เพื่อให้สามารถนำไปแสดงผลในพื้นที่จำกัด เช่น ภายใน Accordion Content ได้
// ----------------------------------------------------------------------------------------------------
const PawnService = ({ deviceInfo, pawnPrice }: PawnServiceProps) => {
  return (
    // ใช้ <main> เป็น Container หลักของฟอร์ม
    <main className="w-full pt-4">
      <div className="space-y-8">
        {/* ---------------------------------------------------------------- */}
        {/* Progress Stepper: แสดง 3 ขั้นตอน */}
        {/* ---------------------------------------------------------------- */}
        <div className="relative mx-4 mb-8">
          {/* Progress bar background */}
          <div className="bg-muted absolute top-5 right-0 left-0 h-1 -translate-y-1/2" />

          {/* Progress bar fill */}
          <div
            className="bg-primary absolute top-5 h-1 -translate-y-1/2 transition-all duration-300"
            style={{ width: "50%" }}
          />

          {/* Steps container */}
          <div className="relative z-10 flex h-16 justify-between">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                1
              </div>
              <p className="absolute bottom-0 w-max text-center text-xs">
                กำลังดำเนินการ
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full font-bold">
                2
              </div>
              <p className="absolute bottom-0 w-max text-center text-xs font-medium">
                เลือกสถานที่รับซื้อ
              </p>
            </div>

            {/* Step 3 */}
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

        {/* ---------------------------------------------------------------- */}
        {/* ส่วนฟอร์มหลัก (Card) */}
        {/* ---------------------------------------------------------------- */}
        <div className="py-6">
          <div className="space-y-8">
            {/* --- เลือกสถานที่ --- */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">สถานที่รับซื้อ</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button variant="default" className="w-full justify-start">
                  <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  รับซื้อถึงบ้าน
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <div className="border-muted-foreground mr-2 flex h-5 w-5 items-center justify-center rounded-full border-2" />
                  รับซื้อตาม BTS/MRT
                </Button>
              </div>
            </div>

            {/* --- ข้อมูลติดต่อ --- */}
            <div className="w-full space-y-4">
              <h3 className="text-lg font-semibold">ข้อมูล</h3>
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input id="name" placeholder="กรอกชื่อ-นามสกุล" />
              </div>
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
                      <SelectValue placeholder="เลือกจังหวัด" />
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
                      <SelectValue placeholder="เลือกเขต" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHN">เขตพระนคร</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">วัน/เวลา</Label>
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
                  <Label htmlFor="time">
                    <span className="md:hidden">เวลา</span>
                    <span className="hidden md:inline">&nbsp;</span>
                  </Label>
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

            {/* --- เบอร์โทรศัพท์ --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">หมายเลขโทรศัพท์</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" inputMode="numeric">
                    เบอร์โทร
                  </Label>
                  <Input id="phone" type="tel" placeholder="0xx-xxx-xxxx" />
                </div>
              </div>
            </div>

            {/* --- ยืนยัน --- */}
            <div className="space-y-6">
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" />
                <label
                  htmlFor="terms"
                  className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ฉันยอมรับข้อตกลงและเงื่อนไข การรับซื้อสินค้าของทางเยลลี่
                </label>
              </div>
              <Button
                size="lg"
                className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
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
