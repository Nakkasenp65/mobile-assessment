"use client";

import Image from "next/image";
import { useState } from "react";

const AnimatedButton = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className="fixed right-0 z-50 mt-24 hidden h-16 w-56 translate-x-[104px] items-center justify-start gap-4 rounded-l-full bg-white px-4 pr-8 text-xl shadow-lg shadow-black/15 duration-500 ease-in-out hover:w-80 md:flex"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={`${isHovering ? "/assets/car.gif" : "/assets/car.gif"}`}
        alt="coin bouncing"
        width={100}
        height={100}
        className="drop-shadow-sm drop-shadow-amber-500"
      />
      ขายด่วน
    </button>
  );
};

export default AnimatedButton;
