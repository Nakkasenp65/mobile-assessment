"use client";

import { useQuery } from "@tanstack/react-query";
import { ConditionInfo } from "../types/device";

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
  priceLockExpiresAt: string;
}

const getExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

function mockAssessment(id: string): AssessmentData {
  return {
    id,
    device: {
      brand: "Apple",
      model: "iPhone 15 Pro",
      storage: "256GB",
      imageUrl: "https://lh3.googleusercontent.com/d/14EB_azrtiSrLtPVlIxWiU5Vg1hS8aw1A",
    },
    conditionInfo: {
      modelType: "model_th",
      warranty: "warranty_active_long",
      accessories: "acc_full",
      bodyCondition: "body_mint",
      screenGlass: "glass_ok",
      screenDisplay: "display_ok",
      batteryHealth: "battery_health_high",
      camera: "camera_ok",
      wifi: "wifi_ok",
      faceId: "biometric_ok",
      speaker: "speaker_ok",
      mic: "mic_ok",
      touchScreen: "touchscreen_ok",
      charger: "charger_ok",
      call: "call_ok",
      homeButton: "home_button_ok",
      sensor: "sensor_ok",
      buttons: "buttons_ok",
      canUnlockIcloud: true,
    },
    estimatedValue: 28500,
    priceLockExpiresAt: getExpiryDate(3),
  };
}

async function fetchAssessment(id: string): Promise<AssessmentData> {
  // Simulate network delay 300-500ms
  const delay = 300 + Math.floor(Math.random() * 200);
  await new Promise((res) => setTimeout(res, delay));

  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(`assessment:${id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Merge with mock to ensure structure completeness
        const mock = mockAssessment(id);
        return {
          ...mock,
          device: { ...mock.device, ...(parsed.device || {}) },
          conditionInfo: { ...mock.conditionInfo, ...(parsed.conditionInfo || {}) },
          estimatedValue: typeof parsed.estimatedValue === "number" ? parsed.estimatedValue : mock.estimatedValue,
        };
      } catch (e) {
        // fall back to mock
      }
    }
  }

  return mockAssessment(id);
}

export function useAssessment(assessmentId: string | undefined) {
  return useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => fetchAssessment(String(assessmentId)),
    enabled: !!assessmentId,
  });
}
