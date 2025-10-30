/**
 * useUpdateAssessment Hook
 *
 * This hook handles assessment updates with queue booking integration.
 *
 * Queue Booking Flow:
 * 1. Services that support queue booking (SellNow, Pawn, Consignment, TradeIn):
 *    - Check if appointmentAt, branchId, and serviceType are present
 *    - Call queue booking API to create appointment
 *    - Extract appointment.id from the response
 *    - Store appointment.id in the service info for future cancellation
 *    - Then update the assessment with the service info including appointmentId
 *
 * 2. Services with manual booking (Refinance, IPhoneExchange):
 *    - Skip queue booking API call
 *    - No appointmentId is stored
 *    - Directly update the assessment
 *
 * The appointmentId enables future appointment cancellation functionality.
 */
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
import { AssessmentServiceType } from "../types/assessment";

export type AssessmentUpdateBody = {
  status: "reserved";
  appointmentAt?: string; // วันที่และเวลานัดหมายในรูปแบบ ISO 8601
  branchId?: string; // รหัสสาขา ("เซ็นเตอร์วัน" หรือ "กุดปลาดุก")
  serviceType?: string; // ประเภทบริการ
  note?: string; // หมายเหตุเพิ่มเติม (ถ้ามี)
  locationType?: string; // ประเภทสถานที่ (store, home, bts)
  sellNowServiceInfo?: SellNowServiceInfo;
  pawnServiceInfo?: PawnServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
};

export type AssessmentUpdatePayload = {
  status: "reserved";
  type: AssessmentServiceType;
  appointmentAt?: string; // วันที่และเวลานัดหมายในรูปแบบ ISO 8601
  branchId?: string; // รหัสสาขา ("เซ็นเตอร์วัน" หรือ "กุดปลาดุก")
  serviceType?: string; // ประเภทบริการ
  note?: string; // หมายเหตุเพิ่มเติม (ถ้ามี)
  locationType?: string; // ประเภทสถานที่ (store, home, bts)
  sellNowServiceInfo?: SellNowServiceInfo;
  pawnServiceInfo?: PawnServiceInfo;
  consignmentServiceInfo?: ConsignmentServiceInfo;
  refinanceServiceInfo?: RefinanceServiceInfo;
  iphoneExchangeServiceInfo?: IPhoneExchangeServiceInfo;
  tradeInServiceInfo?: TradeInServiceInfo;
};

export type AssessmentCancelInput = {
  docId: string;
  appointmentId: string;
};

/**
 * payload สำหรับยกเลิกการจองบริการ
 * - เปลี่ยนสถานะเป็น pending จบ
 */
export type AssessmentCancelPayload = {
  status: "pending";
};

// Interface สำหรับข้อมูลการจองคิว (รูปแบบใหม่)
export type QueueBookingPayload = {
  customer: {
    fullname: string; // ชื่อ-นามสกุลจริง
    phone: string; // เบอร์โทรศัพท์
    line_user_id: string; // LINE User ID จาก LIFF หรือใช้เบอร์โทรแทนถ้าไม่มี
    email: string; // อีเมล
    picture_url: string; // URL รูปโปรไฟล์
  };
  appointment: {
    date: string; // วันที่และเวลานัดหมายในรูปแบบ ISO 8601
    type: "ONSITE" | "ONLINE" | "OFFSITE"; // ประเภทการนัดหมาย
    serviceType: "ซื้อขายมือถือ" | "ขายฝากมือถือ" | "รีไฟแนนซ์" | "ไอโฟนแลกเงิน" | "อื่นๆ"; // ประเภทบริการ (ภาษาไทย)
    branchId: string; // รหัสสาขา
    requiredTags: string[]; // "REFINANCE" สำหรับ iphoneExchange และ refinance, "GENERAL" สำหรับบริการอื่นๆ
  };
};

/**
 * ฟังก์ชันสำหรับกำหนดค่า requiredTags ตามประเภทบริการ
 * - บริการ ไอโฟนแลกเงิน และ รีไฟแนนซ์ = "REFINANCE"
 * - บริการอื่นๆ เช่น ขายฝากมือถือ ซื้อขายมือถือ เทิร์นเครื่อง = "GENERAL"
 *
 * @param payload - ข้อมูลการอัพเดทการประเมิน
 * @returns
 */
const getRequiredTags = (type: AssessmentServiceType): string[] => {
  if (type === "IPHONE_EXCHANGE" || type === "REFINANCE") {
    return ["REFINANCE"];
  }
  return ["GENERAL"];
};

/**
 * ฟังก์ชันสำหรับเรียก API การจองคิว
 * @param queuePayload
 * @returns
 */
const bookQueue = async (queuePayload: QueueBookingPayload): Promise<any> => {
  console.log("📋 [QUEUE BOOKING] Payload:", JSON.stringify(queuePayload, null, 2));
  try {
    const response = await axios.post(
      "https://queue-backend-zeta.vercel.app/api/v1/appointments/new-customer",
      queuePayload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    console.log("✅ [QUEUE BOOKING] Success! Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [QUEUE BOOKING] Failed!");
    if (axios.isAxiosError(error)) {
      console.error("❌ [QUEUE BOOKING] Status:", error.response?.status);
      console.error("❌ [QUEUE BOOKING] Error Data:", error.response?.data);
      console.error("❌ [QUEUE BOOKING] Error Message:", error.message);
    } else {
      console.error("❌ [QUEUE BOOKING] Unknown Error:", error);
    }
    throw error;
  }
};

// ฟังก์ชันสำหรับกำหนดค่า appointmentType ตามประเภทสถานที่
const getAppointmentType = (
  locationType: "store" | "online" | "home" | "bts",
): "ONSITE" | "ONLINE" | "OFFSITE" => {
  if (locationType === "store") {
    return "ONSITE"; // หน้าร้าน
  }
  if (locationType === "online") {
    return "ONLINE"; // ออนไลน์
  }
  return "OFFSITE"; // นอกสถานที่ (home หรือ bts)
};

// ฟังก์ชันสำหรับ map service type เป็นภาษาไทย
const getServiceTypeInThai = (
  type: "SELL_NOW" | "CONSIGNMENT" | "REFINANCE" | "IPHONE_EXCHANGE" | "TRADE_IN",
): "ซื้อขายมือถือ" | "ขายฝากมือถือ" | "รีไฟแนนซ์" | "ไอโฟนแลกเงิน" | "อื่นๆ" => {
  if (type === "SELL_NOW") return "ซื้อขายมือถือ";
  if (type === "CONSIGNMENT") return "ขายฝากมือถือ";
  if (type === "REFINANCE") return "รีไฟแนนซ์";
  if (type === "IPHONE_EXCHANGE") return "ไอโฟนแลกเงิน";
  if (type === "TRADE_IN") return "อื่นๆ";
  return "อื่นๆ"; // default
};

/**
 * อัพเดทการจองบริการและคิวลงใบในการประเมิน
 *
 * @param assessmentId - รหัสการประเมิน mongoDB
 * @param type - ประเภทบริการ
 * @param lineUserId - LINE User ID ของลูกค้า (ถ้ามี)
 */
export function useUpdateAssessment(
  assessmentId: string,
  type: AssessmentServiceType,
  lineUserId?: string | null,
) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, AssessmentUpdateBody | FormData>({
    mutationFn: async (payload) => {
      if (!assessmentId) throw new Error("Missing assessmentId");
      const isForm = typeof FormData !== "undefined" && payload instanceof FormData;

      console.log("🔍 [MUTATION] Is FormData?", isForm);

      // ถ้าเป็น FormData ให้ใช้ API เดิม
      if (isForm) {
        console.log("📤 [MUTATION] Using FormData endpoint (skipping queue booking)");
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessments/${assessmentId}/service`;
        const res = await axios.put(url, payload);
        console.log("✅ [MUTATION] FormData PUT response:", res.data);
        return res.data;
      }

      // ถ้าเป็น JSON และมีข้อมูลการจองคิว
      const assessmentPayload = payload as AssessmentUpdateBody;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessments/${assessmentId}`;

      console.log("🔍 [MUTATION] Assessment Payload:", JSON.stringify(assessmentPayload, null, 2));

      // ดึงข้อมูลจาก service object ที่มีอยู่
      const activeService =
        assessmentPayload.sellNowServiceInfo ||
        assessmentPayload.pawnServiceInfo ||
        assessmentPayload.consignmentServiceInfo ||
        assessmentPayload.refinanceServiceInfo ||
        assessmentPayload.iphoneExchangeServiceInfo ||
        assessmentPayload.tradeInServiceInfo;

      console.log("🔍 [MUTATION] Active Service:", activeService);
      console.log("🔍 [MUTATION] Checking queue booking requirements...");
      console.log("   - appointmentAt:", (activeService as any)?.appointmentAt);
      console.log("   - branchId:", (activeService as any)?.branchId);
      console.log("   - serviceType:", (activeService as any)?.serviceType);
      console.log(
        "   - locationType:",
        "locationType" in (activeService || {}) ? (activeService as any).locationType : "N/A",
      );

      // ขั้นตอนที่ 1: ถ้ามีข้อมูลการจองคิวครบถ้วน ให้เรียก API การจองคิวก่อน
      // Note: Refinance and IPhoneExchange do NOT have these fields - they use manual booking
      if (
        (activeService as any)?.appointmentAt &&
        (activeService as any)?.branchId &&
        (activeService as any)?.serviceType
      ) {
        console.log(
          "✅ [MUTATION] Queue booking requirements met! Proceeding with queue booking...",
        );

        // ดึง locationType อย่างปลอดภัย
        const locationType =
          "locationType" in activeService ? (activeService as any).locationType : undefined;

        // ดึงข้อมูลลูกค้า
        const customerName = (activeService as any).customerName || "ไม่ระบุชื่อ";
        const customerPhone = (activeService as any).phone || "";
        // ใช้ LINE User ID จาก assessment (ส่งมาเป็น parameter) ถ้ามี ไม่งั้นใช้เบอร์โทร
        const customerLineUserId = lineUserId || customerPhone;

        // สร้าง payload สำหรับการจองคิว (รูปแบบใหม่)
        const queuePayload: QueueBookingPayload = {
          customer: {
            fullname: customerName,
            phone: customerPhone,
            line_user_id: customerLineUserId,
            email: "",
            picture_url: "https://lh3.googleusercontent.com/d/1TuqxKpYBdgpK-rtul5auS0b0B84JyBoG",
          },
          appointment: {
            date: (activeService as any).appointmentAt,
            type: getAppointmentType(locationType),
            serviceType: getServiceTypeInThai(type),
            branchId: (activeService as any).branchId,
            requiredTags: getRequiredTags(type),
          },
        };

        console.log("📦 [MUTATION] Queue Payload:", JSON.stringify(queuePayload, null, 2));

        // เรียก API การจองคิวก่อน (ถ้าล้มเหลวจะ throw error ไม่ไปสร้าง assessment)
        const queueResponse = await bookQueue(queuePayload);
        console.log(
          "✅ [QUEUE BOOKING] Queue booking successful! Proceeding to create assessment...",
        );

        // appointment.id หรือ รหัสการนัดหมายแอปจองคิว
        const appointmentId = queueResponse?.appointment?.id;
        if (appointmentId) {
          console.log("📝 [QUEUE BOOKING] Appointment ID received:", appointmentId);
          // จดรหัสการจองคิวไว้
          switch (type) {
            case "SELL_NOW": {
              assessmentPayload.sellNowServiceInfo.appointmentId = appointmentId;
              break;
            }
            case "CONSIGNMENT": {
              assessmentPayload.consignmentServiceInfo.appointmentId = appointmentId;
              break;
            }
            case "TRADE_IN": {
              assessmentPayload.tradeInServiceInfo.appointmentId = appointmentId;
              break;
            }
            // ไอโฟนแลกเงิน และ รีไฟแนนซ์ไม่ต้องจองคิว แต่ให้ติดต่อเจ้าหน้าที่เอาแทน
          }
          console.log("✅ [QUEUE BOOKING] Appointment ID added to service info");
        } else {
          console.warn("⚠️  [QUEUE BOOKING] No appointment ID in response");
        }
      } else {
        console.log("⚠️  [MUTATION] Queue booking requirements NOT met. Skipping queue booking.");
        console.log(
          "   Missing:",
          !(activeService as any)?.appointmentAt ? "appointmentAt " : "",
          !(activeService as any)?.branchId ? "branchId " : "",
          !(activeService as any)?.serviceType ? "serviceType " : "",
        );
      }

      // ขั้นตอนที่ 2: เรียก API การอัปเดต assessment (หลังจากจองคิวสำเร็จแล้ว)
      console.log("📤 [MUTATION] Creating/updating assessment...");
      const finalPayload: AssessmentUpdatePayload = {
        ...assessmentPayload,
        ...{ type: type },
      };

      const assessmentRes = await axios.put(url, finalPayload, {
        headers: { "Content-Type": "application/json" },
      });
      return assessmentRes.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("💥 [MUTATION] Axios Error Response:", error.response?.data);
        console.error("💥 [MUTATION] Axios Error Status:", error.response?.status);
      }
    },
  });
}

export function useCancelAssessment(assessmentId: string) {
  return useMutation({
    mutationFn: async (input: AssessmentCancelInput) => {
      if (!input.docId) throw new Error("Missing docId");
      if (!input.appointmentId) throw new Error("Missing appointmentId");

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assessments/${assessmentId}`;

      console.log("🚀 [CANCEL] Document ID:", input.docId);

      const paymentLinkResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE}`,
        {
          params: {
            doc_id: input.docId,
          },
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        },
      );

      const paymentLinkData: {
        payment_link: string;
        assessment_doc_id: string;
        payment_link_id: string;
      } = paymentLinkResponse.data;

      console.log("🚀 [CANCEL] Payment Link Data:", paymentLinkData);
      if (!paymentLinkData || paymentLinkResponse.status !== 200) {
        console.error("💥 [CANCEL] Supabase Error:", paymentLinkData);
        throw new Error("Failed to retrieve payment link from Supabase");
      }

      try {
        const response = await axios.patch(
          `/api/disable-payment-link/${paymentLinkData.payment_link_id}`,
        );

        if (!response.data || response.status !== 200) {
          console.error("💥 [CANCEL] Failed to disable payment link:", response.data);
          throw new Error("Failed to disable payment link");
        }

        console.log("✅ [CANCEL] Payment link disabled successfully:", response.data);

        await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_PAYMENT_LINK_STORAGE}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
          data: {
            payment_link_id: paymentLinkData.payment_link_id,
          },
        });

        await axios.post(
          `https://queue-backend-zeta.vercel.app/api/v1/appointments/cancel/${input.appointmentId}`,
        );

        await axios.put(url, {
          status: "pending",
        });
      } catch (error) {
        console.error("💥 [CANCEL] Error during cancellation process:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("✅ [CANCEL] Assessment cancellation successful");
    },
    onError: (error) => {
      console.error("💥 [CANCEL] Assessment cancellation failed:", error);
    },
  });
}
