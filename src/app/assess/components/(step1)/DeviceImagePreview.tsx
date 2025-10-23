// src/app/assess/components/(step1)/DeviceImagePreview.tsx
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { IoPhonePortraitOutline } from "react-icons/io5";

interface DeviceImagePreviewProps {
  imageUrl?: string;
  altText: string;
  isLoading: boolean;
}

const DeviceImagePreview = ({ imageUrl, altText, isLoading }: DeviceImagePreviewProps) => {
  return (
    // ✨ [แก้ไข] ปรับเพื่อให้ภาพจัดกึ่งกลางและมีขนาดที่เหมาะสม
    <div className="flex w-full items-center justify-center">
      {isLoading ? (
        <Skeleton className="h-[250px] w-[250px] rounded-2xl" />
      ) : (
        <div className="relative h-[250px] w-[250px] overflow-hidden rounded-2xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div
              className="relative flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 text-center"
              aria-label="ไม่มีรูปตัวอย่างอุปกรณ์"
            >
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <IoPhonePortraitOutline className="mx-auto mb-2 h-10 w-10 text-slate-400 sm:h-12 sm:w-12" />
                  <div className="text-xs font-medium text-slate-500">ไม่มีรูปภาพ</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceImagePreview;
