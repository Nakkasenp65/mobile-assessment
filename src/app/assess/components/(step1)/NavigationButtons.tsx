// src/app/assess/components/(step1)/NavigationButtons.tsx

import { ArrowLeft } from "lucide-react";
import FramerButton from "../../../../components/ui/framer/FramerButton";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export default function NavigationButtons({ onBack, onNext, isNextDisabled }: NavigationButtonsProps) {
  return (
    <div className={`flex w-full ${onBack ? "justify-between" : "justify-end"} mt-auto items-center pt-6`}>
      {onBack && (
        <FramerButton variant="ghost" onClick={onBack} className="flex h-12 items-center rounded-full px-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-semibold">ย้อนกลับ</span>
        </FramerButton>
      )}
      <FramerButton
        onClick={onNext}
        disabled={isNextDisabled}
        size="lg"
        className="h-14 transform-gpu rounded-xl px-8 text-base font-semibold shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:transform-none"
      >
        ถัดไป
      </FramerButton>
    </div>
  );
}
