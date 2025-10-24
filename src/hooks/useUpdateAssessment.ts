import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SellNowServiceInfo,
  PawnServiceInfo,
  ConsignmentServiceInfo,
  RefinanceServiceInfo,
  IPhoneExchangeServiceInfo,
  TradeInServiceInfo,
} from "@/types/service";

export type AssessmentUpdateBody = {
  status: "reserved";
  sellNowServiceInfo?: SellNowServiceInfo;
  pawnServiceInfo?: PawnServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
};

export function useUpdateAssessment(assessmentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, AssessmentUpdateBody | FormData>({
    mutationFn: async (payload) => {
      if (!assessmentId) throw new Error("Missing assessmentId");
      const isForm = typeof FormData !== "undefined" && payload instanceof FormData;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessments/${assessmentId}${isForm ? "/service" : ""}`;
      const res = await axios.put(
        url,
        payload,
        isForm ? undefined : { headers: { "Content-Type": "application/json" } },
      );
      console.log("PUT /api/assessments/:id response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      }
    },
  });
}
