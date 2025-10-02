// src/util/info.ts
import { CameraSlashIcon } from "@phosphor-icons/react";
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
  PowerOff, // ไอคอนสำหรับ charger:failed
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
        icon: Smartphone,
        options: [
          {
            value: "th",
            label: "เครื่องไทย (TH)",
            icon: Smartphone,
            severity: "positive",
          },
          {
            value: "other",
            label: "เครื่องนอก ZP 14, 15, 16 Series",
            icon: Smartphone,
            severity: "positive",
          },
        ],
      },
      {
        id: "warranty",
        question: "2. ประกันศูนย์ Apple",
        icon: ShieldCheck,
        options: [
          {
            value: "active_long",
            label: "เหลือมากกว่า 6 เดือน",
            icon: ShieldCheck,
            severity: "positive",
          },
          {
            value: "active_short",
            label: "เหลือน้อยกว่า 6 เดือน",
            icon: Clock,
            severity: "warning",
          },
          {
            value: "inactive",
            label: "หมดประกันแล้ว",
            icon: ShieldAlert,
            severity: "negative",
          },
        ],
      },
      {
        id: "accessories",
        question: "3. อุปกรณ์ในกล่อง",
        icon: Package,
        options: [
          {
            value: "full",
            label: "ครบกล่อง",
            icon: Package,
            severity: "positive",
          },
          {
            value: "box_only",
            label: "มีเฉพาะกล่อง",
            icon: Archive,
            severity: "warning",
          },
          {
            value: "no_box",
            label: "ไม่มีกล่อง",
            icon: HelpCircle,
            severity: "negative",
          },
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
        icon: Smartphone,
        options: [
          {
            value: "passed",
            label: "เหมือนใหม่ไม่มีรอย",
            icon: ShieldCheck,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีรอยเคส สีลอก",
            icon: AlertTriangle,
            severity: "negative",
          },
          {
            value: "defect",
            label: "มีรอยตก บุบ",
            icon: ImageOff,
            severity: "negative",
          },
        ],
      },
      {
        id: "screenGlass",
        question: "5. สภาพกระจกหน้าจอ",
        icon: RectangleHorizontal,
        options: [
          {
            value: "passed",
            label: "ไม่มีรอย",
            icon: ShieldCheck,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีรอยขนแมว",
            icon: Frame,
            severity: "warning",
          },
          {
            value: "defect",
            label: "กระจกแตก บิ่น ร้าว",
            icon: ImageOff,
            severity: "negative",
          },
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
        options: [
          {
            value: "passed",
            label: "แสดงผลปกติ สีสวย",
            icon: MonitorPlay,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีจุด Dead/Bright, มีเส้น",
            icon: Grid3x3,
            severity: "warning",
          },
          {
            value: "defect",
            label: "จอเบิร์น/สีเพี้ยน/ไม่แสดงผล",
            icon: EyeOff,
            severity: "negative",
          },
        ],
      },
      {
        id: "batteryHealth",
        question: "7. สุขภาพแบตเตอรี่",
        icon: BatteryFull,
        options: [
          {
            value: "high",
            label: "มากกว่า 90%",
            icon: BatteryFull,
            severity: "positive",
          },
          {
            value: "medium",
            label: "80% - 89%",
            icon: BatteryWarning,
            severity: "negative",
          },
          {
            value: "low",
            label: "ต่ำกว่า80% หรือขึ้น Service",
            icon: BatteryWarning,
            severity: "negative",
          },
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
        options: [
          {
            value: "passed",
            label: "ทำงานปกติทุกฟังก์ชัน",
            icon: Camera,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีปัญหา (เช่น จุดดำ, ไม่โฟกัส, มีเลเซอร์)",
            icon: Camera,
            severity: "negative",
          },
          {
            value: "defect",
            label: "ใช้งานไม่ได้",
            icon: CameraSlashIcon,
            severity: "negative",
          },
        ],
      },
      {
        id: "wifi",
        question: "9. การเชื่อมต่อ Wi-Fi / Bluetooth",
        icon: Wifi,
        options: [
          {
            value: "passed",
            label: "เชื่อมต่อได้ปกติ",
            icon: Wifi,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีปัญหาการเชื่อมต่อ",
            icon: WifiOff,
            severity: "negative",
          },
        ],
      },
      {
        id: "faceId",
        question: "10. Face ID / Touch ID",
        icon: ScanFace,
        options: [
          {
            value: "passed",
            label: "สแกนได้ปกติ",
            icon: ScanFace,
            severity: "positive",
          },
          {
            value: "failed",
            label: "สแกนไม่ได้/มีปัญหา",
            icon: Fingerprint,
            severity: "negative",
          },
        ],
      },
      {
        id: "speaker",
        question: "11. ลำโพงและการสั่น",
        icon: Speaker,
        options: [
          {
            value: "passed",
            label: "เสียงดังปกติและสั่น",
            icon: Speaker,
            severity: "positive",
          },
          {
            value: "failed",
            label: "ลำโพงแตก/ไม่สั่น/ไม่ได้ยิน",
            icon: Vibrate,
            severity: "negative",
          },
        ],
      },
      {
        id: "charger",
        question: "12. การชาร์จไฟ",
        icon: BatteryCharging,
        options: [
          {
            value: "passed",
            label: "ชาร์จไฟเข้าปกติ",
            icon: BatteryCharging,
            severity: "positive",
          },
          {
            value: "failed",
            label: "ชาร์จไม่เข้า/มีปัญหา",
            icon: PowerOff,
            severity: "negative",
          },
        ],
      },
    ],
  },
];

export const DESKTOP_QUESTIONS = ASSESSMENT_QUESTIONS;
// -- สร้างชุดคำถามสำหรับ iOS --
// 1. กำหนด ID ของคำถามที่ต้องการกรองออก (เพราะมีใน Interactive Test)
const iosQuestionsToRemove = ["camera", "speaker", "batteryHealth", "wifi", "mic", "touchScreen"];

// 2. สร้างชุดคำถามสำหรับ iOS โดยการกรองคำถามที่ไม่ต้องการออกไป
export const MOBILE_IOS_QUESTIONS = ASSESSMENT_QUESTIONS.map((section) => ({
  ...section,
  questions: section.questions.filter((question) => !iosQuestionsToRemove.includes(question.id)),
  // กรอง section ที่อาจจะว่างเปล่าหลังจากการ filter ออก (ถ้ามี)
})).filter((section) => section.questions.length > 0);

const androidBaseSections = ASSESSMENT_QUESTIONS.filter(
  (s) => s.section === "สภาพภายนอก" || s.section === "ข้อมูลทั่วไปของเครื่อง",
);
const basicFunctionsSection = ASSESSMENT_QUESTIONS.find(
  (s) => s.section === "ฟังก์ชันการทำงานพื้นฐาน",
);
const faceIdQuestion = basicFunctionsSection?.questions.find((q) => q.id === "faceId");
const androidExtraSection = faceIdQuestion
  ? [
      {
        section: "ฟังก์ชันการทำงานพื้นฐาน",
        questions: [faceIdQuestion],
      },
    ]
  : [];

export const MOBILE_ANDROID_QUESTIONS = [...androidBaseSections, ...androidExtraSection];
