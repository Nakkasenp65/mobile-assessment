import axios from "axios";
import { getVerifiedSession, setVerifiedSession } from "./session";

interface OTPRequestResponse {
  success: boolean;
  message: string;
  data?: {
    requestNo?: string;
    token?: string;
    ref?: string;
    expiresAt: string;
  };
  raw?: unknown;
}

interface OTPVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
  };
  raw?: unknown;
}

export class OTPError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "OTPError";
  }
}

interface CloudFnRequestOTPResponse {
  code: string;
  status: string;
  msg: string;
  credit_balance?: number;
  result?: {
    requestNo?: string;
    token?: string;
    ref?: string;
  };
}

interface CloudFnVerifyOTPResponse {
  code: string;
  status: string;
  msg: string;
  result?: unknown;
}

// Helper: normalize Thai phone number to MSISDN (remove leading 0, prefix 66)
function toMsisdn(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return "66" + digits.slice(1);
  }
  if (digits.startsWith("66")) {
    return digits;
  }
  return digits; // fallback, caller ensures 10-digit input already
}

/**
 * Request OTP for phone number verification
 */
export async function requestOTP(phoneNumber: string): Promise<OTPRequestResponse> {
  console.log("Requesting OTP for phone number:", phoneNumber);
  try {
    // Skip OTP if we already have a valid verified session
    const cached = await getVerifiedSession(phoneNumber);
    if (cached) {
      return {
        success: true,
        message: "พบเซสชันที่ยืนยันแล้ว — ข้ามการขอ OTP",
        data: {
          // No token/ref because we didn't request a new OTP
          expiresAt: new Date(cached.expiresAt).toISOString(),
        },
        raw: { source: "cache" },
      };
    }

    const msisdn = toMsisdn(phoneNumber);
    const otpBaseUrl = process.env.NEXT_PUBLIC_OTP_BASE_URL;

    if (!otpBaseUrl) {
      throw new OTPError("OTP_BASE_URL environment variable is not set");
    }

    const response = await axios.post(
      otpBaseUrl + "/requestOTP",
      { to: msisdn },
      { headers: { "Content-Type": "application/json" } },
    );

    const raw: CloudFnRequestOTPResponse = response.data;

    if (response.status !== 200 || raw.status !== "200" || raw.code !== "0") {
      throw new OTPError(raw?.msg || "Failed to request OTP", raw?.code, Number(raw?.status));
    }

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    return {
      success: true,
      message: raw.msg,
      data: {
        requestNo: raw.result?.requestNo,
        token: raw.result?.token,
        ref: raw.result?.ref,
        expiresAt,
      },
      raw,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const raw = error.response?.data as CloudFnRequestOTPResponse | undefined;
      const code = raw?.code;
      const msg = raw?.msg || (error.message ?? "");
      throw new OTPError(msg || "Failed to request OTP", code, statusCode);
    }
    if (error instanceof OTPError) {
      throw error;
    }

    throw new OTPError("Network error occurred while requesting OTP", "NETWORK_ERROR");
  }
}

/**
 * Verify OTP code using token & pin
 */
export async function verifyOTP(token: string, pin: string, phoneNumber?: string): Promise<OTPVerifyResponse> {
  const otpBaseUrl = process.env.NEXT_PUBLIC_OTP_BASE_URL;
  try {
    // If a valid cached session exists, skip verification call
    if (phoneNumber) {
      const cached = await getVerifiedSession(phoneNumber);
      if (cached) {
        return {
          success: true,
          message: "ยืนยันแล้วจากเซสชันก่อนหน้า",
          data: { verified: true },
          raw: { source: "cache" },
        };
      }
    }

    if (!otpBaseUrl) {
      throw new OTPError("OTP_BASE_URL environment variable is not set");
    }

    const response = await axios.post(
      otpBaseUrl + "/verifyOTP",
      { token, pin },
      { headers: { "Content-Type": "application/json" } },
    );

    const raw: CloudFnVerifyOTPResponse = response.data;

    const success = response.status === 200 && raw.status === "200" && raw.code === "0";

    if (!success) {
      throw new OTPError(raw?.msg || "Failed to verify OTP", raw?.code, Number(raw?.status));
    }

    // Persist verified session for future reuse
    if (phoneNumber) {
      await setVerifiedSession(phoneNumber);
    }

    return {
      success: true,
      message: raw.msg,
      data: { verified: true },
      raw,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const raw = error.response?.data as CloudFnVerifyOTPResponse | undefined;
      const code = raw?.code;
      const msg = raw?.msg || (error.message ?? "");
      throw new OTPError(msg || "Failed to verify OTP", code, statusCode);
    }
    if (error instanceof OTPError) {
      throw error;
    }

    throw new OTPError("Network error occurred while verifying OTP", "NETWORK_ERROR");
  }
}

/**
 * Utility function to format phone number for display
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return phoneNumber;
}

/**
 * Utility function to validate phone number format
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return /^0[0-9]{9}$/.test(cleaned);
}
