"use client";

import Layout from "@/components/Layout/Layout";
import SellNowService from "@/app/details/(step3)/(services)/SellNowService";
import type { DeviceInfo } from "@/types/device";

const deviceInfo: DeviceInfo = {
  brand: "Apple",
  productType: "iPhone",
  model: "iPhone 13",
  storage: "128GB",
};

export default function DebugSellNowPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-xl font-bold">Debug: Sell Now Service</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Previewing location selection layout and BTS/MRT/SRT line names.
        </p>
        <SellNowService assessmentId="debug-sell-now" deviceInfo={deviceInfo} sellPrice={12345} />
      </div>
    </Layout>
  );
}