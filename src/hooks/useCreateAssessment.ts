"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ConditionInfo, DeviceInfo } from "../types/device";

interface CreateAssessmentInput {
  phoneNumber: string;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
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
  const errs: string[] = [];
  const phone = (input.phoneNumber || "").replace(/\D/g, "");
  if (!phone) errs.push("กรุณากรอกเบอร์โทรศัพท์");
  else if (!/^\d{10}$/.test(phone)) errs.push("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
  if (!input.deviceInfo?.brand) errs.push("กรุณาเลือกยี่ห้ออุปกรณ์");
  if (!input.deviceInfo?.model) errs.push("กรุณาเลือกรุ่นอุปกรณ์");
  // Relax storage requirement for Apple non-iPhone/iPad
  const isApple = input.deviceInfo?.brand === "Apple";
  const type = input.deviceInfo?.productType;
  const requiresStorage = !isApple || type === "iPhone" || type === "iPad";
  if (requiresStorage && !input.deviceInfo?.storage) errs.push("กรุณาเลือกความจุอุปกรณ์");
  // Minimal validation for conditionInfo presence
  if (!input.conditionInfo) errs.push("ข้อมูลสภาพเครื่องไม่ครบถ้วน");
  return errs;
}

export function useCreateAssessment() {
  const router = useRouter();

  return useMutation<AssessmentApiResponse, Error, CreateAssessmentInput>({
    mutationFn: async (input) => {
      if (!BACKEND_URL) {
        throw new Error("ค่า BACKEND_URL ไม่ถูกตั้งค่าใน Environment");
      }

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
      };

      try {
        const { data } = await axios.post<AssessmentApiResponse>(`${BACKEND_URL}/api/assessments`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (!data?.success || !data.data?._id) {
          throw new Error("การตอบกลับจาก API ไม่ถูกต้อง");
        }
        return data;
      } catch (err) {
        const axErr = err as AxiosError<{ message?: string }>;
        const msg = axErr.response?.data?.message || axErr.message || "ไม่สามารถสร้างรายการประเมินได้";
        console.error("POST /assessments failed:", axErr);
        throw new Error(msg);
      }
    },
    onSuccess: (res) => {
      const id = res.data._id;
      router.push(`/details/${id}`);
    },
  });
}
