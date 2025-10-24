// src/constants/queueBooking.ts

/**
 * Service type constants for queue booking API
 * These map to the backend queue booking system
 */
export const SERVICE_TYPES = {
  SELL_NOW: "SELL_NOW",
  PAWN: "PAWN",
  CONSIGNMENT: "CONSIGNMENT",
  REFINANCE: "REFINANCE",
  IPHONE_EXCHANGE: "IPHONE_EXCHANGE",
  TRADE_IN: "TRADE_IN",
  MAINTENANCE: "MAINTENANCE",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];

/**
 * Branch information with ID and display name
 */
export interface BranchInfo {
  id: string;
  name: string;
}

/**
 * Available branches for queue booking
 */
export const BRANCHES: BranchInfo[] = [
  { id: "เซ็นเตอร์วัน", name: "สาขาห้างเซ็นเตอร์วัน (อนุสาวรีย์ชัยสมรภูมิ)" },
  { id: "กุดปลาดุก", name: "สาขากุดปลาดุก" },
];

/**
 * Legacy branch IDs (kept for backwards compatibility)
 */
export const BRANCH_IDS = {
  CENTER_ONE: "เซ็นเตอร์วัน",
  KUD_PLA_DUK: "กุดปลาดุก",
} as const;

export type BranchId = (typeof BRANCH_IDS)[keyof typeof BRANCH_IDS];

/**
 * Get branch ID from branch name
 */
export function getBranchIdFromName(branchName: string): string {
  const branch = BRANCHES.find((b) => b.name === branchName);
  return branch?.id ?? BRANCH_IDS.CENTER_ONE;
}

/**
 * Legacy: Get branch ID from store location string
 * @deprecated Use getBranchIdFromName instead
 */
export function getBranchIdFromStore(storeLocation: string): string {
  return getBranchIdFromName(storeLocation);
}
