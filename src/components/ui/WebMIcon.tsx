import Image from "next/image";
import { useRef, useEffect } from "react";

interface WebMIconProps {
  src: string;
  delay?: number;
}

/**
 * WebMIcon component
 * - src: string - ที่อยู่ของไฟล์วิดีโอ WebM
 * - delay: number (optional) - ระยะห่างเวลาต่อรอบการเล่น (default is 1.5 seconds)
 *
 * @returns JSX.Element
 */

export default function WebMIcon({ src, delay = 1.5 }: WebMIconProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setTimeout(() => {
        video.play();
      }, delay * 1000); // รอ delay วินาทีก่อนเล่นใหม่
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return <Image alt="web-icon" width={100} height={100} src={src} className="h-28 w-28" />;
}
