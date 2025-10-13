// src/util/info.ts

import { ConditionInfo } from "../types/device";
import {
  Smartphone,
  ShieldCheck,
  Archive,
  Frame,
  MonitorPlay,
  EyeOff,
  Grid3x3,
  Camera,
  Wifi,
  ScanFace,
  Speaker,
  BatteryCharging,
  BatteryFull,
  BatteryWarning,
  ImageOff,
  Fingerprint,
  Vibrate,
  Clock,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  RectangleHorizontal,
  PowerOff,
  WifiOff,
  PhoneCall,
  CircleDot,
  RadioTower,
  Power,
  PhoneOff,
  Package,
  CameraOff,
  Hand,
  Mic,
  MicOff,
  LucideIcon,
} from "lucide-react";
import { IconType } from "react-icons";

// ✨ [REFACTORED] เปลี่ยนชื่อ Platform ให้สื่อความหมายตามบริบทและ OS
export type Platform = "UNIVERSAL" | "IOS" | "ANDROID" | "MANUAL_INPUT";
export type QuestionType = "choice" | "toggle";

export interface QuestionOption {
  id: string;
  label: string;
  icon: LucideIcon | IconType;
}

export interface Question {
  id: keyof ConditionInfo;
  question: string;
  icon: LucideIcon | IconType;
  type: QuestionType;
  // ✨ [REFACTORED] Array นี้จะเก็บ Platform ที่ออกแบบใหม่
  platforms: Platform[];
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
        question: "รุ่นโมเดลเครื่อง",
        icon: Smartphone,
        type: "choice",
        // ✨ เป็นคำถามเฉพาะของ Apple
        platforms: ["IOS"],
        options: [
          { id: "model_th", label: "เครื่องไทย (TH)", icon: Smartphone },
          { id: "model_inter_new", label: "เครื่องนอก (ZP 14, 15, 16 Series)", icon: Smartphone },
          { id: "model_inter_old", label: "เครื่องนอกโมเดลอื่น", icon: Smartphone },
        ],
      },
      {
        id: "warranty",
        question: "ประกันศูนย์",
        icon: ShieldCheck,
        type: "choice",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "warranty_active_long", label: "เหลือมากกว่า 6 เดือน", icon: ShieldCheck },
          { id: "warranty_active_short", label: "เหลือน้อยกว่า 6 เดือน", icon: Clock },
          { id: "warranty_inactive", label: "หมดประกันแล้ว", icon: ShieldAlert },
        ],
      },
      {
        id: "accessories",
        question: "อุปกรณ์ในกล่อง",
        icon: Package,
        type: "choice",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "acc_full", label: "ครบกล่อง", icon: Package },
          { id: "acc_box_only", label: "มีเฉพาะกล่อง", icon: Archive },
          { id: "acc_no_box", label: "ไม่มีกล่อง", icon: HelpCircle },
        ],
      },
    ],
  },
  {
    section: "สภาพภายนอก",
    questions: [
      {
        id: "bodyCondition",
        question: "สภาพตัวเครื่องโดยรวม",
        icon: Smartphone,
        type: "choice",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "body_mint", label: "เหมือนใหม่ไม่มีรอย", icon: ShieldCheck },
          { id: "body_scratch_minor", label: "มีรอยเคส/สีลอก", icon: AlertTriangle },
          { id: "body_dent_major", label: "มีรอยตก/บุบ", icon: ImageOff },
        ],
      },
      {
        id: "screenGlass",
        question: "สภาพกระจกหน้าจอ",
        icon: RectangleHorizontal,
        type: "choice",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "glass_ok", label: "ไม่มีรอย", icon: ShieldCheck },
          { id: "glass_scratch_hairline", label: "มีรอยขนแมว", icon: Frame },
          { id: "glass_cracked", label: "กระจกแตก บิ่น ร้าว", icon: ImageOff },
        ],
      },
    ],
  },
  {
    section: "การทำงานของหน้าจอและประสิทธิภาพ",
    questions: [
      {
        id: "screenDisplay",
        question: "คุณภาพการแสดงผล",
        icon: MonitorPlay,
        type: "choice",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "display_ok", label: "แสดงผลปกติ สีสวย", icon: MonitorPlay },
          { id: "display_pixel_defect", label: "มีจุด Dead/Bright, มีเส้น", icon: Grid3x3 },
          { id: "display_burn_in", label: "จอเบิร์น/สีเพี้ยน/ไม่แสดงผล", icon: EyeOff },
        ],
      },
      {
        id: "batteryHealth",
        question: "สุขภาพแบตเตอรี่",
        icon: BatteryFull,
        type: "choice",
        // ✨ เป็นคำถามเฉพาะของ Apple
        platforms: ["IOS"],
        options: [
          { id: "battery_health_high", label: "มากกว่า 90%", icon: BatteryFull },
          { id: "battery_health_medium", label: "80% - 89%", icon: BatteryWarning },
          { id: "battery_health_low", label: "ต่ำกว่า 80% หรือขึ้น Service", icon: BatteryWarning },
        ],
      },
    ],
  },
  {
    section: "ฟังก์ชันการทำงานพื้นฐาน",
    questions: [
      {
        id: "camera",
        question: "กล้องหน้าและกล้องหลัง",
        icon: Camera,
        type: "choice",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "camera_ok", label: "ทำงานปกติ", icon: Camera },
          { id: "camera_issue_minor", label: "มีปัญหา (จุดดำ, ไม่โฟกัส)", icon: AlertTriangle },
          { id: "camera_defective", label: "ใช้งานไม่ได้", icon: CameraOff },
        ],
      },
      {
        id: "touchScreen",
        question: "การสัมผัสหน้าจอ",
        icon: Hand,
        type: "toggle",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "touchscreen_ok", label: "สัมผัสปกติ", icon: Hand },
          { id: "touchscreen_failed", label: "ทัชไม่ได้/ทัชรวน", icon: Hand },
        ],
      },
      {
        id: "wifi",
        question: "Wi-Fi / Bluetooth",
        icon: Wifi,
        type: "toggle",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "wifi_ok", label: "เชื่อมต่อปกติ", icon: Wifi },
          { id: "wifi_failed", label: "มีปัญหา", icon: WifiOff },
        ],
      },
      {
        id: "faceId",
        question: "Face ID / Touch ID",
        icon: ScanFace,
        type: "toggle",
        // ✨ เป็นฟังก์ชันเฉพาะของ Apple
        platforms: ["IOS"],
        options: [
          { id: "biometric_ok", label: "สแกนได้ปกติ", icon: ScanFace },
          { id: "biometric_failed", label: "สแกนไม่ได้", icon: Fingerprint },
        ],
      },
      {
        id: "speaker",
        question: "ลำโพงและการสั่น",
        icon: Speaker,
        type: "toggle",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "speaker_ok", label: "ปกติ", icon: Speaker },
          { id: "speaker_failed", label: "ลำโพงแตก/ไม่ดัง/ไม่สั่น", icon: Vibrate },
        ],
      },
      {
        id: "mic",
        question: "ไมโครโฟน",
        icon: Mic,
        type: "toggle",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "mic_ok", label: "ใช้งานปกติ", icon: Mic },
          { id: "mic_failed", label: "มีปัญหา", icon: MicOff },
        ],
      },
      {
        id: "charger",
        question: "การชาร์จไฟ",
        icon: BatteryCharging,
        type: "toggle",
        // ✨ ถามเมื่อเป็นการกรอกข้อมูลด้วยตนเองเท่านั้น
        platforms: ["MANUAL_INPUT"],
        options: [
          { id: "charger_ok", label: "ชาร์จเข้าปกติ", icon: BatteryCharging },
          { id: "charger_failed", label: "ชาร์จไม่เข้า", icon: PowerOff },
        ],
      },
      {
        id: "call",
        question: "การโทร",
        icon: PhoneCall,
        type: "toggle",
        // ✨ ถามทุกเครื่อง ทุกกรณี (แม้จะเป็น interactive ก็อาจต้องถามเผื่อ)
        platforms: ["UNIVERSAL"],
        options: [
          { id: "call_ok", label: "โทรเข้า-ออกปกติ", icon: PhoneCall },
          { id: "call_failed", label: "มีปัญหาการโทร", icon: PhoneOff },
        ],
      },
      {
        id: "homeButton",
        question: "ปุ่ม Home",
        icon: CircleDot,
        type: "toggle",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "home_button_ok", label: "ใช้งานได้ปกติ", icon: CircleDot },
          { id: "home_button_failed", label: "ใช้งานไม่ได้", icon: CircleDot },
        ],
      },
      {
        id: "sensor",
        question: "Sensor",
        icon: RadioTower,
        type: "toggle",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "sensor_ok", label: "ทำงานปกติ", icon: RadioTower },
          { id: "sensor_failed", label: "มีปัญหา", icon: RadioTower },
        ],
      },
      {
        id: "buttons",
        question: "ปุ่ม Power / Volume",
        icon: Power,
        type: "toggle",
        // ✨ ถามทุกเครื่อง ทุกกรณี
        platforms: ["UNIVERSAL"],
        options: [
          { id: "buttons_ok", label: "กดได้ปกติ", icon: Power },
          { id: "buttons_failed", label: "กดไม่ได้/กดยาก", icon: Power },
        ],
      },
    ],
  },
];
