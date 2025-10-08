// src/app/assess/components/(step3)/(services)/sell-now-components/DepositPayment.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Banknote, UploadCloud, File, X, CheckCircle, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import FramerButton from "../../../../../../components/ui/framer/FramerButton";

const DEPOSIT_AMOUNT = 300;

const BankInfo = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">{value}</span>
        <button onClick={handleCopy} className="text-slate-500 hover:text-slate-800">
          {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

const DepositPayment = () => {
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSlipFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSlipFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = () => {
    if (slipFile) {
      alert(`อัปโหลดสลิป "${slipFile.name}" เรียบร้อยแล้ว! ทีมงานจะติดต่อกลับเพื่อยืนยันนัดหมาย`);
      // ในการใช้งานจริง: เพิ่ม Logic การอัปโหลดไฟล์และเปลี่ยนหน้า
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">ชำระค่ามัดจำบริการ</h2>
        <p className="text-muted-foreground mt-1">
          เพื่อยืนยันการนัดหมาย กรุณาชำระค่ามัดจำจำนวน{" "}
          <span className="font-bold text-pink-600">{DEPOSIT_AMOUNT} บาท</span>
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-800">ข้อมูลการโอนเงิน</h3>
        <div className="space-y-2">
          <BankInfo label="ธนาคาร" value="กสิกรไทย" />
          <BankInfo label="เลขที่บัญชี" value="123-4-56789-0" />
          <BankInfo label="ชื่อบัญชี" value="บริษัท โอเค โมบาย จำกัด" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-slate-800">อัปโหลดสลิปการโอนเงิน</h3>
        <div
          className="hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="text-muted-foreground h-10 w-10" />
          <p className="text-muted-foreground mt-2 text-sm">
            <span className="text-primary font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
          </p>
          <p className="text-muted-foreground text-xs">PNG, JPG, HEIC ไม่เกิน 10MB</p>
          <Input id="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </div>
        {slipFile && (
          <div className="bg-primary/10 text-primary mt-3 flex items-center justify-between rounded-lg p-2 px-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>{slipFile.name}</span>
            </div>
            <button onClick={handleRemoveFile} className="text-primary/70 hover:text-primary">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <FramerButton size="lg" disabled={!slipFile} className="h-14 w-full" onClick={handleConfirmUpload}>
        ยืนยันการชำระเงิน
      </FramerButton>
    </motion.div>
  );
};

export default DepositPayment;
