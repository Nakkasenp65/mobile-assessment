import { ComponentType } from "react";
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
} from "lucide-react";

export type Platform = "DESKTOP" | "IOS" | "ANDROID";
export type QuestionType = "choice" | "toggle";

export interface QuestionOption {
  id: string;
  label: string;
  icon: ComponentType<any>;
}

export interface Question {
  id: keyof ConditionInfo;
  question: string;
  icon: ComponentType<any>;
  type: QuestionType;
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
        question: "1. รุ่นโมเดลเครื่อง",
        icon: Smartphone,
        type: "choice",
        platforms: ["DESKTOP", "IOS", "ANDROID"],
        options: [
          { id: "model_th", label: "เครื่องไทย (TH)", icon: Smartphone },
          { id: "model_inter_new", label: "เครื่องนอก (ZP 14, 15, 16 Series)", icon: Smartphone },
          { id: "model_inter_old", label: "เครื่องนอกโมเดลอื่น", icon: Smartphone },
        ],
      },
      {
        id: "warranty",
        question: "2. ประกันศูนย์ Apple",
        icon: ShieldCheck,
        type: "choice",
        platforms: ["DESKTOP", "IOS"],
        options: [
          { id: "warranty_active_long", label: "เหลือมากกว่า 6 เดือน", icon: ShieldCheck },
          { id: "warranty_active_short", label: "เหลือน้อยกว่า 6 เดือน", icon: Clock },
          { id: "warranty_inactive", label: "หมดประกันแล้ว", icon: ShieldAlert },
        ],
      },
      {
        id: "accessories",
        question: "3. อุปกรณ์ในกล่อง",
        icon: Package,
        type: "choice",
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        question: "4. สภาพตัวเครื่องโดยรวม (เลือกได้หลายข้อ)",
        icon: Smartphone,
        type: "choice",
        platforms: ["DESKTOP", "IOS", "ANDROID"],
        options: [
          { id: "body_mint", label: "เหมือนใหม่ไม่มีรอย", icon: ShieldCheck },
          { id: "body_scratch_minor", label: "มีรอยเคส/สีลอก", icon: AlertTriangle },
          { id: "body_dent_major", label: "มีรอยตก/บุบ", icon: ImageOff },
        ],
      },
      {
        id: "screenGlass",
        question: "5. สภาพกระจกหน้าจอ",
        icon: RectangleHorizontal,
        type: "choice",
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        question: "6. คุณภาพการแสดงผล",
        icon: MonitorPlay,
        type: "choice",
        platforms: ["DESKTOP", "IOS", "ANDROID"],
        options: [
          { id: "display_ok", label: "แสดงผลปกติ สีสวย", icon: MonitorPlay },
          { id: "display_pixel_defect", label: "มีจุด Dead/Bright, มีเส้น", icon: Grid3x3 },
          { id: "display_burn_in", label: "จอเบิร์น/สีเพี้ยน/ไม่แสดงผล", icon: EyeOff },
        ],
      },
      {
        id: "batteryHealth",
        question: "7. สุขภาพแบตเตอรี่",
        icon: BatteryFull,
        type: "choice",
        platforms: ["DESKTOP", "IOS"],
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
        question: "8. กล้องหน้าและกล้องหลัง",
        icon: Camera,
        type: "choice",
        platforms: ["DESKTOP", "IOS"],
        options: [
          { id: "camera_ok", label: "ทำงานปกติ", icon: Camera },
          { id: "camera_issue_minor", label: "มีปัญหา (จุดดำ, ไม่โฟกัส)", icon: AlertTriangle },
          { id: "camera_defective", label: "ใช้งานไม่ได้", icon: CameraOff },
        ],
      },
      {
        id: "wifi",
        question: "Wi-Fi / Bluetooth",
        icon: Wifi,
        type: "toggle",
        platforms: ["DESKTOP", "IOS"],
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
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        platforms: ["DESKTOP", "IOS"],
        options: [
          { id: "speaker_ok", label: "ปกติ", icon: Speaker },
          { id: "speaker_failed", label: "ลำโพงแตก/ไม่ดัง/ไม่สั่น", icon: Vibrate },
        ],
      },
      {
        id: "charger",
        question: "การชาร์จไฟ",
        icon: BatteryCharging,
        type: "toggle",
        platforms: ["DESKTOP", "IOS"],
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
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        platforms: ["DESKTOP", "IOS", "ANDROID"],
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
        platforms: ["DESKTOP", "IOS", "ANDROID"],
        options: [
          { id: "buttons_ok", label: "กดได้ปกติ", icon: Power },
          { id: "buttons_failed", label: "กดไม่ได้/กดยาก", icon: Power },
        ],
      },
    ],
  },
];
