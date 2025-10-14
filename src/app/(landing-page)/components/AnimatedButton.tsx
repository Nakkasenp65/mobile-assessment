// src\app\(landing-page)\components\AnimatedButton.tsx

"use client";

import Image from "next/image";
import { ImPhone } from "react-icons/im";

const AnimatedButton = () => {
  return (
    // [แก้ไข] เพิ่ม pointer-events-none เพื่อให้ div นี้ "โปร่งใส" ต่อการคลิก
    <div className="pointer-events-none fixed z-50 hidden h-full w-full xl:block">
      {/* [แก้ไข] เพิ่ม pointer-events-auto เพื่อให้เฉพาะส่วนนี้เท่านั้นที่คลิกได้ */}
      <div className="pointer-events-auto absolute right-0 z-50 w-52 cursor-pointer duration-500 ease-in-out hover:right-40 lg:mt-4">
        <Image
          src={"https://lh3.googleusercontent.com/d/1OBI2QoC4WkKv_u0WyhKdsFeJ-z53TK6U"}
          alt="coin bouncing"
          width={200}
          height={200}
          className="absolute top-[40px] -right-8 z-50 drop-shadow-xl"
        />
        <button className="absolute right-0 z-40 hidden h-16 w-[300px] translate-x-[235px] items-center justify-start gap-4 rounded-l-full bg-white px-4 pr-8 pl-16 text-xl shadow-lg shadow-black/15 lg:mt-4 lg:flex xl:mt-24">
          <div className="relative z-10 flex flex-col items-start text-sm">
            <span className="flex items-start gap-1">ถึงใน 1 ชั่วโมง</span>
            <span className="flex items-center gap-1 text-xl font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black p-1 text-white">
                <ImPhone color="white" size={12} />
              </span>
              <span>0947878783{/* - 0801345674 */}</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnimatedButton;
