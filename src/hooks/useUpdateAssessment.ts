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
  appointmentAt?: string; // วันที่และเวลานัดหมายในรูปแบบ ISO 8601
  branchId?: string; // รหัสสาขา ("เซ็นเตอร์วัน" หรือ "กุดปลาดุก")
  serviceType?: string; // ประเภทบริการ
  note?: string; // หมายเหตุเพิ่มเติม (ถ้ามี)
  locationType?: string; // ประเภทสถานที่ (store, home, bts)
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
    serviceType: string; // ประเภทบริการ (ภาษาไทย)
    branchId: string; // รหัสสาขา
    requiredTags: string[]; // "REFINANCE" สำหรับ iphoneExchange และ refinance, "GENERAL" สำหรับบริการอื่นๆ
  };
};

// ฟังก์ชันสำหรับกำหนดค่า requiredTags ตามประเภทบริการ
const getRequiredTags = (payload: AssessmentUpdateBody): string[] => {
  if (payload.iphoneExchangeServiceInfo || payload.refinanceServiceInfo) {
    return ["REFINANCE"];
  }
  return ["GENERAL"];
};

// ฟังก์ชันสำหรับเรียก API การจองคิว
const bookQueue = async (queuePayload: QueueBookingPayload): Promise<any> => {
  console.log("📋 [QUEUE BOOKING] Starting queue booking process...");
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
    console.log("✅ [QUEUE BOOKING] Status Code:", response.status);
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
const getAppointmentType = (locationType: string | undefined): "ONSITE" | "ONLINE" | "OFFSITE" => {
  if (locationType === "store") {
    return "ONSITE"; // หน้าร้าน
  }
  if (locationType === "online") {
    return "ONLINE"; // ออนไลน์
  }
  return "OFFSITE"; // นอกสถานที่ (home หรือ bts)
};

// ฟังก์ชันสำหรับ map service type เป็นภาษาไทย
const getServiceTypeInThai = (payload: AssessmentUpdateBody): string => {
  if (payload.sellNowServiceInfo) return "ซื้อขายมือถือ";
  if (payload.pawnServiceInfo) return "ขายฝากมือถือ";
  if (payload.refinanceServiceInfo) return "รีไฟแนนซ์";
  if (payload.iphoneExchangeServiceInfo) return "ไอโฟนแลกเงิน";
  if (payload.consignmentServiceInfo) return "ขายฝากมือถือ";
  if (payload.tradeInServiceInfo) return "อื่นๆ";
  return "อื่นๆ"; // default
};

export function useUpdateAssessment(assessmentId: string | undefined, lineUserId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, AssessmentUpdateBody | FormData>({
    mutationFn: async (payload) => {
      console.log("🚀 [MUTATION] Starting mutation...");
      console.log("🚀 [MUTATION] Assessment ID:", assessmentId);

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
      console.log("   - appointmentAt:", activeService?.appointmentAt);
      console.log("   - branchId:", activeService?.branchId);
      console.log("   - serviceType:", activeService?.serviceType);
      console.log(
        "   - locationType:",
        "locationType" in (activeService || {}) ? (activeService as any).locationType : "N/A",
      );

      // ขั้นตอนที่ 1: ถ้ามีข้อมูลการจองคิวครบถ้วน ให้เรียก API การจองคิวก่อน
      if (activeService?.appointmentAt && activeService?.branchId && activeService?.serviceType) {
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
            date: activeService.appointmentAt,
            type: getAppointmentType(locationType),
            serviceType: getServiceTypeInThai(assessmentPayload),
            branchId: activeService.branchId,
            requiredTags: getRequiredTags(assessmentPayload),
          },
        };

        console.log("📦 [MUTATION] Queue Payload:", JSON.stringify(queuePayload, null, 2));

        // เรียก API การจองคิวก่อน (ถ้าล้มเหลวจะ throw error ไม่ไปสร้าง assessment)
        await bookQueue(queuePayload);
        console.log("✅ [MUTATION] Queue booking successful! Proceeding to create assessment...");
      } else {
        console.log("⚠️  [MUTATION] Queue booking requirements NOT met. Skipping queue booking.");
        console.log(
          "   Missing:",
          !activeService?.appointmentAt ? "appointmentAt " : "",
          !activeService?.branchId ? "branchId " : "",
          !activeService?.serviceType ? "serviceType " : "",
        );
      }

      // ขั้นตอนที่ 2: เรียก API การอัปเดต assessment (หลังจากจองคิวสำเร็จแล้ว)
      console.log("📤 [MUTATION] Creating/updating assessment...");
      const assessmentRes = await axios.put(url, assessmentPayload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ [MUTATION] Assessment PUT response:", assessmentRes.data);
      return assessmentRes.data;
    },
    onSuccess: (data) => {
      console.log("🎉 [MUTATION] Mutation successful!");
      console.log("🎉 [MUTATION] Success data:", data);
      if (data.success) {
        console.log("🔄 [MUTATION] Invalidating assessment query cache...");
        queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
      }
    },
    onError: (error) => {
      console.error("💥 [MUTATION] Mutation failed!");
      console.error("💥 [MUTATION] Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("💥 [MUTATION] Axios Error Response:", error.response?.data);
        console.error("💥 [MUTATION] Axios Error Status:", error.response?.status);
      }
    },
  });
}
