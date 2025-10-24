// src/util/servicePayloads.ts
import type { IPhoneExchangeServiceInfo, RefinanceServiceInfo } from "@/types/service";

// Note: document upload flow is not implemented here; map File -> URL externally
// Persisted service info uses `documentFileUrl: string` only.

export function buildIPhoneExchangePayload(params: {
  customerName: string;
  phone: string;
  time: string | Date;
  occupation: "salaried" | "freelance" | "";
  // Preferred persisted field
  documentFileUrl?: string;
  // Deprecated: kept for backwards-compatibility with existing callers
  documentFile?: File | null;
  nextSteps?: string[];
}): IPhoneExchangeServiceInfo {
  return {
    customerName: params.customerName,
    phone: params.phone,
    appointmentTime: String(params.time ?? ""),
    occupation: params.occupation ?? "",
    documentFileUrl: params.documentFileUrl ?? "",
    nextSteps: params.nextSteps,
  };
}

export function buildRefinancePayload(params: {
  customerName: string;
  phone: string;
  occupation: "salaried" | "freelance" | "";
  appointmentTime?: string | Date;
  // Preferred persisted field
  documentFileUrl?: string;
  // Deprecated: kept for backwards-compatibility with existing callers
  documentFile?: File | null;
  nextSteps?: string[];
}): RefinanceServiceInfo {
  return {
    customerName: params.customerName,
    phone: params.phone,
    occupation: params.occupation ?? "",
    documentFileUrl: params.documentFileUrl ?? "",
    appointmentTime: String(params.appointmentTime ?? ""),
    nextSteps: params.nextSteps,
  };
}

// Helpers to create FormData for upload-first flows.
// Use these to call an upload endpoint that returns a `documentFileUrl`.
export function buildIPhoneExchangeFormData(params: {
  customerName: string;
  phone: string;
  time: string | Date;
  date?: string | Date;
  occupation: "salaried" | "freelance" | "";
  documentFile: File;
  // Queue booking fields
  appointmentAt?: string;
  branchId?: string;
  serviceType?: string;
}): FormData {
  const fd = new FormData();
  const serviceKey = "iphoneExchangeServiceInfo";
  const serviceInfo = {
    customerName: params.customerName,
    phone: params.phone,
    appointmentTime: String(params.time ?? ""),
    appointmentDate: params.date ? String(params.date) : undefined,
    occupation: params.occupation ?? "",
    // Queue booking fields
    appointmentAt: params.appointmentAt,
    branchId: params.branchId,
    serviceType: params.serviceType,
    // nextSteps can be added if/when available from UI
  };
  fd.append("serviceKey", serviceKey);
  fd.append("status", "reserved");
  fd.append("serviceInfo", JSON.stringify(serviceInfo));
  fd.append("documentFile", params.documentFile);

  // Also append queue booking fields at top level for useUpdateAssessment hook
  if (params.appointmentAt) fd.append("appointmentAt", params.appointmentAt);
  if (params.branchId) fd.append("branchId", params.branchId);
  if (params.serviceType) fd.append("serviceType", params.serviceType);

  return fd;
}

export function buildRefinanceFormData(params: {
  customerName: string;
  phone: string;
  occupation: "salaried" | "freelance" | "";
  appointmentTime?: string | Date;
  appointmentDate?: string;
  documentFile: File;
  // Queue booking fields
  appointmentAt?: string;
  branchId?: string;
  serviceType?: string;
}): FormData {
  const fd = new FormData();
  const serviceKey = "refinanceServiceInfo";
  const serviceInfo = {
    customerName: params.customerName,
    phone: params.phone,
    appointmentTime: String(params.appointmentTime ?? ""),
    appointmentDate: params.appointmentDate,
    occupation: params.occupation ?? "",
    // Queue booking fields
    appointmentAt: params.appointmentAt,
    branchId: params.branchId,
    serviceType: params.serviceType,
    // nextSteps can be added if/when available from UI
  };
  fd.append("serviceKey", serviceKey);
  fd.append("status", "reserved");
  fd.append("serviceInfo", JSON.stringify(serviceInfo));
  fd.append("documentFile", params.documentFile);

  // Also append queue booking fields at top level for useUpdateAssessment hook
  if (params.appointmentAt) fd.append("appointmentAt", params.appointmentAt);
  if (params.branchId) fd.append("branchId", params.branchId);
  if (params.serviceType) fd.append("serviceType", params.serviceType);

  return fd;
}
