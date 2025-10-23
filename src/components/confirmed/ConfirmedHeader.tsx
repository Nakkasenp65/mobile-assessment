"use client";

import React from "react";

interface ConfirmedHeaderProps {
  title: string;
  subtitle: React.ReactNode;
}

export const ConfirmedHeader: React.FC<ConfirmedHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="flex flex-col border-b border-gray-200 p-4 md:p-6">
      <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
        {title}
      </h1>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};