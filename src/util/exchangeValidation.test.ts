// src/util/exchangeValidation.test.ts
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { validateUploadFile, computeIsFormComplete, type ExchangeFormState } from "./exchangeValidation.ts";

const makeState = (overrides: Partial<ExchangeFormState> = {}): ExchangeFormState => ({
  customerName: "ทดสอบ ผู้ใช้",
  phone: "0912345678",
  btsStation: "อนุสาวรีย์",
  storeLocation: "สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)",
  date: "2025-01-01",
  time: "10:00",
  occupation: "salaried",
  documentFile: new File([""], "salary.pdf", { type: "application/pdf" }),
  ...overrides,
});

const isError = (x: ReturnType<typeof validateUploadFile>): x is { ok: false; error: string } => {
  return "error" in x;
};

test("validateUploadFile accepts valid PDF within size limit", () => {
  const res = validateUploadFile({ name: "doc.pdf", type: "application/pdf", size: 1000 });
  assert.deepEqual(res, { ok: true });
});

test("validateUploadFile accepts JPEG by mime type", () => {
  const res = validateUploadFile({ name: "photo.jpeg", type: "image/jpeg", size: 5000 });
  assert.deepEqual(res, { ok: true });
});

test("validateUploadFile accepts PNG by extension fallback", () => {
  const res = validateUploadFile({ name: "image.png", type: "", size: 5000 });
  assert.deepEqual(res, { ok: true });
});

test("validateUploadFile rejects invalid type and extension", () => {
  const res = validateUploadFile({ name: "notes.txt", type: "text/plain", size: 1000 });
  assert.ok(isError(res));
  assert.match((res as { ok: false; error: string }).error, /ประเภทไฟล์ไม่ถูกต้อง/);
});

test("validateUploadFile rejects when size exceeds 5MB", () => {
  const res = validateUploadFile({ name: "big.pdf", type: "application/pdf", size: 6 * 1024 * 1024 });
  assert.ok(isError(res));
  assert.match((res as { ok: false; error: string }).error, /ขนาดไฟล์ใหญ่เกินกำหนด/);
});

test("computeIsFormComplete false when document missing", () => {
  const state = makeState({ documentFile: null });
  assert.equal(computeIsFormComplete(state, "store"), false);
});

test("computeIsFormComplete false when occupation missing", () => {
  const state = makeState({ occupation: "" });
  assert.equal(computeIsFormComplete(state, "store"), false);
});

test("computeIsFormComplete false when phone invalid", () => {
  const state = makeState({ phone: "123" });
  assert.equal(computeIsFormComplete(state, "store"), false);
});

test("computeIsFormComplete requires btsStation for bts", () => {
  const state = makeState({ btsStation: "" });
  assert.equal(computeIsFormComplete(state, "bts"), false);
});

test("computeIsFormComplete true when all required fields set for store", () => {
  const state = makeState();
  assert.equal(computeIsFormComplete(state, "store"), true);
});

test("computeIsFormComplete true when all required fields set for bts", () => {
  const state = makeState({ btsStation: "สยาม" });
  assert.equal(computeIsFormComplete(state, "bts"), true);
});