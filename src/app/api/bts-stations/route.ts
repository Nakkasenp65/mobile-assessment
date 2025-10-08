// src/app/api/bts-stations/route.ts
import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const response = await axios.get<BtsApiResponse>("https://my-bts-api.vercel.app/api/station-list");

    // Check if the response was successful
    if (response.status !== 200 || !response.data || !response.data.data) {
      return NextResponse.json({ message: "Error fetching data from BTS API" }, { status: 500 });
    }

    // Send the data back to our client
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in BTS proxy API route:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
