// src/types/serviceInfo.ts
import type { LucideIcon } from "lucide-react";

/**
 * @interface SellNowServiceInfo
 * @description ข้อมูลสำหรับบริการขายทันที (Sell Now)
 * @basedOn src/app/assess/components/(step3)/(services)/SellNowService.tsx
 */
export interface SellNowServiceInfo {
  customerName: string;
  phone: string;
  locationType: "home" | "bts" | "store";

  // ที่อยู่ (กรณีเลือก "ที่บ้าน")
  addressDetails?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postcode?: string;

  // BTS/MRT (กรณีเลือก "bts")
  btsStation?: string;

  // สาขา (กรณีเลือก "ที่ร้าน")
  storeLocation?: string;

  // วันและเวลานัดหมาย
  appointmentDate: string; // หรือ Date
  appointmentTime: string;
  nextSteps?: string[];
}

/**
 * @interface TradeInServiceInfo
 * @description ข้อมูลสำหรับบริการแลกซื้อเครื่องใหม่ (Trade-In)
 * @basedOn src/app/assess/components/(step3)/(services)/TradeInService.tsx
 */
export interface TradeInServiceInfo {
  customerName: string;
  phone: string;
  storeLocation: string;

  // ข้อมูลเครื่องใหม่ที่ต้องการ
  newDevice: string; // เก็บเป็น ID เช่น "iphone15pro"
  storage: string;
  color: string;

  // ความต้องการสภาพเครื่อง: มือหนึ่งหรือมือสอง
  phoneCondition: "first_hand" | "second_hand";

  // วันและเวลานัดหมาย
  appointmentDate: string; // หรือ Date
  appointmentTime: string;
  nextSteps?: string[];
}

/**
 * @interface ConsignmentServiceInfo
 * @description ข้อมูลสำหรับบริการฝากขาย (Consignment)
 * @basedOn src/app/assess/components/(step3)/(services)/ConsignmentService.tsx
 */
export interface ConsignmentServiceInfo {
  customerName: string;
  phone: string;
  storeLocation: string;
  additionalNotes?: string;

  // วันและเวลาส่งมอบเครื่อง (ปรับชื่อให้เป็นมาตรฐาน)
  appointmentDate: string; // หรือ Date
  appointmentTime: string;
  nextSteps?: string[];
}

/**
 * @interface RefinanceServiceInfo
 * @description ข้อมูลสำหรับบริการรีไฟแนนซ์
 * @basedOn src/app/assess/components/(step3)/(services)/RefinanceService.tsx
 */
export interface RefinanceServiceInfo {
  customerName: string;
  phone: string;
  occupation: "salaried" | "freelance" | "";
  documentFileUrl: string; // ในการเก็บลง DB อาจจะต้องเปลี่ยนเป็น URL ของไฟล์ที่อัปโหลดแล้ว

  // วันและเวลานัดหมาย
  appointmentTime: string;
  nextSteps?: string[];
}

/**
 * @interface IPhoneExchangeServiceInfo
 * @description ข้อมูลสำหรับบริการไอโฟนแลกเงิน
 * @basedOn src/app/assess/components/(step3)/(services)/IPhoneExchangeService.tsx
 */
export interface IPhoneExchangeServiceInfo {
  customerName: string;
  phone: string;

  // วันและเวลานัดหมาย (ปรับชื่อให้เป็นมาตรฐาน)
  appointmentTime: string;

  // ข้อมูลอาชีพและเอกสาร
  occupation: "salaried" | "freelance" | "";
  documentFileUrl: string; // เช่นเดียวกัน ควรเปลี่ยนเป็น URL ของไฟล์
  nextSteps?: string[];
}

/**
 * @interface PawnServiceInfo
 * @description ข้อมูลสำหรับบริการจำนำ
 * @basedOn src/app/assess/components/(step3)/(services)/PawnService.tsx
 */
export interface PawnServiceInfo {
  customerName: string;
  phone: string;
  locationType: "home" | "bts" | "store";

  // ข้อมูลสถานที่บริการ
  address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  postcode?: string;

  // BTS/MRT
  btsStation?: string;
  btsLine?: string;

  // สาขา (กรณีเลือก "ที่ร้าน")
  storeLocation?: string;

  // วันและเวลานัดหมาย
  appointmentDate: string;
  appointmentTime: string;

  nextSteps?: string[];
}

/**
 * @interface IcloudServiceInfo
 * @description ข้อมูลสำหรับบริการ iCloud
 */
export interface IcloudServiceInfo {
  customerName: string;
  appleId: string;
  password?: string; // รหัสผ่านอาจจะไม่เก็บลง DB โดยตรงเพื่อความปลอดภัย
  termsAccepted: boolean;

  // วันและเวลานัดหมาย
  appointmentDate: string; // หรือ Date
  appointmentTime: string;
  nextSteps?: string[];
}

/**
 * @interface ServiceOption
 * @description ตัวเลือกบริการที่แสดงใน UI
 */
export interface ServiceOption {
  id: string; // ตัวระบุบริการ เช่น "sell", "consignment", "tradein", "refinance", "iphone-exchange", "pawn", "maintenance"
  title: string; // ชื่อบริการที่แสดงใน UI
  description: string; // คำอธิบายสั้นของบริการ
  icon: LucideIcon; // ไอคอนจาก lucide-react
  price: number; // ราคาหรือวงเงินที่เกี่ยวข้องกับบริการ
}
