import { ConditionInfo, DeviceInfo } from "./device";
import {
  ConsignmentServiceInfo,
  IPhoneExchangeServiceInfo,
  PawnServiceInfo,
  RefinanceServiceInfo,
  SellNowServiceInfo,
  TradeInServiceInfo,
} from "./service";

export interface AssessmentRecord {
  id: string;
  docId: string;
  phoneNumber: string;
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  assessmentDate: string;
  priceLockExpiresAt: string;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
  createdAt: string;
  updatedAt: string;
}

// New payload structure for POST /assessments
export interface PawnServicePayload {
  locationType: "home" | "bts" | "store";
  btsLine?: string;
  btsStation?: string;
  appointmentDate: string;
  appointmentTime: string;
}

export interface AssessmentCreatePayload {
  phoneNumber: string;
  customerName: string;
  device: {
    brand: string;
    model: string;
    storage: string;
  };
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
  status: "completed" | "pending" | "in-progress" | string;
  estimatedValue: number;
}
