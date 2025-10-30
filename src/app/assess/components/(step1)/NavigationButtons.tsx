// src/app/assess/components/(step1)/NavigationButtons.tsx

import { ArrowLeft } from "lucide-react";
import FramerButton from "../../../../components/ui/framer/FramerButton";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  isNextDisabled,
}: NavigationButtonsProps) {
  return (
    <div
      className={`flex w-full ${onBack ? "justify-between" : "justify-end"} mt-auto items-center pt-6`}
    >
      {onBack && (
        <FramerButton variant="outline" onClick={onBack} className="h-12">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-semibold">ย้อนกลับ</span>
        </FramerButton>
      )}
      <FramerButton
        onClick={onNext}
        disabled={isNextDisabled}
        size="lg"
        className="gradient-primary text-primary-foreground shadow-primary/30 hover:shadow-secondary/30 h-12 transform-gpu rounded-full px-8 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        ดำเนินการต่อ
      </FramerButton>
    </div>
  );
}
