// src/hooks/useLongdoReverseGeocode.ts
"use client";

import { useQuery } from "@tanstack/react-query";

// Interface for the raw data from Longdo API
interface LongdoApiResponse {
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  aoi?: string;
  road?: string;
}

// Interface for the data structure used in our components
export interface LongdoGeocodeResult {
  province: string;
  district: string;
  subdistrict: string;
  postcode: string;
  address: string; // <-- Added required address field
  aoi?: string;
  road?: string;
}

// Type for coordinates
interface LatLng {
  lat: number;
  lng: number;
}

// Function to call the API
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
    const data: LongdoApiResponse = await response.json();
    console.log("📍 Longdo API Response:", data); // Log the raw data

    // ✨ **FIX:** Construct the address string from 'aoi' and 'road'
    const address = `${data.aoi || ""} ${data.road || ""}`.trim();

    // Return the complete object that matches our component's required data structure
    return { ...data, address };
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
    enabled: !!latLng,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5,
  });
};
