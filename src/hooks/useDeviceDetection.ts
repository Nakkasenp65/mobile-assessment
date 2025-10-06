"use client";

import { useState, useEffect } from "react";

export interface PlatformInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}

export const useDeviceDetection = (): PlatformInfo => {
  const [deviceInfo, setDeviceInfo] = useState<PlatformInfo>({
    isAndroid: false,
    isIOS: false,
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window && "MSStream" in window);
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    const isDesktop = !isMobile;

    setDeviceInfo({ isAndroid, isIOS, isMobile, isDesktop });
  }, []);

  return deviceInfo;
};
