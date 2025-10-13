// src/app/assess/components/(step1)/UserDeviceSelection.tsx
"use client";

import OptionCard from "./OptionCard";

export type Selection = "this_device" | "other_device";

// Define the props for the component
interface UserDeviceSelectionProps {
  selectedValue: Selection | null;
  onSelect: (selection: Selection) => void;
}

export default function UserDeviceSelection({ selectedValue, onSelect }: UserDeviceSelectionProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 pt-8 sm:flex-row sm:items-stretch">
      <OptionCard
        value="this_device"
        title="ที่กำลังใช้อยู่"
        imgSrc="/assets/holding-phone.gif"
        isSelected={selectedValue === "this_device"}
        onSelect={onSelect}
      />
      <OptionCard
        value="other_device"
        title="ประเมินเครื่องอื่น"
        imgSrc="/assets/other-phone.gif"
        isSelected={selectedValue === "other_device"}
        onSelect={onSelect}
      />
    </div>
  );
}
