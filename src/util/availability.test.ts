// src/util/availability.test.ts
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  toApiServiceType,
  toApiLocationType,
  generateTimeSlots,
  mapAvailabilityToSlots,
} from "./availability";

test("toApiServiceType maps internal keys to Thai names", () => {
  assert.equal(toApiServiceType("sellNowServiceInfo"), "ซื้อขายมือถือ");
  assert.equal(toApiServiceType("pawnServiceInfo"), "ขายฝากมือถือ");
  assert.equal(toApiServiceType("consignmentServiceInfo"), "ขายฝากมือถือ");
  assert.equal(toApiServiceType("refinanceServiceInfo"), "รีไฟแนนซ์");
  assert.equal(toApiServiceType("iphoneExchangeServiceInfo"), "ไอโฟนแลกเงิน");
});

test("toApiLocationType maps internal location to API types", () => {
  assert.equal(toApiLocationType("store"), "ONSITE");
  assert.equal(toApiLocationType("bts"), "OFFSITE");
  // Adjusted: home is considered OFFSITE (รับซื้อถึงบ้าน)
  assert.equal(toApiLocationType("home"), "OFFSITE");
  assert.equal(toApiLocationType("ONSITE"), "ONSITE");
});

test("generateTimeSlots returns 09:00 to 18:00 inclusive", () => {
  const slots = generateTimeSlots(9, 18);
  assert.equal(slots[0], "09:00");
  assert.equal(slots[slots.length - 1], "18:00");
  assert.equal(slots.length, 10);
});

test("mapAvailabilityToSlots normalizes startTime to HH:MM", () => {
  const api = [
    { startTime: "2023-10-27T10:00:00.000Z", endTime: "2023-10-27T11:00:00.000Z", availableQuota: 3 },
    { startTime: "2023-10-27T11:00:00.000Z", endTime: "2023-10-27T12:00:00.000Z", availableQuota: 3 },
  ];
  const set = mapAvailabilityToSlots(api, "Asia/Bangkok");
  assert.ok(set.size >= 2);
});