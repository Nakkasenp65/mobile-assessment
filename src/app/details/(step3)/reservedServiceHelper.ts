// src/app/details/(step3)/reservedServiceHelper.ts

import { Assessment } from "../../../types/assessment";
import { ServiceId } from "./serviceConfig";

/**
 * ตรวจสอบว่า assessment มี service ที่จองแล้วหรือไม่
 * @param assessmentData - ข้อมูล assessment
 * @returns ServiceId ของ service ที่จองแล้ว หรือ null ถ้าไม่มี
 */
export const getReservedService = (assessmentData?: Assessment): ServiceId | null => {
  if (!assessmentData) return null;

  // ตรวจสอบแต่ละ service ตามลำดับ
  if (assessmentData.sellNowServiceInfo) return "sell";
  if (assessmentData.consignmentServiceInfo) return "consignment";
  if (assessmentData.tradeInServiceInfo) return "tradein";
  if (assessmentData.refinanceServiceInfo) return "refinance";
  if (assessmentData.iphoneExchangeServiceInfo) return "iphone-exchange";
  if (assessmentData.pawnServiceInfo) return "pawn";

  return null;
};

/**
 * ตรวจสอบว่า assessment มี service ที่จองแล้วหรือไม่
 * @param assessmentData - ข้อมูล assessment
 * @returns boolean
 */
export const hasReservedService = (assessmentData?: Assessment): boolean => {
  return getReservedService(assessmentData) !== null;
};
