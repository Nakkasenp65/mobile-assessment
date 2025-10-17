"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ConditionInfo, DeviceInfo } from "../types/device";

interface CreateAssessmentInput {
  phoneNumber: string;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  // Optional: allow caller to provide a specific expiry; server will validate/default
  expiredAt?: string;
}

interface RawAssessmentRecord {
  _id: string;
  phoneNumber: string;
  device: {
    brand: string;
    model: string;
    storage: string;
  };
  conditionInfo: ConditionInfo;
  status: "pending" | "completed" | "in-progress" | string;
  estimatedValue?: number;
  assessmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AssessmentApiResponse {
  success: boolean;
  data: RawAssessmentRecord;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function ensureConditionDefaults(ci: ConditionInfo): ConditionInfo {
  return {
    canUnlockIcloud: ci.canUnlockIcloud ?? false,
    modelType: ci.modelType ?? "",
    warranty: ci.warranty ?? "",
    openedOrRepaired: ci.openedOrRepaired ?? "",
    accessories: ci.accessories ?? "",
    bodyCondition: ci.bodyCondition ?? "",
    screenGlass: ci.screenGlass ?? "",
    screenDisplay: ci.screenDisplay ?? "",
    batteryHealth: ci.batteryHealth ?? "",
    camera: ci.camera ?? "",
    wifi: ci.wifi ?? "",
    faceId: ci.faceId ?? "",
    speaker: ci.speaker ?? "",
    mic: ci.mic ?? "",
    touchScreen: ci.touchScreen ?? "",
    charger: ci.charger ?? "",
    call: ci.call ?? "",
    homeButton: ci.homeButton ?? "",
    sensor: ci.sensor ?? "",
    buttons: ci.buttons ?? "",
  };
}

function validateInput(input: CreateAssessmentInput): string[] {
  const errors: string[] = [];
  if (!input.phoneNumber) errors.push("กรุณากรอกหมายเลขโทรศัพท์");
  if (!input.deviceInfo?.model) errors.push("กรุณาเลือกชื่อรุ่น");
  if (!input.conditionInfo) errors.push("ข้อมูลสภาพเครื่องไม่ครบถ้วน");
  return errors;
}

export function useCreateAssessment() {
  const router = useRouter();

  return useMutation<AssessmentApiResponse, Error, CreateAssessmentInput>({
    mutationFn: async (input) => {
      const validationErrors = validateInput(input);
      if (validationErrors.length) {
        throw new Error(validationErrors.join("; "));
      }

      const payload = {
        phoneNumber: input.phoneNumber.replace(/\D/g, ""),
        status: "pending",
        estimatedValue: 19999,
        deviceInfo: {
          brand: input.deviceInfo.brand,
          model: input.deviceInfo.model,
          storage: input.deviceInfo.storage,
        },
        conditionInfo: ensureConditionDefaults(input.conditionInfo),
        // include expiredAt if provided; server will default if absent
        ...(input.expiredAt ? { expiredAt: input.expiredAt } : {}),
      };

      try {
        // Call our local API route to enforce expiredAt validation and defaulting
        const { data } = await axios.post<AssessmentApiResponse>(`/api/assessments`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (!data?.success || !data.data?._id) {
          throw new Error("การตอบกลับจาก API ไม่ถูกต้อง");
        }
        return data;
      } catch (err) {
        const axErr = err as AxiosError<{ message?: string } & { error?: { message?: string } }>;
        const msg = axErr.response?.data?.error?.message || axErr.response?.data?.message || axErr.message || "ไม่สามารถสร้างรายการประเมินได้";
        console.error("POST /api/assessments failed:", axErr);
        throw new Error(msg);
      }
    },
    onSuccess: (res) => {
      const id = res.data._id;
      router.push(`/details/${id}`);
    },
  });
}
