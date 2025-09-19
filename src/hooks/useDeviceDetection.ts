"use client";

import { useState, useEffect } from "react";

export interface DeviceInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isMobile: boolean; //ครอบคลุมทั้ง Android, iOS, iPadOS
  isDesktop: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isAndroid: false,
    isIOS: false,
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;
    const isDesktop = !isMobile;

    setDeviceInfo({ isAndroid, isIOS, isMobile, isDesktop });
  }, []);

  return deviceInfo;
};
