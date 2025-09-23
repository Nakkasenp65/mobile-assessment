"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Brush, Pointer } from "lucide-react";

interface TouchscreenTestProps {
  isOpen: boolean;
  onConclude: (percentage: number) => void;
}

const GRID_SIZE = 12;
const TIMER_DURATION = 90000;

export const TouchscreenTest = ({
  isOpen,
  onConclude,
}: TouchscreenTestProps) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [fillPercentage, setFillPercentage] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchedCellsRef = useRef<Set<string>>(new Set());
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const isConcludedRef = useRef(false);

  const totalCells = GRID_SIZE * GRID_SIZE;

  const handleConclude = useCallback(() => {
    if (isConcludedRef.current) return;
    isConcludedRef.current = true;

    const finalPercentage = Math.floor(
      (touchedCellsRef.current.size / totalCells) * 100,
    );
    onConclude(finalPercentage);
  }, [onConclude, totalCells]);

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

    setTimer(TIMER_DURATION);
    setFillPercentage(0);
    touchedCellsRef.current.clear();
    isDrawingRef.current = false;
    lastPositionRef.current = null;
    isConcludedRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.lineCap = "round";
      ctx.lineWidth = 50;

      const styles = getComputedStyle(canvas);
      const primaryColor = `${styles.getPropertyValue("--primary").trim()}`;
      const secondaryColor = `${styles.getPropertyValue("--secondary").trim()}`;
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
        const newPercentage = Math.floor(
          (touchedCellsRef.current.size / totalCells) * 100,
        );
        setFillPercentage(newPercentage);

        if (newPercentage >= 100) {
          handleConclude();
        }
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("resize", resizeCanvas);

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
  }, [isOpen, totalCells, handleConclude]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <div className="flex flex-col items-center justify-between rounded-xl text-white">
            {/* Painting */}
            <div className="text-center">
              <p className="text-md flex flex-col items-center justify-center gap-2">
                <div className="rounded-full border-2 p-3">
                  <Pointer strokeWidth={1} size={32} />
                </div>
                กรุณาระบายสีให้ทั่วทั้งหน้าจอ
              </p>
            </div>
            {/* Timer */}
            <div className="absolute bottom-24 z-60 text-center">
              <div className="text-4xl font-bold">{timer}</div>
            </div>
            {/* <div className="text-center">
              <div className="text-4xl font-bold">{fillPercentage}%</div>
              <div className="text-xs uppercase">พื้นที่</div>
            </div> */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
