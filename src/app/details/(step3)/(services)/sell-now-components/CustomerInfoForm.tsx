// src/app/assess/components/(step3)/(services)/sell-now-components/CustomerInfoForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Pencil } from "lucide-react";
import { motion, Variants } from "framer-motion";
import Swal from "sweetalert2";

interface CustomerInfoFormProps {
  formState: {
    customerName: string;
    phone: string;
  };
  handleInputChange: (field: string, value: string) => void;
  formVariants: Variants;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formState, handleInputChange, formVariants }) => {
  const handleEditPhoneClick = async () => {
    const result = await Swal.fire({
      title: "แก้ไขเบอร์โทรศัพท์",
      text: "กรุณากรอกเบอร์ 10 หลัก เช่น 0987654321",
      input: "tel",
      inputValue: formState.phone,
      inputAttributes: {
        maxlength: "10",
        inputmode: "numeric",
        pattern: "[0-9]*",
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      preConfirm: (value) => {
        const sanitized = (value || "").replace(/[^0-9]/g, "");
        if (!/^\d{10}$/.test(sanitized)) {
          Swal.showValidationMessage("กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 10 หลัก");
          return;
        }
        return sanitized;
      },
    });
    if (result.value) {
      handleInputChange("phone", result.value);
    }
  };
  return (
    <motion.div variants={formVariants} className="border-border flex flex-col gap-4 border-b pb-8">
      <Label className="block text-lg font-semibold">กรอกข้อมูลเพื่อดำเนินการ</Label>
      <div className="space-y-2">
        <Label htmlFor="customerName-sell">ชื่อ-นามสกุล</Label>
        <div className="relative">
          <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            id="customerName-sell"
            placeholder="กรอกชื่อ-นามสกุล"
            value={formState.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            className="h-12 pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-sell">เบอร์โทรศัพท์ติดต่อ</Label>
        <div className="relative">
          <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            id="phone-sell"
            type="tel"
            placeholder="0xx-xxx-xxxx"
            value={formState.phone}
            readOnly
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            className="h-12 pl-10 pr-12"
          />
          <button
            type="button"
            onClick={handleEditPhoneClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border bg-white p-2 text-slate-600 hover:bg-slate-50"
            aria-label="แก้ไขเบอร์โทรศัพท์"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerInfoForm;
