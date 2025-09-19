"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TouchscreenTestProps {
  isOpen: boolean;
  onConclude: (percentage: number) => void;
}

const GRID_SIZE = 20;
const TIMER_DURATION = 30;

export const TouchscreenTest = ({
  isOpen,
  onConclude,
}: TouchscreenTestProps) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchedCellsRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>(0);

  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  const totalCells = GRID_SIZE * GRID_SIZE;

  const handleConclude = useCallback(() => {
    const finalPercentage = Math.floor(
      (touchedCellsRef.current.size / totalCells) * 100,
    );
    onConclude(finalPercentage);
  }, [onConclude, totalCells]);

  // [FIX - PART 1] This useEffect is now ONLY responsible for counting down.
  useEffect(() => {
    if (isOpen && timer > 0) {
      const intervalId = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      handleConclude();
    }
  }, [isOpen, timer, handleConclude]);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setTimer(TIMER_DURATION);
    setFillPercentage(0);
    touchedCellsRef.current.clear();
    isDrawingRef.current = false;
    lastPositionRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round";
      ctx.lineWidth = 30; // Increased for better coverage

      const styles = getComputedStyle(canvas);
      const primaryColor = `hsl(${styles.getPropertyValue("--primary").trim()})`;
      const secondaryColor = `hsl(${styles.getPropertyValue("--secondary").trim()})`;
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor);
      ctx.strokeStyle = gradient;
    };
    resizeCanvas();

    // --- [CHIRON'S FIX - PART 2] - Self-contained drawing logic ---
    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    const getCoords = (e: MouseEvent | TouchEvent): [number, number] | null => {
      if (e instanceof MouseEvent) return [e.clientX, e.clientY];
      if (e.touches && e.touches.length > 0)
        return [e.touches[0].clientX, e.touches[0].clientY];
      return null;
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const coords = getCoords(e);
      if (coords) lastPositionRef.current = { x: coords[0], y: coords[1] };
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
      lastPositionRef.current = null;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const coords = getCoords(e);
      if (!coords || !lastPositionRef.current) return;

      ctx.beginPath();
      ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
      ctx.lineTo(coords[0], coords[1]);
      ctx.stroke();

      lastPositionRef.current = { x: coords[0], y: coords[1] };

      const cellX = Math.floor(coords[0] / cellWidth);
      const cellY = Math.floor(coords[1] / cellHeight);
      const cellKey = `${cellX},${cellY}`;

      if (!touchedCellsRef.current.has(cellKey)) {
        touchedCellsRef.current.add(cellKey);
        // [CRITICAL FIX] We only call setState when the percentage actually changes.
        // This is the only state update that happens during drawing.
        const newPercentage = Math.floor(
          (touchedCellsRef.current.size / totalCells) * 100,
        );
        setFillPercentage(newPercentage);
      }
    };

    // Attach event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing); // Important for desktop
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("resize", resizeCanvas);

    // Cleanup function
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchmove", draw);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isOpen, totalCells]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <div className="absolute top-0 right-0 left-0 flex items-center justify-between rounded-xl bg-black/30 p-4 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold">{timer}</div>
              <div className="text-xs uppercase">วินาที</div>
            </div>
            <div className="text-center">
              <p className="text-lg">กรุณาระบายสีให้ทั่วทั้งหน้าจอ</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{fillPercentage}%</div>
              <div className="text-xs uppercase">พื้นที่</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
