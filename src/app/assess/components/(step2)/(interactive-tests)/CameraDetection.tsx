"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FramerButton from "../../../../../components/ui/framer/FramerButton";

interface CameraDetectionProps {
  isOpen: boolean;
  onConclude: (result: boolean) => void;
}

type TestPhase =
  | "idle"
  | "prompt_permission"
  | "testing_front"
  | "testing_back"
  | "error";

const CameraDetection = ({ isOpen, onConclude }: CameraDetectionProps) => {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cleanupStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startTest = async () => {
    setPhase("prompt_permission");
    setPermissionError(null);
    cleanupStream();

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      setPhase("testing_front");
    } catch (err: any) {
      console.error("Camera access denied:", err);
      setPermissionError(
        "ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการตั้งค่าในเบราว์เซอร์ของท่าน",
      );
      setPhase("error");
    }
  };

  const switchToBackCamera = async () => {
    setPhase("testing_back");
    setShowCheckmark(false);
    cleanupStream();

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      setStream(newStream);
    } catch (err) {
      console.warn(
        "Back camera not found or failed, concluding as success.",
        err,
      );
      onConclude(true);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (phase === "testing_front" || phase === "testing_back") {
      const timer = setTimeout(() => setShowCheckmark(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    return cleanupStream;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanupStream();
      setTimeout(() => {
        setPhase("idle");
        setPermissionError(null);
        setShowCheckmark(false);
      }, 300);
    }
  }, [isOpen]);

  const renderContent = () => {
    if (phase === "error") {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <XCircle className="text-destructive mb-4 h-12 w-12" />
          <p className="text-destructive-foreground">{permissionError}</p>
          <FramerButton
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onConclude(false)}
          >
            ปิด
          </FramerButton>
        </div>
      );
    }

    if (phase === "prompt_permission") {
      return (
        <p className="text-muted-foreground flex h-64 items-center justify-center text-center">
          กรุณาอนุญาตให้เบราว์เซอร์ใช้กล้องของท่าน...
        </p>
      );
    }

    if (phase === "testing_front" || phase === "testing_back") {
      return (
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />

          {/* [FIX] This overlay is now for the instructional text at the bottom */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-center font-semibold text-white">
              {phase === "testing_front"
                ? "กำลังทดสอบกล้องหน้า..."
                : "กำลังทดสอบกล้องหลัง..."}
            </p>
          </div>

          {/* [FIX] New centered overlay for the confirmation UI */}
          <AnimatePresence>
            {showCheckmark && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-4 rounded-2xl bg-black/50 p-8 backdrop-blur-md"
                >
                  <Check className="bg-success/80 text-success-foreground h-12 w-12 rounded-full p-2" />

                  {phase === "testing_front" ? (
                    <FramerButton
                      onClick={switchToBackCamera}
                      className="gap-2"
                    >
                      ทดสอบกล้องหลัง <RefreshCw className="h-4 w-4" />
                    </FramerButton>
                  ) : (
                    <FramerButton
                      onClick={() => onConclude(true)}
                      className="bg-success hover:bg-success/90"
                    >
                      เสร็จสิ้น
                    </FramerButton>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Default is 'idle'
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <FramerButton
          size="lg"
          className="h-14 px-8 text-lg"
          onClick={startTest}
        >
          เริ่มการทดสอบ
        </FramerButton>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onConclude(false)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>ขั้นตอนที่ 3: ทดสอบกล้อง</DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDetection;
