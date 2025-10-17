import Layout from "@/components/Layout/Layout";
import RefinanceService from "@/app/details/(step3)/(services)/RefinanceService";
import type { DeviceInfo } from "@/types/device";

export default function DebugRefinancePage() {
  const deviceInfo: DeviceInfo = {
    brand: "Apple",
    model: "iPhone 12",
    storage: "128 GB",
    productType: "iPhone",
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-6">
        <h1 className="mb-4 text-xl font-semibold">Debug: Refinance Service</h1>
        <RefinanceService assessmentId="debug" deviceInfo={deviceInfo} refinancePrice={15000} phoneNumber="0812345678" />
      </div>
    </Layout>
  );
}