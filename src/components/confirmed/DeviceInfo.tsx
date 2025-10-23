"use client";

import React from "react";
import Image from "next/image";

interface DeviceInfoProps {
  product: {
    imageUrl?: string;
    name?: string;
    variant?: string;
  } | null;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ product }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={product?.imageUrl ?? "/placeholder.png"}
          alt={product?.name ?? "Device"}
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h2 className="font-semibold text-gray-800">{product?.name}</h2>
        <p className="text-sm text-gray-500">{product?.variant}</p>
      </div>
    </div>
  );
};