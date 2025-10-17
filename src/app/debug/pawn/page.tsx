"use client";

import PawnService from "@/app/details/(step3)/(services)/PawnService";
import Layout from "@/components/Layout/Layout";
import type { DeviceInfo } from "@/types/device";

export default function DebugPawnPage() {
  const deviceInfo: DeviceInfo = {
    brand: "Apple",
    model: "iPhone 12",
    storage: "128 GB",
    productType: "iPhone",
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-6">
        <h1 className="mb-4 text-xl font-semibold">Debug: Pawn Service</h1>
        <PawnService assessmentId="debug" deviceInfo={deviceInfo} pawnPrice={15000} />
      </div>
    </Layout>
  );
}