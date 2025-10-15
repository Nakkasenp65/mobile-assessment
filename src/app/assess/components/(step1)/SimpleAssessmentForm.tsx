// src/app/assess/components/(step1)/SimpleAssessmentForm.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UploadCloud, File, X } from "lucide-react";

interface SimpleAssessmentFormProps {
  onValidityChange?: (isValid: boolean) => void;
  onDataChange?: (data: { imageFile: File; description: string }) => void;
}

const SimpleAssessmentForm = ({ onValidityChange, onDataChange }: SimpleAssessmentFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const f = event.target.files[0];
      setFile(f);
      const isValid = !!f && details.trim().length > 0;
      onValidityChange?.(isValid);
      if (isValid) {
        onDataChange?.({ imageFile: f, description: details.trim() });
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    const isValid = false;
    onValidityChange?.(isValid);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDetails(value);
    const isValid = !!file && value.trim().length > 0;
    onValidityChange?.(isValid);
    if (isValid && file) {
      onDataChange?.({ imageFile: file, description: value.trim() });
    }
  };

  return (
    <motion.div
      className="space-y-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div>
        <Label htmlFor="file-upload" className="text-foreground mb-2 block font-semibold">
          แนบรูปภาพอุปกรณ์ (จำเป็น)
        </Label>
        <div
          className="hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">
            <span className="text-primary font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
          </p>
          <p className="text-muted-foreground text-xs">PNG, JPG, GIF up to 10MB</p>
          <Input id="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </div>
        {file && (
          <div className="bg-primary/10 text-primary mt-3 flex items-center justify-between rounded-lg p-2 px-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
            <button onClick={handleRemoveFile} className="text-primary/70 hover:text-primary">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {!file && (
          <p className="mt-2 text-xs font-medium text-red-600">จำเป็นต้องอัปโหลดรูปภาพอุปกรณ์</p>
        )}
      </div>

      <div>
        <Label htmlFor="details" className="text-foreground mb-2 block font-semibold">
          รายละเอียดเพิ่มเติม (จำเป็น)
        </Label>
        <Textarea
          id="details"
          placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์ของคุณ เช่น ตำหนิ, อุปกรณ์เสริม, หรือข้อมูลอื่นๆ ที่ต้องการแจ้งให้เราทราบ"
          className="min-h-[100px]"
          value={details}
          onChange={handleDetailsChange}
        />
        {details.trim().length === 0 && (
          <p className="mt-2 text-xs font-medium text-red-600">กรุณาระบุรายละเอียดของอุปกรณ์</p>
        )}
      </div>
    </motion.div>
  );
};

export default SimpleAssessmentForm;
