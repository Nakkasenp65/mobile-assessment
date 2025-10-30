// src/hooks/useAssessment.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RawAssessmentRecord, Assessment } from "../types/assessment";

// Normalized shape returned by the hook aligns with canonical Assessment
export type AssessmentData = Assessment;

interface AssessmentApiResponse {
  success: boolean;
  data: RawAssessmentRecord; // API returns a single record for GET /assessments/:id
}

async function fetchAssessment(id: string): Promise<AssessmentData> {
  const endpoint = `/api/assessments/${id}`;
  const { data } = await axios.get<AssessmentApiResponse>(endpoint);

  if (!data || !data.success || !data.data || typeof data.data !== "object") {
    throw new Error("Invalid response from assessments API");
  }

  const record = data.data;

  const deviceInfo = record.deviceInfo ?? {
    brand: record.device?.brand ?? "",
    model: record.device?.model ?? "",
    storage: record.device?.storage ?? "",
    productType: undefined,
  };

  // Extract type from service info if not present at root level (for backward compatibility)
  let type = record.type;
  if (!type) {
    // Check which service info exists and infer the type
    if (record.sellNowServiceInfo) {
      type = "SELL_NOW";
    } else if (record.consignmentServiceInfo) {
      type = "CONSIGNMENT";
    } else if (record.refinanceServiceInfo) {
      type = "REFINANCE";
    } else if (record.iphoneExchangeServiceInfo) {
      type = "IPHONE_EXCHANGE";
    } else if (record.tradeInServiceInfo) {
      type = "TRADE_IN";
    }
  }

  return {
    id: record._id,
    docId: record.docId,
    phoneNumber: record.phoneNumber,
    customerName: record.customerName,
    deviceInfo,
    conditionInfo: record.conditionInfo,
    // pawnServiceInfo: record.pawnServiceInfo,
    sellNowServiceInfo: record.sellNowServiceInfo,
    consignmentServiceInfo: record.consignmentServiceInfo,
    refinanceServiceInfo: record.refinanceServiceInfo,
    iphoneExchangeServiceInfo: record.iphoneExchangeServiceInfo,
    tradeInServiceInfo: record.tradeInServiceInfo,
    status: (record.status as Assessment["status"]) ?? "pending",
    estimatedValue: typeof record.estimatedValue === "number" ? record.estimatedValue : 0,
    assessmentDate: record.assessmentDate ?? record.createdAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    expiredAt: record.expiredAt,
    type: record.type,
  } satisfies Assessment;
}

export function useAssessment(assessmentId: string) {
  return useQuery<AssessmentData, Error>({
    queryKey: ["assessment", assessmentId],
    queryFn: () => fetchAssessment(assessmentId),
    enabled: !!assessmentId,
    refetchOnWindowFocus: true,
  });
}
