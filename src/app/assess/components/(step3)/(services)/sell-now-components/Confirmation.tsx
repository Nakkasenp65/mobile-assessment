// src/app/assess/components/(step3)/(services)/sell-now-components/Confirmation.tsx

"use client";

import FramerButton from "@/components/ui/framer/FramerButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ConfirmationProps {
  isFormComplete: boolean;
  handleConfirmSell: () => void;
}

export default function Confirmation({ isFormComplete, handleConfirmSell }: ConfirmationProps) {
  const router = useRouter();

  const handleClick = () => {
    handleConfirmSell();
    router.push("/confirmed/1");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
      className="space-y-4 pt-4"
    >
      <FramerButton size="lg" disabled={!isFormComplete} className="h-14 w-full" onClick={handleClick}>
        ยืนยันการขาย
      </FramerButton>
      <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
        การคลิก &quot;ยืนยันการขาย&quot; ถือว่าท่านได้รับรองว่าข้อมูลที่ให้ไว้เป็นความจริงทุกประการ และยอมรับใน{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-600 underline hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
        >
          ข้อตกลงและเงื่อนไขการใช้บริการ
        </a>
      </p>
    </motion.div>
  );
}
