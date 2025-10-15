import { ConditionInfo, DeviceInfo } from "./device";
import {
  ConsignmentServiceInfo,
  IPhoneExchangeServiceInfo,
  PawnServiceInfo,
  RefinanceServiceInfo,
  SellNowServiceInfo,
} from "./service";

export interface AssessmentRecord {
  id: string;
  phoneNumber: string;
  customerName: string;
  assessmentDate: string;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: PawnServiceInfo;
  sellNowServiceInfo?: SellNowServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  status: "completed" | "pending" | "in-progress";
  estimatedValue: number;
  priceLockExpiresAt: string;
  nextSteps: string[];
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
  status: "completed" | "pending" | "in-progress" | string;
  estimatedValue: number;
}
