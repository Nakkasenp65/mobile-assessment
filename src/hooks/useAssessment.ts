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

  return {
    id: record._id,
    docId: record.docId,
    phoneNumber: record.phoneNumber,
    deviceInfo,
    conditionInfo: record.conditionInfo,
    pawnServiceInfo: record.pawnServiceInfo,
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
    priceLockExpiresAt: record.priceLockExpiresAt,
  } satisfies Assessment;
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
