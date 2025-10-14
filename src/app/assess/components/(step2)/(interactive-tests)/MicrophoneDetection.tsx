// src/app/assess/components/(step2)/(interactive-tests)/MicrophoneDetection.tsx

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FramerButton from "../../../../../components/ui/framer/FramerButton";

interface MicrophoneDetectionProps {
  isOpen: boolean;
  onConclude: (result: "mic_ok" | "mic_failed") => void;
}

type TestPhase = "idle" | "prompt_permission" | "testing" | "error";

const VOLUME_THRESHOLD = 25;
const TEST_TIMEOUT = 10000;

export default function MicrophoneDetection({ isOpen, onConclude }: MicrophoneDetectionProps) {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [micVolume, setMicVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConcludedRef = useRef(false);

  const handleConclude = useCallback(
    (result: "mic_ok" | "mic_failed") => {
      if (isConcludedRef.current) return;
      isConcludedRef.current = true;
      onConclude(result);
    },
    [onConclude],
  );

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    streamRef.current = null;
  };

  const startTest = async () => {
    setPhase("prompt_permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;

      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      setPhase("testing");
    } catch (err) {
      console.error("Microphone access denied:", err);
      setPhase("error");
      // ✨ [ลบ] setTimeout ออก
    }
  };

  useEffect(() => {
    if (phase !== "testing" || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    timeoutRef.current = setTimeout(() => {
      handleConclude("mic_failed");
    }, TEST_TIMEOUT);

    const measure = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      const volumePercent = Math.min(100, Math.floor((average / 128) * 100 * 1.5));
      setMicVolume(volumePercent);

      if (volumePercent >= VOLUME_THRESHOLD) {
        handleConclude("mic_ok");
      } else {
        animationFrameRef.current = requestAnimationFrame(measure);
      }
    };

    animationFrameRef.current = requestAnimationFrame(measure);

    return cleanup;
  }, [phase, handleConclude]);

  useEffect(() => {
    if (isOpen) {
      isConcludedRef.current = false;
    }

    if (!isOpen) {
      cleanup();
      setTimeout(() => {
        setPhase("idle");
        setMicVolume(0);
      }, 300);
    }
  }, [isOpen]);

  const renderContent = () => {
    switch (phase) {
      case "prompt_permission":
        return (
          <p className="text-muted-foreground flex h-48 items-center justify-center text-center">
            กรุณาอนุญาตให้เบราว์เซอร์ใช้ไมโครโฟนของท่าน...
          </p>
        );
      case "error":
        // ✨ [แก้ไข] ปรับ UI ของหน้า Error ทั้งหมด
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <XCircle className="text-destructive mb-4 h-12 w-12" />
            <p className="text-lg font-semibold text-black">ไม่สามารถเข้าถึงไมโครโฟนได้</p>
            <p className="text-muted-foreground mt-2 text-sm">กรุณาตรวจสอบการตั้งค่าในเบราว์เซอร์ของท่าน</p>
            <FramerButton
              size="lg"
              className="bg-primary mt-6 h-14 w-full text-white"
              onClick={() => handleConclude("mic_failed")}
            >
              รับทราบและดำเนินการต่อ
            </FramerButton>
          </div>
        );
      case "testing":
        return (
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground mb-4">กรุณาลองพูดใส่ไมโครโฟน</p>
            <div className="bg-muted relative flex h-48 w-full flex-col-reverse overflow-hidden rounded-lg">
              <motion.div
                className="bg-success w-full"
                initial={{ height: "0%" }}
                animate={{ height: `${micVolume}%` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              <div className="absolute top-0 left-0 h-full w-full p-2">
                <div className="border-background/20 flex h-full w-full flex-col-reverse rounded-md border-2 border-dashed">
                  <div
                    style={{ height: `${VOLUME_THRESHOLD}%` }}
                    className="border-background w-full border-t-2 border-dashed"
                  />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">พูดให้เสียงดังถึงขีดที่กำหนด</p>
          </div>
        );
      case "idle":
      default:
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <FramerButton size="lg" className="h-14 px-8 text-lg" onClick={startTest}>
              เริ่มการทดสอบ
            </FramerButton>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleConclude("mic_failed")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ขั้นตอนที่ 2: ทดสอบไมโครโฟน</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
