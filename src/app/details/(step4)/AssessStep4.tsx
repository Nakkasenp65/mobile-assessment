// src/app/assess/components/AssessStep4.tsx

"use client";

import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { ConditionInfo, DeviceInfo } from "@/types/device";
import SellNowService from "../(step3)/(services)/SellNowService";
import TradeInService from "../(step3)/(services)/TradeInService";
import ConsignmentService from "../(step3)/(services)/ConsignmentService";
import RefinanceService from "../(step3)/(services)/RefinanceService";
import IPhoneExchangeService from "../(step3)/(services)/IPhoneExchangeService";
import PawnService from "../(step3)/(services)/PawnService";
import FramerButton from "../../../components/ui/framer/FramerButton";
import { ArrowLeft } from "lucide-react";

interface AssessStep4Props {
  assessmentId: string;
  deviceInfo: DeviceInfo;
  conditionInfo: ConditionInfo;
  selectedService: string;
  onBack: () => void;
  onSuccess?: () => void;
}

const AssessStep4 = ({ assessmentId, deviceInfo, conditionInfo, selectedService, onBack, onSuccess }: AssessStep4Props) => {
  const { finalPrice } = usePriceCalculation(deviceInfo, conditionInfo);

  // คำนวณราคาสำหรับแต่ละบริการ (อาจจะต้องปรับ logic ตามจริง)
  const servicePrices = {
    sell: finalPrice,
    consignment: finalPrice,
    tradein: finalPrice,
    refinance: Math.round(finalPrice * 0.5),
    "iphone-exchange": Math.round(finalPrice * 0.7),
    pawn: Math.round(finalPrice * 0.7), // สมมติว่า pawn ใช้ราคาเดียวกับ iphone-exchange
  };

  const renderServiceForm = () => {
    const servicePrice = servicePrices[selectedService as keyof typeof servicePrices] || 0;

    switch (selectedService) {
      case "sell":
        return (
          <SellNowService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            sellPrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      case "tradein":
        return (
          <TradeInService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            tradeInPrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      case "consignment":
        return (
          <ConsignmentService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            consignmentPrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      case "refinance":
        return (
          <RefinanceService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            refinancePrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      case "iphone-exchange":
        return (
          <IPhoneExchangeService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            exchangePrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      case "pawn":
        return (
          <PawnService
            assessmentId={assessmentId}
            deviceInfo={deviceInfo}
            pawnPrice={servicePrice}
            onSuccess={onSuccess}
          />
        );
      default:
        return <div className="text-muted-foreground text-center">ขออภัย, ไม่พบฟอร์มสำหรับบริการที่เลือก</div>;
    }
  };

  const serviceTitles: { [key: string]: string } = {
    sell: "บริการขายทันที",
    tradein: "บริการเทิร์นเครื่อง",
    consignment: "บริการฝากขาย",
    refinance: "บริการรีไฟแนนซ์",
    "iphone-exchange": "บริการไอโฟนแลกเงิน",
    pawn: "บริการจำนำ",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-foreground text-3xl font-bold">กรอกข้อมูลเพื่อดำเนินการ</h2>
        <p className="text-primary mt-1 text-lg font-semibold">{serviceTitles[selectedService] || "บริการที่เลือก"}</p>
      </div>

      {renderServiceForm()}

      <div className="mt-8 flex justify-start border-t pt-6">
        <FramerButton
          variant="ghost"
          onClick={onBack}
          className="bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-12 items-center rounded-full border px-6 transition-colors dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-semibold">ย้อนกลับไปเลือกบริการ</span>
        </FramerButton>
      </div>
    </div>
  );
};

export default AssessStep4;
