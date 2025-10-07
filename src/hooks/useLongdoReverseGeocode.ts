// src/hooks/useLongdoReverseGeocode.ts
"use client";

import { useQuery } from "@tanstack/react-query";

// Interface สำหรับผลลัพธ์จาก Longdo API
export interface LongdoGeocodeResult {
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  aoi?: string;
  road?: string;
}

// Type สำหรับพิกัด
interface LatLng {
  lat: number;
  lng: number;
}

// ฟังก์ชันสำหรับยิง API
const fetchAddress = async (latLng: LatLng | null): Promise<LongdoGeocodeResult | null> => {
  if (!latLng) {
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;
  if (!apiKey) {
    console.error("Longdo Map API Key is not configured.");
    return null;
  }

  const url = `https://api.longdo.com/map/services/address?lon=${latLng.lng}&lat=${latLng.lat}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch address from Longdo API");
    }
    const data: LongdoGeocodeResult = await response.json();
    console.log("📍 Longdo API Response:", data); // Log ค่าที่ได้จาก API
    return data;
  } catch (error) {
    console.error("❌ Error fetching Longdo API:", error);
    return null;
  }
};

// Custom Hook
export const useLongdoReverseGeocode = (latLng: LatLng | null) => {
  return useQuery({
    queryKey: ["longdo-geocode", latLng],
    queryFn: () => fetchAddress(latLng),
    enabled: !!latLng, // Hook จะทำงานก็ต่อเมื่อมีค่า latLng เท่านั้น
    staleTime: Infinity, // ไม่ต้อง refetch อัตโนมัติ
    gcTime: 1000 * 60 * 5, // เก็บ cache ไว้ 5 นาที
  });
};
