// src/app/assess/components/(step2)/(interactive-tests)/SpeakerDetection.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FramerButton from "../../../../../components/ui/framer/FramerButton";

interface SpeakerDetectionProps {
  isOpen: boolean;
  // ✨ [แก้ไข] เปลี่ยน Type ของ onConclude
  onConclude: (result: "speaker_ok" | "speaker_failed") => void;
}

type TestPhase = "idle" | "playing" | "prompting" | "evaluating";

const SpeakerDetection = ({ isOpen, onConclude }: SpeakerDetectionProps) => {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [playedNumber, setPlayedNumber] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhase("idle");
        setAttempts(0);
        setPlayedNumber(null);
        setSelectedNumber(null);
      }, 300);
    }
  }, [isOpen]);

  const handleStartTest = () => {
    setPhase("playing");
    setSelectedNumber(null);

    const randomNum = Math.floor(Math.random() * 5) + 1;
    setPlayedNumber(randomNum);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`/audio/${randomNum}.wav`);
    audioRef.current = audio;
    audio.play();

    audio.onended = () => {
      setPhase("prompting");
    };
  };

  const handleNumberSelect = (selectedNum: number) => {
    setPhase("evaluating");
    setSelectedNumber(selectedNum);

    const isCorrect = selectedNum === playedNumber;

    if (isCorrect) {
      // ✨ [แก้ไข] ส่งค่า "speaker_ok"
      setTimeout(() => onConclude("speaker_ok"), 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts < 2) {
        setTimeout(handleStartTest, 1500);
      } else {
        // ✨ [แก้ไข] ส่งค่า "speaker_failed"
        setTimeout(() => onConclude("speaker_failed"), 1000);
      }
    }
  };

  const renderContent = () => {
    switch (phase) {
      case "playing":
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Volume2 className="text-primary h-16 w-16" />
            </motion.div>
            <p className="text-muted-foreground mt-4">กำลังเล่นเสียง... กรุณาตั้งใจฟัง</p>
          </div>
        );
      case "prompting":
        return (
          <div>
            <DialogDescription className="mb-6 text-center">ท่านได้ยินเสียงหมายเลขใด?</DialogDescription>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <FramerButton
                  key={num}
                  variant="outline"
                  className="h-16 text-2xl font-bold"
                  onClick={() => handleNumberSelect(num)}
                >
                  {num}
                </FramerButton>
              ))}
            </div>
            <div className="mt-4 text-center">
              <FramerButton onClick={handleStartTest}>เล่นเสียงซ้ำ</FramerButton>
            </div>
          </div>
        );
      case "evaluating":
        const isCorrect = selectedNumber === playedNumber;
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {isCorrect ? <Check className="text-success h-16 w-16" /> : <X className="text-destructive h-16 w-16" />}
            </motion.div>
            <p className="mt-4 font-semibold">
              {isCorrect ? "ถูกต้อง!" : attempts < 2 ? "ไม่ถูกต้อง, ลองอีกครั้ง" : "ไม่ถูกต้อง"}
            </p>
          </div>
        );
      case "idle":
      default:
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <FramerButton size="lg" className="h-14 px-8 text-lg" onClick={handleStartTest}>
              เริ่มทดสอบ
            </FramerButton>
          </div>
        );
    }
  };

  return (
    // ✨ [แก้ไข] ส่งค่า "speaker_failed" เมื่อผู้ใช้ปิด Dialog
    <Dialog open={isOpen} onOpenChange={(open) => !open && onConclude("speaker_failed")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ขั้นตอนที่ 1: ทดสอบลำโพง</DialogTitle>
          <DialogDescription>กรุณาตรวจสอบว่าท่านได้เปิดเสียงอุปกรณ์แล้ว</DialogDescription>
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
};

export default SpeakerDetection;
