import { Calendar, ClipboardList, Home, MapPin, Phone, Store, User } from "lucide-react";
import {
  // AssessmentRecord,
  PawnServiceInfo,
} from "../AssessmentDetails";
// import Image from "next/image";

export default function PawnServiceDetails({
  pawnServiceInfo,
  // selectedService,
}: {
  pawnServiceInfo: PawnServiceInfo;
  // selectedService: AssessmentRecord["selectedService"];
}) {
  return (
    <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
      {/* <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500`}
        >
          <ClipboardList className="h-5 w-5 text-white" />
        </div>
        <span className="text-base font-bold text-slate-800 md:text-lg">
          ข้อมูลบริการและการนัดหมาย
        </span>
      </div>
      <div className="mb-4 flex flex-col justify-between gap-2 rounded-xl border border-orange-200 bg-white p-4 shadow-sm md:items-center md:gap-4 lg:flex-row">
        <div>
          <span className="text-base font-bold text-[#f97316] md:text-lg">
            {selectedService.name}
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-[#78716c] md:mt-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium md:text-sm">
              {selectedService.appointmentDate}
            </span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs text-slate-600 md:text-sm">
            ยอดเงินที่จะได้รับ
          </span>
          <div className="flex items-center justify-start md:justify-end gap-2">
            <span className="block text-xl font-bold text-[#f97316] md:text-2xl">
              {selectedService.price.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 0,
              })}
            </span>
            <Image
              src={"https://lh3.googleusercontent.com/d/1X_QS-ahnw2ubo0brwEt-oZwLX64JpNiK"}
              width={100}
              height={100}
              alt="animated-coin"
              className="-m-6"
              priority
            />
          </div>
        </div>
      </div> */}
      <div className="flex flex-col gap-2 text-xs lg:text-sm">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-violet-500" />
          <span className="font-semibold">ชื่อผู้ใช้:</span>
          <span>{pawnServiceInfo.customerName}</span>
        </div>
        <div className="flex items-start gap-3">
          {pawnServiceInfo.locationType === "home" ? (
            <Home className="h-5 w-5 flex-shrink-0 text-sky-500" />
          ) : pawnServiceInfo.locationType === "bts" ? (
            <MapPin className="h-5 w-5 flex-shrink-0 text-emerald-500" />
          ) : (
            <Store className="h-5 w-5 flex-shrink-0 text-yellow-700" />
          )}
          <div className="flex items-start text-left">
            <span className="font-semibold">สถานที่นัดหมาย:</span>
            <span>
              {pawnServiceInfo.locationType === "home" &&
                `รับถึงบ้าน (${pawnServiceInfo.homeAddress || ""})`}
              {pawnServiceInfo.locationType === "bts" &&
                `${pawnServiceInfo.btsLine} - สถานี ${pawnServiceInfo.btsStation}`}
              {pawnServiceInfo.locationType === "store" && `${pawnServiceInfo.storeBranch}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">โทร:</span>
          <span>{pawnServiceInfo.phone}</span>
        </div>
      </div>
    </div>
  );
}
