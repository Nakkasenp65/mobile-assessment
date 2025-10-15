"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ConditionInfo } from "../types/device";

// Normalized shape returned by the hook
export interface AssessmentData {
  id: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl?: string;
  };
  conditionInfo: ConditionInfo;
  estimatedValue: number;
  priceLockExpiresAt?: string; // optional in case backend does not provide
}

// Raw API response types
interface RawAssessmentRecord {
  _id: string;
  phoneNumber: string;
  device: {
    brand: string;
    model: string;
    storage: string;
    imageUrl?: string;
  };
  conditionInfo: ConditionInfo;
  pawnServiceInfo?: {
    customerName?: string;
    locationType?: "home" | "bts" | "store";
    btsLine?: string;
    btsStation?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    phone?: string;
  };
  status: "pending" | "completed" | "in-progress" | string;
  estimatedValue?: number;
  assessmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AssessmentApiResponse {
  success: boolean;
  data: RawAssessmentRecord[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://assessments-api-ten.vercel.app";

const sanitizeImageUrl = (url?: string) => (url ? url.replace(/`/g, "").trim() : undefined);

async function fetchAssessment(id: string): Promise<AssessmentData> {
  const endpoint = `${BACKEND_URL}/api/assessments/${id}`;
  const { data } = await axios.get<AssessmentApiResponse>(endpoint);

  if (!data || !data.success || !Array.isArray(data.data)) {
    throw new Error("Invalid response from assessments API");
  }

  const record = data.data.find((r) => r._id === id) ?? data.data[0];
  if (!record) {
    throw new Error("Assessment not found");
  }

  return {
    id: record._id,
    device: {
      brand: record.device?.brand ?? "",
      model: record.device?.model ?? "",
      storage: record.device?.storage ?? "",
      imageUrl: sanitizeImageUrl(record.device?.imageUrl),
    },
    conditionInfo: record.conditionInfo,
    estimatedValue: typeof record.estimatedValue === "number" ? record.estimatedValue : 0,
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
