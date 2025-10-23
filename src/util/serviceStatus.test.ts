// src/util/serviceStatus.test.ts
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { pickReservedServiceId, isServiceReserved } from "./serviceStatus.ts";
import type { Assessment } from "../types/assessment.ts";

const baseAssessment: Assessment = {
  id: "test-assessment",
  phoneNumber: "0912345678",
  status: "completed",
  estimatedValue: 12345,
  deviceInfo: { brand: "Apple", model: "iPhone 12", storage: "128GB" },
  conditionInfo: {
    canUnlockIcloud: true,
    modelType: "model_th",
    warranty: "warranty_inactive",
    accessories: "acc_box_only",
    bodyCondition: "body_scratch_minor",
    screenGlass: "glass_ok",
    screenDisplay: "display_ok",
    batteryHealth: "battery_health_medium",
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
  },
};

const make = (overrides: Partial<Assessment>): Assessment => ({ ...baseAssessment, ...overrides });

test("pickReservedServiceId returns undefined when no services", () => {
  const a = make({});
  assert.equal(pickReservedServiceId(a), undefined);
});

test("pickReservedServiceId respects precedence order", () => {
  const a1 = make({
    consignmentServiceInfo: {
      customerName: "Alice",
      phone: "011",
      storeLocation: "สาขาอนุสาวรีย์",
      appointmentDate: "2025-01-01",
      appointmentTime: "10:00",
    },
  });
  assert.equal(pickReservedServiceId(a1), "consignment");

  const a2 = make({
    tradeInServiceInfo: {
      customerName: "Bob",
      phone: "022",
      storeLocation: "สาขาสยาม",
      newDevice: "iphone15pro",
      storage: "256GB",
      color: "black",
      phoneCondition: "first_hand",
      appointmentDate: "2025-01-01",
      appointmentTime: "11:00",
    },
    refinanceServiceInfo: {
      customerName: "Carol",
      phone: "033",
      occupation: "salaried",
      documentFileUrl: "https://example.com/doc.pdf",
      appointmentTime: "12:00",
    },
  });
  assert.equal(pickReservedServiceId(a2), "tradein");

  const a3 = make({
    sellNowServiceInfo: {
      customerName: "Dan",
      phone: "044",
      locationType: "store",
      storeLocation: "สาขาเซ็นเตอร์วัน",
      appointmentDate: "2025-01-02",
      appointmentTime: "12:30",
    },
    iphoneExchangeServiceInfo: {
      customerName: "Eve",
      phone: "055",
      occupation: "freelance",
      documentFileUrl: "https://example.com/loan.pdf",
      appointmentTime: "13:00",
    },
    pawnServiceInfo: {
      customerName: "Frank",
      phone: "066",
      locationType: "store",
      appointmentDate: "2025-01-03",
      appointmentTime: "14:00",
    },
  });
  assert.equal(pickReservedServiceId(a3), "sell");
});

test("isServiceReserved reflects payload presence", () => {
  const a = make({
    iphoneExchangeServiceInfo: {
      customerName: "X",
      phone: "099",
      occupation: "salaried",
      documentFileUrl: "https://example.com/doc.pdf",
      appointmentTime: "10:00",
    },
  });
  assert.equal(isServiceReserved(a, "iphone-exchange"), true);
  assert.equal(isServiceReserved(a, "sell"), false);
  assert.equal(isServiceReserved(a, "consignment"), false);
});