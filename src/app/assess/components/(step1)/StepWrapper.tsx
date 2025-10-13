// src/app/assess/components/(step1)/StepWrapper.tsx

import { motion } from "framer-motion";
import React from "react";

interface StepWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  direction: number;
}

export default function StepWrapper({ children, title, description, direction }: StepWrapperProps) {
  return (
    <motion.div
      key={title}
      custom={direction}
      initial={{ opacity: 0, x: 30 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 * direction }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex h-full w-full flex-1 flex-col gap-4"
    >
      <div className="text-center">
        <h2 className="text-foreground text-2xl font-bold md:text-3xl">{title}</h2>
        <p className="text-muted-foreground text-sm md:text-base">{description}</p>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </motion.div>
  );
}
