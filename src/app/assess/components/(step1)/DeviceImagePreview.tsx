// src/app/assess/components/(step1)/DeviceImagePreview.tsx
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-center text-sm">
              ไม่พบรูปภาพ
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceImagePreview;
