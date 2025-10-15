// src/types/device.ts
export interface DeviceInfo {
  brand: string;
  productType?: "iPhone" | "iPad" | "Mac" | "Apple Watch" | "AirPods" | string;
  model: string;
  storage: string;
}

export interface ConditionInfo {
  canUnlockIcloud: boolean;
  // ข้อมูลทั่วไป
  modelType: "model_th" | "model_inter_new" | "model_inter_old" | "";
  warranty: "warranty_active_long" | "warranty_active_short" | "warranty_inactive" | "";
  accessories: "acc_full" | "acc_box_only" | "acc_no_box" | "";

  // สภาพภายนอก
  bodyCondition: "body_mint" | "body_scratch_minor" | "body_dent_major" | "";
  screenGlass: "glass_ok" | "glass_scratch_hairline" | "glass_cracked" | "";

  // การทำงานหน้าจอและประสิทธิภาพ
  screenDisplay: "display_ok" | "display_pixel_defect" | "display_burn_in" | "";
  batteryHealth: "battery_health_high" | "battery_health_medium" | "battery_health_low" | "";

  // ฟังก์ชันพื้นฐาน
  camera: "camera_ok" | "camera_issue_minor" | "camera_defective" | "";
  wifi: "wifi_ok" | "wifi_failed" | "wifi_ignored" | "";
  faceId: "biometric_ok" | "biometric_failed" | "";
  speaker: "speaker_ok" | "speaker_failed" | "";
  mic: "mic_ok" | "mic_failed" | "";
  touchScreen: "touchscreen_ok" | "touchscreen_failed" | "";
  charger: "charger_ok" | "charger_failed" | "charger_ignored" | "";
  call: "call_ok" | "call_failed" | "";
  homeButton: "home_button_ok" | "home_button_failed" | "";
  sensor: "sensor_ok" | "sensor_failed" | "";
  buttons: "buttons_ok" | "buttons_failed" | "";
}
