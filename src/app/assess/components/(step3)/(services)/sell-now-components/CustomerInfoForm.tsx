// src/app/assess/components/(step3)/(services)/sell-now-components/CustomerInfoForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface CustomerInfoFormProps {
  formState: {
    customerName: string;
    phone: string;
  };
  handleInputChange: (field: string, value: string) => void;
  formVariants: any;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ formState, handleInputChange, formVariants }) => {
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
            onChange={(e) => handleInputChange("phone", e.target.value)}
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            className="h-12 pl-10"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerInfoForm;
