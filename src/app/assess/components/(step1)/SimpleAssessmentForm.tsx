// src/app/assess/components/(step1)/SimpleAssessmentForm.tsx
"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UploadCloud, File, X, AlertCircle, RefreshCw } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { PHONE_DATA } from "@/util/phone";
import type { DeviceInfo, ConditionInfo } from "@/types/device";

interface SimpleAssessmentFormProps {
  deviceInfo: DeviceInfo;
  onDeviceUpdate: (next: DeviceInfo) => void;
  conditionInfo: ConditionInfo;
  onConditionUpdate: (updater: (prev: ConditionInfo) => ConditionInfo) => void;
  onValidityChange?: (isValid: boolean) => void;
  onDataChange?: (data: { imageFile: File; description: string }) => void;
}

export default function SimpleAssessmentForm({
  deviceInfo,
  onDeviceUpdate,
  conditionInfo,
  onConditionUpdate,
  onValidityChange,
  onDataChange,
}: SimpleAssessmentFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isThumbLoading, setIsThumbLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const MAX_DETAILS_LEN = 500;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const THUMBNAIL_MAX_DIM = 400; // max width/height for preview

  // Warranty options (matching DesktopReportForm)
  const warrantyOptions = useMemo(
    () => [
      { id: "warranty_active_long", label: "เหลือมากกว่า 6 เดือน" },
      { id: "warranty_active_short", label: "เหลือน้อยกว่า 6 เดือน" },
      { id: "warranty_inactive", label: "หมดประกันแล้ว" },
    ],
    [],
  );

  // Model options for selected Apple product type
  const modelOptions = useMemo(() => {
    const key = deviceInfo.productType || "";
    return PHONE_DATA.models[key] || [];
  }, [deviceInfo.productType]);

  const recalcValidity = (
    nextFile: File | null,
    nextDetails: string,
    nextDevice: DeviceInfo,
    nextCondition: ConditionInfo,
  ) => {
    const isValid =
      !!nextFile &&
      nextDetails.trim().length > 0 &&
      !!nextDevice.model &&
      !!nextCondition.warranty &&
      !!nextCondition.openedOrRepaired;
    onValidityChange?.(isValid);
    if (isValid && nextFile) {
      onDataChange?.({ imageFile: nextFile, description: nextDetails.trim() });
    }
  };

  const generateThumbnail = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(THUMBNAIL_MAX_DIM / width, THUMBNAIL_MAX_DIM / height, 1);
        const targetW = Math.max(Math.floor(width * scale), 1);
        const targetH = Math.max(Math.floor(height * scale), 1);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Cannot get canvas context"));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetW, targetH);
        // Prefer WebP, fallback to JPEG for broader support
        let dataUrl = canvas.toDataURL("image/webp", 0.8);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        }
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      img.src = url;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const f = event.target.files[0];

      // Reset previous state
      setFileError(null);
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }

      // Validate file size
      if (f.size > MAX_FILE_SIZE) {
        setFile(null);
        setPreviewUrl(null);
        setFileError("ไฟล์มีขนาดใหญ่เกินกำหนด (สูงสุด 10MB)");
        onValidityChange?.(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setFile(f);
      // Generate optimized thumbnail for image types
      if (f.type?.startsWith("image/")) {
        setIsThumbLoading(true);
        try {
          const thumb = await generateThumbnail(f);
          setPreviewUrl(thumb);
        } catch {
          // Fallback to object URL if thumbnail generation fails
          const url = URL.createObjectURL(f);
          previewObjectUrlRef.current = url;
          setPreviewUrl(url);
        } finally {
          setIsThumbLoading(false);
        }
      } else {
        // Non-image: no preview
        setPreviewUrl(null);
      }

      recalcValidity(f, details, deviceInfo, conditionInfo);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation(); // Prevent triggering the file input click
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setFileError(null);
    onValidityChange?.(false);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // enforce max length
    const clipped = value.length > MAX_DETAILS_LEN ? value.slice(0, MAX_DETAILS_LEN) : value;
    setDetails(clipped);
    recalcValidity(file, clipped, deviceInfo, conditionInfo);
  };

  const handleModelSelect = (model: string) => {
    const next = { ...deviceInfo, model };
    onDeviceUpdate(next);
    recalcValidity(file, details, next, conditionInfo);
  };

  const handleWarrantyChange = (val: string) => {
    const next = { ...conditionInfo, warranty: val as ConditionInfo["warranty"] } as ConditionInfo;
    onConditionUpdate(() => next);
    recalcValidity(file, details, deviceInfo, next);
  };

  const handleRepairedToggle = (val: "repaired_yes" | "repaired_no") => {
    const next = { ...conditionInfo, openedOrRepaired: val } as ConditionInfo;
    onConditionUpdate(() => next);
    recalcValidity(file, details, deviceInfo, next);
  };

  useEffect(() => {
    // Recalculate if external state changes (defensive)
    recalcValidity(file, details, deviceInfo, conditionInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceInfo.model, conditionInfo.warranty, conditionInfo.openedOrRepaired]);

  return (
    <motion.div
      className="space-y-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Model selection */}
      <div>
        <Label htmlFor="model-select" className="text-foreground mb-2 block font-semibold">
          รุ่น (จำเป็น)
        </Label>
        <Select onValueChange={handleModelSelect} value={deviceInfo.model}>
          <SelectTrigger id="model-select" aria-label="เลือกโมเดล Apple" className="w-full bg-white">
            <SelectValue placeholder="เลือกรุ่นอุปกรณ์" />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.length === 0 ? (
              <div className="text-muted-foreground p-2 text-sm">ไม่มีรายการรุ่นสำหรับหมวดหมู่นี้</div>
            ) : (
              modelOptions.map((m) => (
                <SelectItem key={m} value={m} className="text-sm">
                  {m}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Warranty radio buttons */}
      <div>
        <Label className="text-foreground mb-2 block font-semibold">ประกัน (จำเป็น)</Label>
        <RadioGroup
          value={conditionInfo.warranty}
          onValueChange={handleWarrantyChange}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {warrantyOptions.map((opt) => {
            const selected = conditionInfo.warranty === opt.id;
            return (
              <motion.label
                key={opt.id}
                className={cn(
                  "flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium",
                  selected
                    ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
                    : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
                )}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RadioGroupItem value={opt.id} className="sr-only" />
                <span className="font-semibold">{opt.label}</span>
              </motion.label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Overall device condition */}
      <div>
        <Label htmlFor="details" className="text-foreground mb-2 block font-semibold">
          สภาพเครื่องโดยรวม (จำเป็น)
        </Label>
        <Textarea
          id="details"
          placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์ของคุณ เช่น ตำหนิ, อุปกรณ์เสริม, หรือข้อมูลอื่นๆ ที่ต้องการแจ้งให้เราทราบ"
          className="min-h-[100px] bg-white"
          value={details}
          onChange={handleDetailsChange}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {details.length}/{MAX_DETAILS_LEN} ตัวอักษร
          </p>
        </div>
      </div>

      {/* Previously opened/repaired toggle */}
      <div>
        <Label className="text-foreground mb-2 block font-semibold">เคยแกะหรือซ่อมมา (จำเป็น)</Label>
        <RadioGroup
          value={conditionInfo.openedOrRepaired}
          onValueChange={(v) => handleRepairedToggle(v as "repaired_yes" | "repaired_no")}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { id: "repaired_yes", label: "ใช่" },
            { id: "repaired_no", label: "ไม่ใช่" },
          ].map((opt) => {
            const selected = conditionInfo.openedOrRepaired === opt.id;
            return (
              <motion.label
                key={opt.id}
                className={cn(
                  "flex h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center text-sm font-medium",
                  selected
                    ? "bg-primary text-primary-foreground shadow-primary/30 border-transparent shadow-lg"
                    : "bg-card text-card-foreground hover:bg-accent hover:border-primary/50",
                )}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RadioGroupItem value={opt.id} className="sr-only" />
                <span className="font-semibold">{opt.label}</span>
              </motion.label>
            );
          })}
        </RadioGroup>
      </div>

      {/* === MODIFIED IMAGE UPLOAD SECTION START === */}
      <div>
        <Label htmlFor="file-upload" className="text-foreground mb-2 block font-semibold">
          แนบรูปภาพอุปกรณ์ (จำเป็น)
        </Label>
        <div className="mt-2">
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <AnimatePresence mode="wait">
            {file && previewUrl && !isThumbLoading ? (
              // State 1: Preview is ready
              <motion.div
                key="preview"
                className="group relative w-full cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={previewUrl}
                  alt="ตัวอย่างรูปภาพอุปกรณ์"
                  className="h-auto max-h-[300px] w-full rounded-lg border border-gray-300 object-contain py-2 lg:max-h-[200px]"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col items-center text-white">
                    <RefreshCw className="h-8 w-8" />
                    <p className="mt-1 font-semibold">เปลี่ยนรูปภาพ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 z-10 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-red-500 hover:text-white"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ) : isThumbLoading ? (
              // State 2: Thumbnail is generating
              <motion.div
                key="loading"
                className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-muted-foreground text-sm">กำลังสร้างภาพตัวอย่าง…</p>
              </motion.div>
            ) : (
              // State 3: Initial upload prompt
              <motion.div
                key="upload-prompt"
                className="hover:border-primary/50 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <UploadCloud className="text-muted-foreground h-10 w-10" />
                <p className="text-muted-foreground mt-2 text-sm">
                  <span className="text-primary font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                </p>
                <p className="text-muted-foreground text-xs">PNG, JPG, HEIC, WEBP สูงสุด 10MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {fileError && (
          <div
            role="alert"
            aria-live="polite"
            className="bg-destructive/10 text-destructive mt-3 flex items-center gap-2 rounded-lg p-2 px-3 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{fileError}</span>
          </div>
        )}

        {file && (
          <div className="bg-primary/10 text-primary mt-3 flex items-center justify-between rounded-lg p-2 px-3 text-sm font-medium">
            <div className="flex items-center gap-2 truncate">
              <File className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-primary/70 hover:text-primary ml-2 flex-shrink-0"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {/* === MODIFIED IMAGE UPLOAD SECTION END === */}
    </motion.div>
  );
}
