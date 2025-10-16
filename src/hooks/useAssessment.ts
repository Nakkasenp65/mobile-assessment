"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ConditionInfo } from "../types/device";
import {
  ConsignmentServiceInfo,
  IPhoneExchangeServiceInfo,
  PawnServiceInfo,
  RefinanceServiceInfo,
  SellNowServiceInfo,
} from "../types/service";

// Normalized shape returned by the hook
export interface AssessmentData {
  id: string;
  docId?: string;
  phoneNumber?: string;
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
  status?: "pending" | "completed" | "in-progress" | string;
  estimatedValue: number;
  assessmentDate?: string;
  priceLockExpiresAt?: string; // optional in case backend does not provide
}

// Raw API response types
interface RawAssessmentRecord {
  _id: string;
  docId?: string;
  phoneNumber: string;
  device?: {
    brand: string;
    model: string;
    storage: string;
  };
  deviceInfo?: {
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
  status: "pending" | "completed" | "in-progress" | string;
  estimatedValue?: number;
  assessmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AssessmentApiResponse {
  success: boolean;
  data: RawAssessmentRecord; // API returns a single record for GET /assessments/:id
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchAssessment(id: string): Promise<AssessmentData> {
  const endpoint = `${BACKEND_URL}/api/assessments/${id}`;
  const { data } = await axios.get<AssessmentApiResponse>(endpoint);

  console.log(data);

  if (!data || !data.success || !data.data || typeof data.data !== "object") {
    throw new Error("Invalid response from assessments API");
  }

  const record = data.data;

  return {
    id: record._id,
    docId: record.docId,
    phoneNumber: record.phoneNumber,
    device: (() => {
      const dev = record.device ?? record.deviceInfo;
      return {
        brand: dev?.brand ?? "",
        model: dev?.model ?? "",
        storage: dev?.storage ?? "",
      };
    })(),
    conditionInfo: record.conditionInfo,
    pawnServiceInfo: record.pawnServiceInfo,
    status: record.status,
    estimatedValue: typeof record.estimatedValue === "number" ? record.estimatedValue : 0,
    assessmentDate: record.assessmentDate ?? record.createdAt,
    // Backend does not provide priceLockExpiresAt; leave undefined
    priceLockExpiresAt: undefined,
  };
}

export function useAssessment(assessmentId: string | undefined) {
  return useQuery<AssessmentData, Error>({
    queryKey: ["assessment", assessmentId],
    queryFn: () => fetchAssessment(String(assessmentId)),
    enabled: !!assessmentId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
