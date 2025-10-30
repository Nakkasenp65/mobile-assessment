// src/app/assess/components/(step3)/(services)/sell-now-components/Confirmation.tsx

"use client";

import FramerButton from "@/components/ui/framer/FramerButton";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PDPA from "../../../../../components/ui/pdpa";

interface ConfirmationProps {
  isFormComplete: boolean;
  handleConfirmSell: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  handleShowConsent: () => void;
}

export default function Confirmation({
  isFormComplete,
  handleConfirmSell,
  disabled = false,
  isLoading = false,
  handleShowConsent,
}: ConfirmationProps) {
  const router = useRouter();
  void router;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
      className="space-y-4 pt-4"
    >
      <FramerButton
        size="lg"
        disabled={!isFormComplete || disabled || isLoading}
        className="h-14 w-full"
        onClick={handleConfirmSell}
      >
        ยืนยันการขาย
      </FramerButton>
      <PDPA handleShowConsent={handleShowConsent} serviceName="sellnow" />
    </motion.div>
  );
}
