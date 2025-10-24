// src/app/details/(step3)/ReservedServiceDetails.tsx

import React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import ServiceBenefits from "./ServiceBenefits";

interface ReservedServiceDetailsProps {
  payload: any;
  serviceId: string;
  serviceTitle: string;
  assessmentId?: string;
  benefits: string[];
  theme: any;
  onNavError: (error: string) => void;
}

// Helper function to get location text from payload
const getLocationText = (payload: any) => {
  if (!payload) return "-";

  // Check for different location field names across services
  if (payload.location) return payload.location;
  if (payload.btsStation) return `BTS ${payload.btsStation}`;
  if (payload.deliveryAddress) return payload.deliveryAddress;
  if (payload.pickupLocation) return payload.pickupLocation;

  return "-";
};

export default function ReservedServiceDetails({
  payload,
  serviceId,
  serviceTitle,
  assessmentId,
  benefits,
  theme,
  onNavError,
}: ReservedServiceDetailsProps) {
  const router = useRouter();

  return (
    <div className="space-y-2 text-sm text-slate-700">
      {/* Reserved primary details */}
      <div className="flex items-center gap-2">
        <span className="text-slate-500">ชื่อลูกค้า:</span>
        <span className="font-medium">
          {(() => {
            const rec = payload as unknown as Record<string, unknown>;
            return typeof rec.customerName === "string" ? (rec.customerName as string) : "-";
          })()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500">เบอร์โทร:</span>
        <span className="font-medium">
          {(() => {
            const rec = payload as unknown as Record<string, unknown>;
            return typeof rec.phone === "string" ? (rec.phone as string) : "-";
          })()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500">สถานที่:</span>
        <span className="font-medium">{getLocationText(payload)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500">วันนัดหมาย:</span>
        <span className="font-medium">
          {(() => {
            const rec = payload as unknown as Record<string, unknown>;
            return typeof rec.appointmentDate === "string" ? (rec.appointmentDate as string) : "-";
          })()}
        </span>
        <span className="text-pink-600">
          {(() => {
            const rec = payload as unknown as Record<string, unknown>;
            return typeof rec.appointmentTime === "string" ? (rec.appointmentTime as string) : "-";
          })()}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-start gap-2">
        <Link
          href={`/confirmed/${assessmentId}?service=${serviceId}`}
          className={cn("inline-flex items-center gap-2 text-sm font-semibold", theme.text)}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4" />
          ดูใบยืนยันการจอง
        </Link>
      </div>

      {/* Benefits section for reserved service */}
      <div className={cn("mt-4 rounded-xl border p-4", theme.soft, theme.borderColor)}>
        <p className={cn("text-xs font-semibold", theme.text)}>สิทธิประโยชน์ของบริการนี้</p>
        <div className="mt-2">
          <ServiceBenefits benefits={benefits} theme={theme} />
        </div>
      </div>

      {/* Go to Details button */}
      <div className="mt-4 flex justify-end">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            try {
              if (!assessmentId || typeof assessmentId !== "string") {
                throw new Error("ไม่พบรหัสการประเมินที่ถูกต้อง");
              }
              router.push(`/confirmed/${assessmentId}`);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการนำทาง";
              onNavError(msg);
              console.error("Navigation error:", err);
            }
          }}
          size="lg"
          aria-label={`ไปที่รายละเอียดบริการ ${serviceTitle}`}
          className={cn(
            "h-12 w-full text-base font-bold text-white shadow-lg transition-all duration-300 sm:w-max",
            theme.solidBg,
            `hover:${theme.solidBg} hover:brightness-110`,
          )}
        >
          ไปที่รายละเอียด
        </Button>
      </div>
    </div>
  );
}
