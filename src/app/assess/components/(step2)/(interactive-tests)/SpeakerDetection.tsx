"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SpeakerDetectionProps {
  isOpen: boolean;
  onConclude: (result: boolean) => void;
}

type TestPhase = "idle" | "playing" | "prompting" | "evaluating";

const SpeakerDetection = ({ isOpen, onConclude }: SpeakerDetectionProps) => {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [playedNumber, setPlayedNumber] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kaia's insight: Reset state when the modal is closed to ensure a fresh start.
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPhase("idle");
        setAttempts(0);
        setPlayedNumber(null);
        setSelectedNumber(null);
      }, 300); // Delay reset to allow for closing animation
    }
  }, [isOpen]);

  // Silas's logic: The core function to start or restart the test.
  const handleStartTest = () => {
    setPhase("playing");
    setSelectedNumber(null); // Clear previous selection

    const randomNum = Math.floor(Math.random() * 5) + 1;
    setPlayedNumber(randomNum);

    // Stop any previously playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(`/audio/${randomNum}.wav`);
    audioRef.current = audio;
    audio.play();

    // The bridge between 'playing' and 'prompting'
    audio.onended = () => {
      setPhase("prompting");
    };
  };

  // Logic for when the user selects a number.
  const handleNumberSelect = (selectedNum: number) => {
    setPhase("evaluating");
    setSelectedNumber(selectedNum);

    const isCorrect = selectedNum === playedNumber;

    if (isCorrect) {
      setTimeout(() => onConclude(true), 1000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts < 2) {
        // Try again
        setTimeout(handleStartTest, 1500);
      } else {
        // Failed after 2 attempts
        setTimeout(() => onConclude(false), 1000);
      }
    }
  };

  const renderContent = () => {
    switch (phase) {
      case "playing":
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Volume2 className="text-primary h-16 w-16" />
            </motion.div>
            <p className="text-muted-foreground mt-4">
              กำลังเล่นเสียง... กรุณาตั้งใจฟัง
            </p>
          </div>
        );
      case "prompting":
        return (
          <div>
            <DialogDescription className="mb-6 text-center">
              ท่านได้ยินเสียงหมายเลขใด?
            </DialogDescription>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-16 text-2xl font-bold"
                  onClick={() => handleNumberSelect(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={handleStartTest}>
                เล่นเสียงซ้ำ
              </Button>
            </div>
          </div>
        );
      case "evaluating":
        const isCorrect = selectedNumber === playedNumber;
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {isCorrect ? (
                <Check className="text-success h-16 w-16" />
              ) : (
                <X className="text-destructive h-16 w-16" />
              )}
            </motion.div>
            <p className="mt-4 font-semibold">
              {isCorrect
                ? "ถูกต้อง!"
                : attempts < 2
                  ? "ไม่ถูกต้อง, ลองอีกครั้ง"
                  : "ไม่ถูกต้อง"}
            </p>
          </div>
        );
      case "idle":
      default:
        return (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg"
              onClick={handleStartTest}
            >
              เริ่มทดสอบ
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onConclude(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ขั้นตอนที่ 1: ทดสอบลำโพง</DialogTitle>
          <DialogDescription>
            กรุณาตรวจสอบว่าท่านได้เปิดเสียงอุปกรณ์แล้ว
          </DialogDescription>
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
