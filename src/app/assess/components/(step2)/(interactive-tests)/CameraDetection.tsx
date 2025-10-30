// src/app/assess/components/(step2)/(interactive-tests)/CameraDetection.tsx

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Check, XCircle, Timer, AlertTriangle } from "lucide-react";
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
  onConclude: (result: "camera_ok" | "camera_defective") => void;
}

type TestPhase =
  | "idle"
  | "prompt_permission"
  | "testing_front"
  | "testing_back"
  | "front_success"
  | "back_success"
  | "timeout"
  | "error";

export default function CameraDetection({ isOpen, onConclude }: CameraDetectionProps) {
  const [phase, setPhase] = useState<TestPhase>("prompt_permission");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  // Deprecated: old success overlay state removed in favor of live mesh + confirm button
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isConcludedRef = useRef(false);
  // MediaPipe Face Detection types (union to avoid `any`)
  type LandmarkPoint = { x: number; y: number };
  type BoundingBoxOrigin = { originX: number; originY: number; width: number; height: number };
  type BoundingBoxXYMin = { xmin: number; ymin: number; width: number; height: number };
  type BoundingBoxCenter = { xCenter: number; yCenter: number; width: number; height: number };
  type LocationData = {
    relativeBoundingBox?: BoundingBoxCenter | BoundingBoxXYMin;
    relativeKeypoints?: LandmarkPoint[];
  };
  type Detection = {
    boundingBox?: BoundingBoxOrigin | BoundingBoxCenter | BoundingBoxXYMin;
    relativeBoundingBox?: BoundingBoxCenter | BoundingBoxXYMin;
    keypoints?: LandmarkPoint[];
    landmarks?: LandmarkPoint[];
    locationData?: LocationData;
    location?: LocationData;
  };
  type MPFaceDetectionResults = { detections?: Detection[] };
  type MPFaceDetection = {
    setOptions: (opts: {
      model?: "short" | "full";
      selfieMode?: boolean;
      minDetectionConfidence?: number;
    }) => void;
    onResults: (cb: (results: MPFaceDetectionResults) => void) => void;
    send: (input: { image: HTMLVideoElement }) => Promise<void>;
  };
  const detectorRef = useRef<MPFaceDetection | null>(null);
  const detectionRAFRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const [initValid, setInitValid] = useState(false);
  const [frameValid, setFrameValid] = useState(false);
  const [detectValid, setDetectValid] = useState(false);
  const resultsRef = useRef<MPFaceDetectionResults | null>(null);
  // Animation performance guard and fallback
  const [useSpringAnimations, setUseSpringAnimations] = useState(true);
  const [popupReady, setPopupReady] = useState(false);

  const handleConclude = useCallback(
    (result: "camera_ok" | "camera_defective") => {
      if (isConcludedRef.current) return;
      isConcludedRef.current = true;
      onConclude(result);
    },
    [onConclude],
  );

  const cleanupStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const cleanupDetectionLoop = () => {
    if (detectionRAFRef.current) {
      cancelAnimationFrame(detectionRAFRef.current);
      detectionRAFRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const ensureDetector = async () => {
    if (detectorRef.current) return detectorRef.current;
    setIsLoadingModel(true);
    try {
      const faceDetectionNs = await import("@mediapipe/face_detection");
      type FaceDetectionNamespace = {
        FaceDetection: new (config: { locateFile: (file: string) => string }) => MPFaceDetection;
      };
      const FaceDetectionCtor = (faceDetectionNs as unknown as FaceDetectionNamespace)
        .FaceDetection;
      const detector = new FaceDetectionCtor({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });
      // Use JS-specific options: model (short/full) and minDetectionConfidence
      detector.setOptions({ model: "short", minDetectionConfidence: 0.6 });
      detector.onResults((res) => {
        resultsRef.current = res;
      });
      detectorRef.current = detector;
      return detectorRef.current;
    } catch (err) {
      console.error("Failed to create face detector", err);
      setPermissionError("System error: Unable to initialize face detection");
      setPhase("error");
      return null;
    } finally {
      setIsLoadingModel(false);
    }
  };

  const startTest = async () => {
    setPhase("prompt_permission");
    setPermissionError(null);
    setFeedbackMessage("Camera access is required for this test");
    cleanupStream();
    cleanupDetectionLoop();

    // We explicitly prompt the user to grant camera access
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(newStream);
      setInitValid(true);
      setPhase("testing_front");
      setFeedbackMessage("กำลังตรวจจับใบหน้าด้วยกล้องหน้า");
    } catch (err: unknown) {
      console.error("Camera access denied:", err);
      const fallbackMsg =
        "Camera access is required for this test. Test will be skipped and marked as failed without permissions.";
      const msg = err instanceof Error ? err.message || fallbackMsg : fallbackMsg;
      setPermissionError(msg);
      setPhase("error");
    }
  };

  const switchToBackCamera = async () => {
    setPhase("testing_back");
    setFeedbackMessage("โปรดจัดตำแหน่งใบหน้าสำหรับการตรวจจับด้วยกล้องหลัง");
    cleanupStream();
    cleanupDetectionLoop();

    try {
      // Try exact environment first
      let newStream: MediaStream | null = null;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback to non-exact environment
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        } catch {
          // Enumerate devices and pick a likely back camera
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          const backCam =
            videoInputs.find((d) => /back|rear|environment/i.test(d.label)) ||
            videoInputs[videoInputs.length - 1];
          if (backCam) {
            newStream = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: { exact: backCam.deviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            });
          }
        }
      }
      if (!newStream) throw new Error("No suitable back camera found");
      setStream(newStream);
      setInitValid(true);
    } catch (err: unknown) {
      console.error("Back camera failed to start:", err);
      setPermissionError("System error: Unable to access back camera");
      setPhase("error");
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      video.srcObject = stream;
      const handleLoaded = () => {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (vw > 0 && vh > 0) {
          setFrameValid(true);
          // Size canvas to match video dimensions for pixel-accurate overlay
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = vw;
            canvas.height = vh;
          }
        }
      };
      video.addEventListener("loadedmetadata", handleLoaded, { once: true });
      video.play().catch(() => {});
    }
  }, [stream]);

  // Measure animation frame budget when success popups are visible
  useEffect(() => {
    if (phase === "front_success" || phase === "back_success") {
      setPopupReady(false);
      const startReady = window.setTimeout(() => setPopupReady(true), 10);
      let frames = 0;
      let sumDelta = 0;
      let last = performance.now();
      let rafId = 0;
      const tick = (now: number) => {
        const delta = now - last;
        last = now;
        if (frames > 0) sumDelta += delta; // ignore first frame
        frames++;
        if (frames < 60) {
          rafId = requestAnimationFrame(tick);
        } else {
          const avg = sumDelta / Math.max(frames - 1, 1);
          // If average frame time is notably above 16.7ms (~60fps), disable spring
          if (avg > 18) setUseSpringAnimations(false);
        }
      };
      rafId = requestAnimationFrame(tick);
      return () => {
        window.clearTimeout(startReady);
        cancelAnimationFrame(rafId);
      };
    } else {
      setPopupReady(false);
    }
  }, [phase]);

  // Begin detection loop with 30s timeout for each phase
  useEffect(() => {
    const beginDetection = async () => {
      const detector = await ensureDetector();
      if (!detector || !videoRef.current) return;

      // Set up countdown and timeout
      setCountdown(30);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        cleanupDetectionLoop();
        setPhase("timeout");
        setFeedbackMessage("Timeout: Unable to detect your face in time");
      }, 30000);

      const detectFrame = async () => {
        const video = videoRef.current;
        if (!video) return;
        try {
          // Ensure frame is available to avoid texImage2D/no video errors
          if (video.readyState < 2) {
            detectionRAFRef.current = requestAnimationFrame(detectFrame);
            return;
          }
          // Align internal detector orientation for front camera preview
          try {
            detector.setOptions({ selfieMode: phase === "testing_front" });
          } catch {}
          await detector.send({ image: video });
          const res = resultsRef.current;
          const dets: Detection[] = Array.isArray(res?.detections) ? res!.detections! : [];
          const hasFace = dets.length > 0;
          setDetectValid(hasFace);
          // Remove all visual indicators per requirements; keep canvas clear
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
          // Trigger success phases based on active mode while preserving logic
          if (hasFace) {
            if (phase === "testing_front") {
              setPhase("front_success");
            } else if (phase === "testing_back") {
              setPhase("back_success");
              // Auto-close after brief success popup
              setTimeout(() => {
                handleConclude("camera_ok");
              }, 3000);
            }
          }
        } catch (e) {
          console.warn("Detection error", e);
        }
        // Keep scanning and rendering until user confirms
        detectionRAFRef.current = requestAnimationFrame(detectFrame);
      };

      detectionRAFRef.current = requestAnimationFrame(detectFrame);
    };

    if (phase === "testing_front" || phase === "testing_back") {
      beginDetection();
    }

    return () => {
      cleanupDetectionLoop();
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      cleanupDetectionLoop();
      cleanupStream();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      isConcludedRef.current = false;
      setPhase("prompt_permission");
      setInitValid(false);
      setFrameValid(false);
      setDetectValid(false);
    }
    if (!isOpen) {
      cleanupDetectionLoop();
      cleanupStream();
      setTimeout(() => {
        setPhase("prompt_permission");
        setPermissionError(null);
        setFeedbackMessage("");
        // reset old overlay state (no longer used)
        setCountdown(30);
        setInitValid(false);
        setFrameValid(false);
        setDetectValid(false);
      }, 300);
    }
  }, [isOpen]);

  const renderContent = () => {
    // Use a shared boolean to decide horizontal flip for preview
    // Avoids comparing phase literals inside narrowed branches
    const shouldFlip = phase === "testing_front" || phase === "front_success";
    if (phase === "timeout") {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-red-600" />
          <p className="text-lg font-semibold text-black">หมดเวลาการตรวจจับ</p>
          <p className="text-muted-foreground mt-2 text-sm">
            ไม่สามารถตรวจจับใบหน้าได้ภายใน 30 วินาที
          </p>
          <FramerButton
            size="lg"
            className="bg-primary mt-6 h-14 w-full text-white"
            onClick={() => handleConclude("camera_defective")}
          >
            ดำเนินการต่อ
          </FramerButton>
        </div>
      );
    }
    if (phase === "error") {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <XCircle className="mb-4 h-12 w-12 text-red-600" />
          <p className="text-lg font-semibold text-black">เกิดข้อผิดพลาดในการเข้าถึงกล้อง</p>
          <p className="text-muted-foreground mt-2 text-sm">{permissionError}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            โปรดตรวจสอบการอนุญาตของบราวเซอร์และการตั้งค่า
          </p>
          <FramerButton
            size="lg"
            className="bg-primary mt-6 h-14 w-full text-white"
            onClick={() => handleConclude("camera_defective")}
          >
            ดำเนินการต่อ
          </FramerButton>
        </div>
      );
    }

    if (phase === "prompt_permission") {
      return (
        <div className="flex h-64 w-full flex-col items-center justify-center text-center">
          <Camera className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">{feedbackMessage}</p>
          <FramerButton size="lg" className="mt-4 h-12 px-6" onClick={startTest}>
            อนุญาตการเข้าถึงกล้อง
          </FramerButton>
        </div>
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
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-center font-semibold text-white">
              {phase === "testing_front"
                ? "🎯 กำลังตรวจจับใบหน้าด้วยกล้องหน้า"
                : "📸 โปรดจัดตำแหน่งใบหน้าสำหรับการตรวจจับด้วยกล้องหลัง"}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-white/90">
              <Timer className="h-4 w-4" />
              <span className="text-sm">เหลือ {countdown} วินาที</span>
            </div>
          </div>
          <div className="absolute top-2 left-2 rounded-md bg-black/50 p-2 text-xs text-white">
            <div>เริ่มต้น: {initValid ? "✅" : "…"}</div>
            <div>เฟรม: {frameValid ? "✅" : "…"}</div>
            <div>การตรวจจับ: {detectValid ? "✅" : "…"}</div>
          </div>
          {/* Confirmation button with dynamic state */}
          {phase === "testing_front" ? (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
              <FramerButton
                onClick={switchToBackCamera}
                disabled={!detectValid}
                className={
                  detectValid
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                }
              >
                🎉 ไปยังกล้องหลังต่อไป!
              </FramerButton>
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
              <FramerButton
                onClick={() => handleConclude("camera_ok")}
                disabled={!detectValid}
                className={
                  detectValid
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                }
              >
                ✨ ยืนยันกล้องหลังสำเร็จ!
              </FramerButton>
            </div>
          )}
        </div>
      );
    }

    if (phase === "front_success") {
      return (
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-center font-semibold text-white">🎯 ตรวจจับสำเร็จ!</p>
          </div>
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            {useSpringAnimations ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-black shadow-xl"
              >
                <Check className="h-12 w-12 rounded-full bg-emerald-100 p-2 text-emerald-600 shadow-inner" />
                <p className="text-lg font-semibold text-emerald-800">ยอดเยี่ยม! 🎉</p>
                <p className="text-center text-sm text-emerald-600">กล้องหน้าทำงานได้สมบูรณ์แบบ</p>
                <FramerButton
                  onClick={switchToBackCamera}
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700"
                >
                  📸 ไปทดสอบกล้องหลังกันต่อ!
                </FramerButton>
              </motion.div>
            ) : (
              <div
                className={`flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-black shadow-xl transition-all duration-200 ease-out ${
                  popupReady ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                <Check className="h-12 w-12 rounded-full bg-emerald-100 p-2 text-emerald-600 shadow-inner" />
                <p className="text-lg font-semibold text-emerald-800">ยอดเยี่ยม! 🎉</p>
                <p className="text-center text-sm text-emerald-600">กล้องหน้าทำงานได้สมบูรณ์แบบ</p>
                <FramerButton
                  onClick={switchToBackCamera}
                  className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700"
                >
                  📸 ไปทดสอบกล้องหลังกันต่อ!
                </FramerButton>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (phase === "back_success") {
      return (
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ transform: shouldFlip ? "rotateY(180deg)" : "none" }}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4">
            <p className="text-center font-semibold text-white">✨ ตรวจจับสำเร็จ!</p>
          </div>
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            {useSpringAnimations ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-black shadow-xl"
              >
                <Check className="h-12 w-12 rounded-full bg-blue-100 p-2 text-blue-600 shadow-inner" />
                <p className="text-lg font-semibold text-blue-800">สำเร็จแล้ว! 🎊</p>
                <p className="text-center text-sm text-blue-600">กล้องหลังก็ทำงานได้ดีเยี่ยม</p>
                <FramerButton
                  onClick={() => handleConclude("camera_ok")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700"
                >
                  🚀 ดำเนินการต่อ!
                </FramerButton>
              </motion.div>
            ) : (
              <div
                className={`flex flex-col items-center gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8 text-black shadow-xl transition-all duration-200 ease-out ${
                  popupReady ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
              >
                <Check className="h-12 w-12 rounded-full bg-blue-100 p-2 text-blue-600 shadow-inner" />
                <p className="text-lg font-semibold text-blue-800">สำเร็จแล้ว! 🎊</p>
                <p className="text-center text-sm text-blue-600">กล้องหลังก็ทำงานได้ดีเยี่ยม</p>
                <FramerButton
                  onClick={() => handleConclude("camera_ok")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700"
                >
                  🚀 ดำเนินการต่อ!
                </FramerButton>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-64 w-full flex-col items-center justify-center text-center">
        <Camera className="text-muted-foreground mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          จำเป็นต้องอนุญาตการเข้าถึงกล้องสำหรับการทดสอบนี้
        </p>
        <FramerButton
          size="lg"
          className="mt-4 h-12 bg-gradient-to-r from-purple-500 to-pink-600 px-6 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl"
          onClick={startTest}
        >
          📷 อนุญาตการเข้าถึงกล้อง
        </FramerButton>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleConclude("camera_defective")}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>ขั้นตอนที่ 3: ทดสอบกล้อง</DialogTitle>
          <DialogDescription>
            อนุญาตการเข้าถึงกล้องเพื่อตรวจสอบการมีใบหน้า
            ทางเราจะไม่บันทึกหรือส่งข้อมูลใดๆเกี่ยวกับใบหน้าของคุณไปยังเซิร์ฟเวอร์
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingModel && (
            <p className="text-muted-foreground mb-2 text-center text-sm">
              กำลังโหลดโมเดลตรวจจับใบหน้า...
            </p>
          )}
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
