// src/app/details/(step3)/ServiceBenefits.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface ServiceBenefitsProps {
  benefits: string[];
  theme: {
    solidBg: string;
  };
}

export default function ServiceBenefits({ benefits, theme }: ServiceBenefitsProps) {
  return (
    <ul className="text-muted-foreground space-y-2 text-sm">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <div
            className={cn("mt-1.5 h-2 w-2 flex-shrink-0 rounded-full opacity-50", theme.solidBg)}
          />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
