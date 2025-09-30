import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportSection() {
  return (
    <div>
      <div className="md:rounded-xl md:border md:border-[#e3dace] md:p-5">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-500`}
          >
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-slate-800 md:text-lg">
            ต้องการความช่วยเหลือ
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Button className="w-full">
            ติดต่อเจ้าหน้าที่
          </Button>
          <Button variant="outline" className="w-full">
            คำถามที่พบบ่อย (FAQ)
          </Button>
          <Button variant="outline" className="w-full">
            ยกเลิก/แก้ไขนัดหมาย
          </Button>
          <Button
            variant="link"
            className="w-full text-slate-500"
          >
            ดูข้อกำหนดและเงื่อนไข
          </Button>
        </div>
      </div>
    </div>
  );
}
