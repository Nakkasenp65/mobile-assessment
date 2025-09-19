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
            value: "perfect",
            label: "ไม่มีรอยขีดข่วน",
            icon: ShieldCheck,
            severity: "positive",
          },
          {
            value: "minor",
            label: "มีรอยเล็กน้อย",
            icon: FrameCorners,
            severity: "warning",
          },
          {
            value: "cracked",
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
            value: "perfect",
            label: "แสดงผลปกติ",
            icon: MonitorPlay,
            severity: "positive",
          },
          {
            value: "spots",
            label: "มีจุดดำ/เส้น",
            icon: DotsNine,
            severity: "warning",
          },
          {
            value: "not_working",
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
            value: "perfect",
            label: "สัมผัสได้ทั้งหมด",
            icon: MonitorPlay,
            severity: "positive",
          },
          {
            value: "spots",
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
            value: "yes",
            label: "เปิด-ปิดปกติ",
            icon: Power,
            severity: "positive",
          },
          {
            value: "sometimes",
            label: "เปิดติดบ้าง",
            icon: ClockClockwise,
            severity: "warning",
          },
        ],
      },
      {
        id: "cameras",
        question: "การทำงานของกล้อง?",
        options: [
          {
            value: "all_work",
            label: "ทำงานปกติ",
            icon: Camera,
            severity: "positive",
          },
          {
            value: "some_work",
            label: "มีปัญหาบางส่วน",
            icon: Warning,
            severity: "warning",
          },
          {
            value: "not_work",
            label: "ไม่ทำงาน",
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
            value: "good",
            label: "ทำงานปกติ",
            icon: WifiHigh,
            severity: "positive",
          },
          {
            value: "poor",
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
            value: "success",
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
