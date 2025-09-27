"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import { ImPhone } from "react-icons/im";
import { useState } from "react";

const AnimatedButton = () => {
  return (
    <div className="fixed z-60 hidden h-full w-full cursor-pointer xl:block">
      <div className="absolute right-0 z-60 w-52 duration-500 ease-in-out hover:right-40 lg:mt-4">
        <Image
          src={
            "https://lh3.googleusercontent.com/d/1OBI2QoC4WkKv_u0WyhKdsFeJ-z53TK6U"
          }
          alt="coin bouncing"
          width={200}
          height={200}
          className="absolute top-[40px] -right-8 z-60 drop-shadow-xl drop-shadow-white"
        />
        <button className="absolute right-0 z-50 hidden h-16 w-[300px] translate-x-[235px] items-center justify-start gap-4 rounded-l-full bg-white px-4 pr-8 pl-18 text-xl shadow-lg shadow-black/15 lg:mt-4 lg:flex xl:mt-24">
          <div className="relative z-10 flex flex-col items-center text-sm">
            <span className="flex items-center gap-1">
              <span className="rounded-full bg-black p-1 text-white">
                <ImPhone color="white" size={12} />
              </span>
              ถึงใน 1 ชั่วโมง
            </span>
            <span className="text-xl font-bold">
              0947878783{/* - 0801345674 */}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnimatedButton;
