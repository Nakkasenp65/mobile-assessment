// src/hooks/useBtsStations.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interfaces to define the shape of the API data
interface Station {
  StationId: number;
  StationNameTH: string;
}

interface Line {
  LineId: number;
  LineName_TH: string;
  StationList: Station[];
}

interface BtsApiResponse {
  data: Line[];
}

// The structured data our hook will provide to components
export interface BtsData {
  lines: Line[];
  stationsByLine: Record<string, Station[]>;
}

const fetchBtsStations = async (): Promise<BtsData> => {
  // ✨ FIX: Call our own API route instead of the external one
  const { data } = await axios.get<BtsApiResponse>("/api/bts-stations");

  const result = data;

  const stationsByLine: Record<string, Station[]> = {};
  result.data.forEach((line) => {
    // Sort stations by StationId before storing
    stationsByLine[line.LineName_TH] = line.StationList.sort((a, b) => a.StationId - b.StationId);
  });

  return {
    lines: result.data,
    stationsByLine,
  };
};

export const useBtsStations = () => {
  return useQuery<BtsData, Error>({
    queryKey: ["btsStations"],
    queryFn: fetchBtsStations,
    staleTime: Infinity, // The data is static, so we can cache it forever
  });
};
