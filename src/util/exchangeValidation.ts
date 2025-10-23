// src/util/exchangeValidation.ts
import type { IPhoneExchangeServiceInfo } from "@/types/service";

export type OccupationType = "salaried" | "freelance" | "";
export type LocationType = "store" | "bts" | null;

export interface ExchangeFormState {
  customerName: string;
  phone: string;
  btsStation: string;
  storeLocation: string;
  date: string | Date | undefined;
  time: string | Date | undefined;
  occupation: OccupationType;
  documentFile: File | null;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".pdf") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png");
}

export function validateUploadFile(file: Pick<File, "name" | "type" | "size">): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_MIME_TYPES.has(file.type) && !hasAllowedExtension(file.name)) {
    return { ok: false, error: "ประเภทไฟล์ไม่ถูกต้อง (รองรับ: PDF, JPG, PNG)" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "ขนาดไฟล์ใหญ่เกินกำหนด (สูงสุด 5MB)" };
  }
  return { ok: true };
}

export function computeIsFormComplete(state: ExchangeFormState, locationType: LocationType): boolean {
  const hasPhone = typeof state.phone === "string" && state.phone.replace(/[^0-9]/g, "").length === 10;
  const hasLocation = locationType !== null && (locationType === "bts" ? !!state.btsStation : locationType === "store" ? true : false);
  const hasAppointment = !!state.date && !!state.time;
  const hasOccupationAndDoc = !!state.occupation && !!state.documentFile;
  const hasName = !!state.customerName && state.customerName.trim().length > 0;
  return hasName && hasPhone && hasAppointment && hasLocation && hasOccupationAndDoc;
}

export function buildExchangeServiceInfoForPersist(params: {
  customerName: string;
  phone: string;
  appointmentTime: string | Date | undefined;
  occupation: OccupationType;
  documentFileUrl: string;
}): IPhoneExchangeServiceInfo {
  return {
    customerName: params.customerName,
    phone: params.phone,
    appointmentTime: String(params.appointmentTime ?? ""),
    occupation: params.occupation ?? "",
    documentFileUrl: params.documentFileUrl ?? "",
  };
}