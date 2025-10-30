// src/hooks/useCheckAvailability.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AvailabilityResponse,
  toApiLocationType,
  toApiServiceType,
  generateTimeSlots,
  mapAvailabilityToSlots,
  detectDailyAvailability,
} from "@/util/availability";

export interface UseCheckAvailabilityParams {
  serviceType: string; // internal key or Thai name
  locationType: string; // internal (home/store/bts) or API (ONSITE/OFFSITE/ONLINE)
  selectedDate: string; // YYYY-MM-DD
}

export interface UseCheckAvailabilityResult {
  slots: string[]; // HH:MM list 09:00-18:00
  availableSet: Set<string>; // HH:MM available from API
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  data?: AvailabilityResponse[];
  isDaily: boolean;
  dailyQuota: number;
}

export function useCheckAvailability({
  serviceType,
  locationType,
  selectedDate,
}: UseCheckAvailabilityParams): UseCheckAvailabilityResult {
  const apiServiceType = toApiServiceType(serviceType);
  const apiLocationType = toApiLocationType(locationType);

  // Always call the local proxy to avoid browser CORS issues; the proxy will
  // forward to the upstream service using server-side fetch.
  const url = `/api/availability-proxy?serviceType=${encodeURIComponent(apiServiceType)}&type=${apiLocationType}&date=${selectedDate}`;

  const { data, isLoading, isError, error } = useQuery<AvailabilityResponse[], unknown>({
    queryKey: ["availability", apiServiceType, apiLocationType, selectedDate],
    queryFn: async () => {
      const res = await axios.get<AvailabilityResponse[]>(url, { timeout: 8000 });
      return res.data;
    },
    enabled: Boolean(apiServiceType && apiLocationType && selectedDate),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  // Store operating hours: 10:00–20:00 (Thai timezone)
  const slots = generateTimeSlots(10, 20);
  const availableSet = mapAvailabilityToSlots(data ?? [], "Asia/Bangkok");
  const { isDaily, dailyQuota } = detectDailyAvailability(data ?? []);

  return { slots, availableSet, isLoading, isError, error, data, isDaily, dailyQuota };
}
