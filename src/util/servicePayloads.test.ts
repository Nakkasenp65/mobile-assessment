// src/util/servicePayloads.test.ts
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { buildIPhoneExchangePayload, buildRefinancePayload } from "./servicePayloads";

test("buildIPhoneExchangePayload excludes location and appointmentDate", () => {
  const payload = buildIPhoneExchangePayload({
    customerName: "Alice",
    phone: "0123456789",
    time: "10:00",
    occupation: "salaried",
    documentFile: null,
  });

  const has = (key: string) => Object.prototype.hasOwnProperty.call(payload as object, key);

  assert.equal(has("locationType"), false);
  assert.equal(has("btsStation"), false);
  assert.equal(has("storeLocation"), false);
  assert.equal(has("appointmentDate"), false);

  assert.equal(payload.appointmentTime, "10:00");
  assert.ok(has("documentFileUrl"));
  assert.equal(typeof payload.documentFileUrl, "string");
});

test("buildRefinancePayload excludes appointmentDate and includes appointmentTime", () => {
  const payload = buildRefinancePayload({
    customerName: "Bob",
    phone: "0987654321",
    occupation: "freelance",
    appointmentTime: "",
    documentFile: null,
  });

  const has = (key: string) => Object.prototype.hasOwnProperty.call(payload as object, key);

  assert.equal(has("appointmentDate"), false);
  assert.ok(has("appointmentTime"));
  assert.equal(typeof payload.appointmentTime, "string");
  assert.ok(has("documentFileUrl"));
});