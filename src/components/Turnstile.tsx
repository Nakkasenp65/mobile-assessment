"use client";

import { useEffect, useRef } from "react";

// Global interface declarations for Turnstile API
declare global {
  interface TurnstileAPI {
    render: (
      el: HTMLElement,
      options: {
        sitekey: string;
        theme?: "light" | "dark";
        callback?: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
      },
    ) => string | undefined;
    remove: (widgetId: string) => void;
  }

  interface Window {
    turnstile?: TurnstileAPI;
    turnstileOnLoadCallback?: () => void;
  }
}

interface TurnstileProps {
  onVerify: (token: string | null) => void;
  className?: string;
  theme?: "light" | "dark";
}

export default function Turnstile({ onVerify, className, theme = "light" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Directly access the environment variable.
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;

  useEffect(() => {
    // Ensure the sitekey is a string and not undefined.
    if (typeof siteKey !== "string") {
      console.error("Turnstile error: NEXT_PUBLIC_TURNSTILE_SITEKEY is not set or is not a string.");
      return;
    }

    const renderWidget = () => {
      if (containerRef.current && !widgetIdRef.current) {
        const widgetId = window.turnstile?.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => onVerify(token),
          "error-callback": () => onVerify(null),
          "expired-callback": () => onVerify(null),
        });
        widgetIdRef.current = widgetId || null;
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.turnstileOnLoadCallback = renderWidget;
      if (!document.querySelector('script[src^="https://challenges.cloudflare.com"]')) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=turnstileOnLoadCallback";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, theme]);

  return <div ref={containerRef} className={className ?? "cf-turnstile"} />;
}
