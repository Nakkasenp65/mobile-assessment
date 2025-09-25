// src/util/info.ts
import { ConditionInfo } from "../app/assess/page";
import {
  Smartphone,
  ShieldCheck,
  Archive,
  Frame,
  MonitorPlay,
  EyeOff,
  Grid3x3,
  Camera,
  CameraOff,
  Wifi,
  WifiOff,
  BatteryCharging,
  BatteryWarning,
  ImageOff,
  BatteryFull,
  Fingerprint,
  ScanFace,
  Speaker,
  Vibrate,
  HelpCircle,
  Package,
  Clock,
  ShieldAlert,
  AlertTriangle,
  RectangleHorizontal, // ไอคอนใหม่สำหรับหน้าจอ
} from "lucide-react";
import { ComponentType } from "react";

export interface QuestionOption {
  value: string;
  label: string;
  icon: ComponentType<any>;
  severity?: "positive" | "warning" | "negative";
}

export interface Question {
  id: keyof ConditionInfo;
  question: string;
  icon: ComponentType<any>; // --- [FIX] เพิ่ม icon property ---
  options: QuestionOption[];
}

export const ASSESSMENT_QUESTIONS: Array<{
  section: string;
  questions: Question[];
}> = [
  {
    section: "ข้อมูลทั่วไปของเครื่อง",
    questions: [
      {
        id: "modelType",
        question: "1. รุ่นโมเดลเครื่อง",
        icon: Smartphone, // กำหนดไอคอน
        options: [
          { value: "th", label: "เครื่องไทย (TH)", icon: Smartphone, severity: "positive" },
          { value: "other", label: "เครื่องนอก (ZP, LL, etc.)", icon: Smartphone, severity: "positive" },
        ],
      },
      {
        id: "warranty",
        question: "2. ประกันศูนย์ Apple",
        icon: ShieldCheck, // กำหนดไอคอน
        options: [
          { value: "active_long", label: "เหลือมากกว่า 4 เดือน", icon: ShieldCheck, severity: "positive" },
          { value: "active_short", label: "เหลือน้อยกว่า 4 เดือน", icon: Clock, severity: "warning" },
          { value: "inactive", label: "หมดประกันแล้ว", icon: ShieldAlert, severity: "negative" },
        ],
      },
      {
        id: "accessories",
        question: "3. อุปกรณ์ในกล่อง",
        icon: Package, // กำหนดไอคอน
        options: [
          { value: "full", label: "ครบกล่อง", icon: Package, severity: "positive" },
          { value: "box_only", label: "มีเฉพาะกล่อง", icon: Archive, severity: "warning" },
          { value: "no_box", label: "ไม่มีกล่อง", icon: HelpCircle, severity: "negative" },
        ],
      },
    ],
  },
  {
    section: "สภาพภายนอก",
    questions: [
      {
        id: "bodyCondition",
        question: "4. สภาพตัวเครื่องโดยรวม",
        icon: Smartphone, // กำหนดไอคอน
        options: [
          { value: "mint", label: "เหมือนใหม่ ไม่มีรอย", icon: ShieldCheck, severity: "positive" },
          { value: "minor_scratch", label: "มีรอยขนแมวเล็กน้อย", icon: Frame, severity: "warning" },
          { value: "major_scratch", label: "มีรอยตก บุบ หรือสีลอก", icon: AlertTriangle, severity: "negative" },
          { value: "cracked_back", label: "ฝาหลังแตก", icon: ImageOff, severity: "negative" },
        ],
      },
      {
        id: "screenGlass",
        question: "5. สภาพกระจกหน้าจอ",
        icon: RectangleHorizontal, // กำหนดไอคอน
        options: [
          { value: "passed", label: "ไม่มีรอยขีดข่วน", icon: ShieldCheck, severity: "positive" },
          { value: "failed", label: "มีรอยขนแมว/รอยขีดข่วน", icon: Frame, severity: "warning" },
          { value: "defect", label: "กระจกแตก/บิ่น", icon: ImageOff, severity: "negative" },
        ],
      },
    ],
  },
  {
    section: "การทำงานของหน้าจอและประสิทธิภาพ",
    questions: [
      {
        id: "screenDisplay",
        question: "6. คุณภาพการแสดงผล",
        icon: MonitorPlay, // กำหนดไอคอน
        options: [
          { value: "passed", label: "แสดงผลปกติ สีสวย", icon: MonitorPlay, severity: "positive" },
          { value: "failed", label: "มีจุด Dead/Bright, มีเส้น", icon: Grid3x3, severity: "warning" },
          { value: "defect", label: "จอเบิร์น/สีเพี้ยน/ไม่แสดงผล", icon: EyeOff, severity: "negative" },
        ],
      },
      {
        id: "batteryHealth",
        question: "7. สุขภาพแบตเตอรี่",
        icon: BatteryFull, // กำหนดไอคอน
        options: [
          { value: "high", label: "มากกว่า 85%", icon: BatteryFull, severity: "positive" },
          { value: "low", label: "ต่ำกว่า 85% หรือขึ้น Service", icon: BatteryWarning, severity: "negative" },
        ],
      },
    ],
  },
  {
    section: "ฟังก์ชันการทำงานพื้นฐาน",
    questions: [
      {
        id: "camera",
        question: "8. กล้องหน้าและกล้องหลัง",
        icon: Camera, // กำหนดไอคอน
        options: [
          { value: "passed", label: "ทำงานปกติทุกฟังก์ชัน", icon: Camera, severity: "positive" },
          { value: "failed", label: "มีปัญหา (เช่น จุดดำ, ไม่โฟกัส)", icon: CameraOff, severity: "negative" },
        ],
      },
      {
        id: "wifi",
        question: "9. การเชื่อมต่อ Wi-Fi / Bluetooth",
        icon: Wifi, // กำหนดไอคอน
        options: [
          { value: "passed", label: "เชื่อมต่อได้ปกติ", icon: Wifi, severity: "positive" },
          { value: "failed", label: "มีปัญหาการเชื่อมต่อ", icon: WifiOff, severity: "negative" },
        ],
      },
      {
        id: "faceId",
        question: "10. Face ID / Touch ID",
        icon: ScanFace, // กำหนดไอคอน
        options: [
          { value: "passed", label: "สแกนได้ปกติ", icon: ScanFace, severity: "positive" },
          { value: "failed", label: "สแกนไม่ได้/มีปัญหา", icon: Fingerprint, severity: "negative" },
        ],
      },
      {
        id: "speaker",
        question: "11. ลำโพงและการสั่น",
        icon: Speaker, // กำหนดไอคอน
        options: [
          { value: "passed", label: "เสียงดังปกติและสั่น", icon: Speaker, severity: "positive" },
          { value: "failed", label: "ลำโพงแตก/ไม่สั่น/ไม่ได้ยิน", icon: Vibrate, severity: "negative" },
        ],
      },
    ],
  },
];

export const DESKTOP_QUESTIONS = ASSESSMENT_QUESTIONS;
export const MOBILE_IOS_QUESTIONS = ASSESSMENT_QUESTIONS;
export const MOBILE_ANDROID_QUESTIONS = ASSESSMENT_QUESTIONS.filter(
  (s) => s.section === "สภาพภายนอก" || s.section === "ข้อมูลทั่วไปของเครื่อง",
);
