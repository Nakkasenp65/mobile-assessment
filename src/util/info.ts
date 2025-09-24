import { ConditionInfo } from "../app/assess/page";
import {
  ShieldCheck,
  FrameCorners,
  MonitorPlay,
  EyeSlash,
  DotsNine,
  Power,
  ClockClockwise,
  Camera,
  CameraSlash,
  Warning,
  WifiHigh,
  WifiSlash,
  BatteryChargingVertical,
  BatteryWarningVertical,
  ImageBroken,
} from "@phosphor-icons/react";
import { ComponentType } from "react";

// [FIX] Updated interface to include severity
export interface QuestionOption {
  value: string;
  label: string;
  icon: ComponentType<any>;
  severity?: "positive" | "warning" | "negative";
}

export interface Question {
  id: keyof ConditionInfo;
  question: string;
  options: QuestionOption[];
}

export const PHYSICAL_QUESTIONS: Array<{
  section: string;
  questions: Question[];
}> = [
  {
    section: "สภาพหน้าจอ",
    questions: [
      {
        id: "screenGlass",
        question: "สภาพกระจกหน้าจอ?",
        options: [
          {
            value: "passed",
            label: "ไม่มีรอยขีดข่วน",
            icon: ShieldCheck,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีรอยเล็กน้อย",
            icon: FrameCorners,
            severity: "warning",
          },
          {
            value: "defect",
            label: "กระจกแตก",
            icon: ImageBroken,
            severity: "negative",
          },
        ],
      },
      {
        id: "screenDisplay",
        question: "คุณภาพการแสดงผล?",
        options: [
          {
            value: "passed",
            label: "แสดงผลปกติ",
            icon: MonitorPlay,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีจุดดำ/เส้น",
            icon: DotsNine,
            severity: "warning",
          },
          {
            value: "defect",
            label: "ไม่แสดงผล",
            icon: EyeSlash,
            severity: "negative",
          },
        ],
      },
      {
        id: "touchScreen",
        question: "การทำงานของหน้าจอสัมผัส",
        options: [
          {
            value: "passed",
            label: "สัมผัสได้ทั้งหมด",
            icon: MonitorPlay,
            severity: "positive",
          },
          {
            value: "failed",
            label: "บางจุดสัมผัสไม่ได้",
            icon: DotsNine,
            severity: "warning",
          },
        ],
      },
    ],
  },
  {
    section: "ตัวเครื่องและการทำงาน",
    questions: [
      {
        id: "powerOn",
        question: "การเปิดเครื่อง?",
        options: [
          {
            value: "passed",
            label: "เปิด-ปิดปกติ",
            icon: Power,
            severity: "positive",
          },
          {
            value: "failed",
            label: "เปิดติดบ้าง",
            icon: ClockClockwise,
            severity: "warning",
          },
        ],
      },
      {
        id: "camera",
        question: "การทำงานของกล้อง?",
        options: [
          {
            value: "passed", // เปลี่ยนจาก "all_work"
            label: "ทำงานปกติ",
            icon: Camera,
            severity: "positive",
          },
          {
            value: "failed", // เปลี่ยนจาก "some_work" และ "not_work"
            label: "มีปัญหา",
            icon: CameraSlash,
            severity: "negative",
          },
        ],
      },
    ],
  },
];

export const IOS_MANUAL_QUESTIONS: Array<{
  section: string;
  questions: Question[];
}> = [
  {
    section: "การเชื่อมต่อ",
    questions: [
      {
        id: "wifi",
        question: "การเชื่อมต่อ Wi-Fi?",
        options: [
          {
            value: "passed",
            label: "ทำงานปกติ",
            icon: WifiHigh,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีปัญหา",
            icon: WifiSlash,
            severity: "negative",
          },
        ],
      },
      {
        id: "charger",
        question: "การชาร์จไฟ?",
        options: [
          {
            value: "passed",
            label: "ชาร์จเข้าปกติ",
            icon: BatteryChargingVertical,
            severity: "positive",
          },
          {
            value: "failed",
            label: "มีปัญหา",
            icon: BatteryWarningVertical,
            severity: "negative",
          },
        ],
      },
    ],
  },
];

export const DESKTOP_QUESTIONS = [
  ...PHYSICAL_QUESTIONS,
  ...IOS_MANUAL_QUESTIONS,
];
