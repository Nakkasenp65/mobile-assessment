// src/types/assessment.ts

import { ConditionInfo, DeviceInfo } from "./device";
import {
  ConsignmentServiceInfo,
  IPhoneExchangeServiceInfo,
  PawnServiceInfo,
  RefinanceServiceInfo,
  SellNowServiceInfo,
  TradeInServiceInfo,
} from "./service";

// Canonical lightweight device summary used across UI
export interface DeviceSummary {
  brand: string;
  model: string;
  storage: string;
}

// Canonical Assessment type used across the app (UI, hooks, and most API surfaces)
export interface Assessment {
  id: string;
  docId?: string;
  phoneNumber: string;
  line_user_id?: string; // LINE User ID (เฉพาะผู้ใช้บน LIFF)
  status: "completed" | "reserved" | "pending" | "cancelled" | "in-progress" | string;
  estimatedValue: number;
  // Dates are ISO 8601 strings when provided
  assessmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  priceLockExpiresAt?: string;
  // Canonical device shape for assessment flow (matches src/types/device.ts)
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  // Optional service payloads
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
  email?: string;
}

// Backward compat alias to ease refactors in older files
export type AssessmentRecord = Assessment;

export interface PawnServicePayload {
  locationType: "home" | "bts" | "store";
  btsLine?: string;
  btsStation?: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AssessmentCreatePayload {
  phoneNumber: string;
  line_user_id?: string; // LINE User ID (เฉพาะผู้ใช้บน LIFF)
  customerName?: string; // optional for now; not all flows collect it at creation time
  deviceInfo: DeviceInfo; // Keep payload consistent with assessment flow
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
  status: "completed" | "pending" | "in-progress" | string;
  estimatedValue: number;
  // Added: price lock expiration control (ISO 8601 string, required server-side)
  expiredAt: string;
}

// Raw API record shape as commonly returned by backend(s)
export interface RawAssessmentRecord {
  _id: string;
  docId?: string;
  phoneNumber: string;
  line_user_id?: string; // LINE User ID (เฉพาะผู้ใช้บน LIFF)
  status: "completed" | "pending" | "in-progress" | string;
  estimatedValue?: number;
  assessmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  priceLockExpiresAt?: string;
  device?: DeviceSummary;
  deviceInfo?: DeviceInfo;
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
}
