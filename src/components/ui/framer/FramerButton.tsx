// src\components\ui\framer\FramerButton.tsx

"use client";

import * as React from "react";
import { HTMLMotionProps, motion, MotionConfig, MotionProps } from "framer-motion";

// ยูทิลเล็ก ๆ สำหรับรวมคลาส (กัน falsy)
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

type Variant = "solid" | "outline" | "soft" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  withPressEffect?: boolean; // เปิด/ปิดเอฟเฟกต์กด (ดีฟอลต์: true)
  loading?: boolean; // แสดงสถานะกำลังทำงาน (จะ lock การกด)
  children: React.ReactNode;
}

/** Button (ไม่ผูกกับ shadcn) • กดแล้ว “ยุบ” ด้วย Framer Motion */
const FramerButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "md",
      fullWidth = false,
      withPressEffect = true,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const canAnimate = withPressEffect && !isDisabled;

    // ขนาด (สูง/ฟอนต์/ระยะขอบ)
    const sizeClass: Record<Size, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
      xl: "h-12 px-6 text-base",
    };

    // โทนปุ่ม (ใช้ธีม pink/orange ได้ตาม Tailwind ของคุณ)
    const variantClass: Record<Variant, string> = {
      solid: "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-lg",
      outline:
        "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-100",
      soft: "bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-300",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-white/10",
    };

    // เอฟเฟกต์กด: ยุบ + ขยับลงนิด ๆ (มี fallback active:translate-y-px)
    const pressProps: MotionProps = canAnimate
      ? {
          whileTap: { scale: 0.95 },
          transition: {
            type: "spring",
            stiffness: 200, // ความแข็งของสปริง (ยิ่งมากยิ่งตอบสนองเร็ว)
            damping: 20, // ตัวหน่วงการสั่น (ยิ่งมากยิ่งหยุดเร็ว ไม่เด้งเยอะ)
          },
        }
      : {};

    return (
      <MotionConfig reducedMotion="user">
        <motion.button
          ref={ref}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all outline-none",
            "focus-visible:ring-2 focus-visible:ring-pink-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "active:translate-y-px", // fallback ถ้า JS ยังไม่พร้อม
            sizeClass[size],
            variantClass[variant],
            fullWidth && "w-full",
            className,
          )}
          disabled={isDisabled}
          {...pressProps}
          {...props}
        >
          {loading && (
            <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          )}
          {children}
        </motion.button>
      </MotionConfig>
    );
  },
);

FramerButton.displayName = "Button";

export default FramerButton;
