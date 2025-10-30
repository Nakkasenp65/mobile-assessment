// src/util/serviceStatus.ts
import type { Assessment } from "@/types/assessment";

export type ServiceId =
  | "sell"
  | "consignment"
  | "tradein"
  | "refinance"
  | "iphone-exchange"
  // | "pawn"
  | "maintenance";

export interface ServiceStatus {
  reserved: boolean;
  expired: boolean;
  lockedUntil?: string | null;
  label: string; // e.g. "จองแล้ว", "หมดอายุ", "พร้อมให้บริการ"
  message?: string;
}

const serviceFieldMap: Record<Exclude<ServiceId, "maintenance">, keyof Assessment> = {
  sell: "sellNowServiceInfo",
  consignment: "consignmentServiceInfo",
  tradein: "tradeInServiceInfo",
  refinance: "refinanceServiceInfo",
  "iphone-exchange": "iphoneExchangeServiceInfo",
  // pawn: "pawnServiceInfo",
};

export function getServiceStatus(
  assessment: Assessment | undefined,
  serviceId: ServiceId,
): ServiceStatus {
  // Maintenance service is special — not reservable by payload presence
  if (serviceId === "maintenance") {
    return {
      reserved: false,
      expired: false,
      lockedUntil: assessment?.priceLockExpiresAt ?? null,
      label: "พร้อมให้บริการ",
      message: "เลือกซ่อมเฉพาะส่วนที่ต้องการ",
    };
  }

  const hasPayload = !!assessment && !!assessment[serviceFieldMap[serviceId]];

  const now = Date.now();
  const expiresAt = assessment?.priceLockExpiresAt
    ? Date.parse(assessment.priceLockExpiresAt)
    : null;
  const expired = typeof expiresAt === "number" ? now > expiresAt : false;

  if (hasPayload) {
    return {
      reserved: true,
      expired,
      lockedUntil: assessment?.priceLockExpiresAt ?? null,
      label: expired ? "หมดอายุ" : "จองแล้ว",
      message: expired
        ? "การจองหมดอายุแล้ว กรุณาดำเนินการใหม่"
        : "คุณได้จองบริการนี้แล้ว ดูรายละเอียดการนัดหมายได้",
    };
  }

  return {
    reserved: false,
    expired,
    lockedUntil: assessment?.priceLockExpiresAt ?? null,
    label: expired ? "หมดอายุ" : "พร้อมให้บริการ",
    message: expired ? "ราคาล็อคหมดอายุแล้ว กรุณาประเมินใหม่" : "บริการพร้อมให้จอง",
  };
}

export function isServiceReserved(
  assessment: Assessment | undefined,
  serviceId: ServiceId,
): boolean {
  return getServiceStatus(assessment, serviceId).reserved;
}

/**
 * Pick the first reserved service ID in a consistent order.
 * Falls back to undefined if none reserved.
 */
export function pickReservedServiceId(assessment: Assessment | undefined): ServiceId | undefined {
  const order: ServiceId[] = [
    "sell",
    "consignment",
    "tradein",
    "refinance",
    "iphone-exchange",
    // "pawn",
  ];
  return order.find((id) => isServiceReserved(assessment, id));
}
