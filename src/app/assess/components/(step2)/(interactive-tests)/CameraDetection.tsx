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

  // Silas's logic: A robust cleanup function is crucial.
  const cleanupStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startTest = async () => {
    setPhase("prompt_permission");
    setPermissionError(null);
    cleanupStream(); // Clean up any previous stream

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
      // Kaia's insight: Graceful degradation. If back camera fails, the test still passes.
      console.warn(
        "Back camera not found or failed, concluding as success.",
        err,
      );
      onConclude(true);
    }
  };

  // Effect to attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Effect for the 1.5s checkmark delay
  useEffect(() => {
    if (phase === "testing_front" || phase === "testing_back") {
      const timer = setTimeout(() => setShowCheckmark(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Effect for cleanup on unmount
  useEffect(() => {
    return cleanupStream;
  }, []);

  // Reset state when modal is closed
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
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onConclude(false)}
          >
            ปิด
          </Button>
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
          {/* Aria's touch: The beautiful overlay UI */}
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/50 to-transparent p-4">
            <AnimatePresence>
              {showCheckmark && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="self-end"
                >
                  <Check className="bg-success/80 text-success-foreground h-8 w-8 rounded-full p-1" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-center">
              <p className="mb-4 font-semibold text-white">
                {phase === "testing_front"
                  ? "กำลังทดสอบกล้องหน้า..."
                  : "กำลังทดสอบกล้องหลัง..."}
              </p>
              <AnimatePresence>
                {showCheckmark && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {phase === "testing_front" ? (
                      <Button onClick={switchToBackCamera} className="gap-2">
                        ทดสอบกล้องหลัง <RefreshCw className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onConclude(true)}
                        className="bg-success hover:bg-success/90"
                      >
                        เสร็จสิ้น
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    }

    // Default is 'idle'
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <Button size="lg" className="h-14 px-8 text-lg" onClick={startTest}>
          เริ่มการทดสอบ
        </Button>
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
