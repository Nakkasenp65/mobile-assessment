import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import type {
  SellNowServiceInfo,
  PawnServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
  TradeInServiceInfo,
} from "@/types/service";

export type AssessmentUpdateBody = {
  sellNowServiceInfo?: SellNowServiceInfo;
  pawnServiceInfo?: PawnServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
};

export function useUpdateAssessment(assessmentId: string | undefined) {
  return useMutation<{ success: boolean }, Error, AssessmentUpdateBody>({
    mutationFn: async (payload: AssessmentUpdateBody) => {
      if (!assessmentId) throw new Error("Missing assessmentId");
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessments/${assessmentId}`, payload);
      console.log("PUT /api/assessments/:id response:", res.data);
      return res.data;
    },
  });
}
