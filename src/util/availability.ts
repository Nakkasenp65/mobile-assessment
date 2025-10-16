// src/util/availability.ts
export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  availableQuota: number;
}

// Some OFFSITE services may return a daily availability without explicit startTime
// Example: { type: "OFFSITE_DAILY", date: "2023-10-16", availableQuota: 2 }
export interface AvailabilityDaily {
  type: string;
  date: string;
  availableQuota: number;
}

export type AvailabilityResponse = AvailabilitySlot | AvailabilityDaily;

export type ApiServiceName =
  | "ซื้อขายมือถือ"
  | "ขายฝากมือถือ"
  | "รีไฟแนนซ์"
  | "ไอโฟนแลกเงิน"
  | "ซ่อมมือถือ";

export type InternalServiceKey =
  | "sellNowServiceInfo"
  | "pawnServiceInfo"
  | "consignmentServiceInfo"
  | "refinanceServiceInfo"
  | "iphoneExchangeServiceInfo"
  | "maintenance";

export type InternalLocation = "home" | "store" | "bts";
export type ApiLocationType = "ONSITE" | "OFFSITE" | "ONLINE";

const SERVICE_MAP: Record<string, ApiServiceName> = {
  sellNowServiceInfo: "ซื้อขายมือถือ",
  pawnServiceInfo: "ขายฝากมือถือ",
  consignmentServiceInfo: "ขายฝากมือถือ",
  refinanceServiceInfo: "รีไฟแนนซ์",
  iphoneExchangeServiceInfo: "ไอโฟนแลกเงิน",
  maintenance: "ซ่อมมือถือ",
  // UI display aliases
  "บริการขายทันที": "ซื้อขายมือถือ",
  "บริการจำนำ": "ขายฝากมือถือ",
  "บริการขายฝาก": "ขายฝากมือถือ",
  "บริการรีไฟแนนซ์": "รีไฟแนนซ์",
  "บริการแลกเปลี่ยน iPhone": "ไอโฟนแลกเงิน",
};

export function toApiServiceType(input: string): ApiServiceName | string {
  return SERVICE_MAP[input] ?? input;
}

const LOCATION_MAP: Record<string, ApiLocationType> = {
  store: "ONSITE",
  bts: "OFFSITE",
  // Adjust mapping: รับซื้อถึงบ้าน (home) is OFFSITE
  home: "OFFSITE",
  ONSITE: "ONSITE",
  OFFSITE: "OFFSITE",
  ONLINE: "ONLINE",
};

export function toApiLocationType(input: string): ApiLocationType {
  return LOCATION_MAP[input] ?? "ONSITE";
}

export function generateTimeSlots(startHour = 9, endHour = 18): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const hh = String(h).padStart(2, "0");
    slots.push(`${hh}:00`);
  }
  return slots;
}

// Type guard helpers for discriminating the union
function hasStartTime(entry: AvailabilityResponse): entry is AvailabilitySlot {
  return "startTime" in entry && typeof entry.startTime === "string";
}

function isDailyEntry(entry: AvailabilityResponse): entry is AvailabilityDaily {
  return "type" in entry && typeof entry.type === "string" && entry.type.includes("DAILY");
}

export function mapAvailabilityToSlots(slots: AvailabilityResponse[], timeZone = "Asia/Bangkok"): Set<string> {
  const set = new Set<string>();
  for (const s of slots) {
    try {
      if (!s || s.availableQuota <= 0) continue;
      // Only normalize entries that include startTime (time-based slots)
      if (hasStartTime(s)) {
        const iso = s.startTime;

        // Many upstreams encode local Thai hours as ISO with trailing 'Z'.
        // If we format those in Asia/Bangkok, they shift by +7h (e.g., 10:00Z -> 17:00).
        // To preserve intended local hour labels (10:00–20:00), detect 'Z' and format in UTC.
        const tz = typeof iso === "string" && /Z$/.test(iso) ? "UTC" : timeZone;

        const hhmm = new Intl.DateTimeFormat("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz,
        }).format(new Date(iso));
        set.add(hhmm);
      }
    } catch {
      // ignore malformed dates
    }
  }
  return set;
}

export function todayStringTZ(timeZone = "Asia/Bangkok"): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone }).format(new Date());
}

export function currentHourTZ(timeZone = "Asia/Bangkok"): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(new Date());
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "00";
  return Number(hourStr);
}

export function computeFallbackDisabled(dateISO: string, slots: string[], timeZone = "Asia/Bangkok"): Set<string> {
  const disabled = new Set<string>();
  const today = todayStringTZ(timeZone);
  if (dateISO === today) {
    const nowHour = currentHourTZ(timeZone);
    for (const s of slots) {
      const h = Number(s.slice(0, 2));
      if (h <= nowHour) disabled.add(s);
    }
  }
  return disabled;
}

// Infer API location type from service info object
export function inferApiLocationFromService(info: unknown): ApiLocationType | null {
  if (!info || typeof info !== "object") return null;
  const rec = info as Record<string, unknown>;
  const locTypeRaw = rec.locationType;
  if (typeof locTypeRaw === "string") {
    return LOCATION_MAP[locTypeRaw] ?? null;
  }
  const hasStore = typeof rec.storeLocation === "string" && !!rec.storeLocation;
  const hasBts = typeof rec.btsStation === "string" && !!rec.btsStation;
  const hasAddress =
    typeof rec.addressDetails === "string" ||
    typeof rec.address === "string" ||
    typeof rec.province === "string" ||
    typeof rec.district === "string" ||
    typeof rec.subdistrict === "string";

  if (hasStore) return "ONSITE";
  if (hasBts) return "OFFSITE";
  // Adjust inference: home address implies OFFSITE
  if (hasAddress) return "OFFSITE";
  return null;
}

// Detect OFFSITE daily availability entries
export function detectDailyAvailability(data: AvailabilityResponse[]): { isDaily: boolean; dailyQuota: number } {
  let dailyQuota = 0;
  let isDaily = false;
  for (const entry of data) {
    if (isDailyEntry(entry) && entry.availableQuota > 0) {
      isDaily = true;
      dailyQuota += entry.availableQuota;
    }
  }
  return { isDaily, dailyQuota };
}