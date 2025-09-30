// src/hooks/useRepairPrices.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

/**
 * Interface สำหรับโครงสร้างข้อมูลราคาซ่อมที่ได้จาก Hook
 * key: คือ part_key เช่น "screenGlass"
 * value: คือ Object ที่มีราคาตามอาการ
 */
export interface RepairPriceData {
  [part: string]: {
    failed?: number;
    defect?: number;
    low?: number;
    [condition: string]: number | undefined;
  };
}

/**
 * Custom Hook สำหรับดึงข้อมูลราคาซ่อมของอุปกรณ์รุ่นที่ระบุจาก Supabase
 * @param model - ชื่อรุ่นของอุปกรณ์ที่ต้องการดึงราคาซ่อม
 */
export const useRepairPrices = (model: string) => {
  return useQuery({
    // Query Key ที่ผูกกับชื่อรุ่น เพื่อให้ React Query ทำการ cache ข้อมูลแยกตามรุ่น
    queryKey: ["repairPrices", model],

    // ฟังก์ชันสำหรับดึงและแปลงข้อมูล
    queryFn: async (): Promise<RepairPriceData> => {
      // 1. Query ข้อมูลจากตาราง repair_prices โดยกรองตาม model_name
      const { data, error } = await supabase
        .from("repair_prices")
        .select("part_key, condition_key, price")
        .eq("model_name", model);

      if (error) {
        // หากเกิด error ให้โยน error ออกไปเพื่อให้ React Query จัดการ
        console.error(
          "Error fetching repair prices:",
          error,
        );
        throw new Error(error.message);
      }

      if (!data) {
        return {}; // คืนค่าว่างหากไม่พบข้อมูล
      }

      // 2. แปลงข้อมูลจาก Array ที่ได้จาก Supabase ให้เป็น Object ที่ใช้งานง่าย
      const priceMap: RepairPriceData = {};
      for (const item of data) {
        const { part_key, condition_key, price } = item;

        // ถ้ายังไม่มี part_key นี้ใน priceMap ให้สร้างขึ้นมาก่อน
        if (!priceMap[part_key]) {
          priceMap[part_key] = {};
        }

        // เพิ่มราคาตาม condition_key
        priceMap[part_key][condition_key] = price;
      }

      return priceMap;
    },

    // --- การตั้งค่าเพิ่มเติมสำหรับ React Query ---
    // ให้ Hook นี้ทำงานก็ต่อเมื่อมีค่า `model` เท่านั้น (ป้องกันการ query โดยไม่มีเงื่อนไข)
    enabled: !!model,

    // กำหนดให้ข้อมูลที่ดึงมา "สด" อยู่เป็นเวลา 1 ชั่วโมง (3,600,000 มิลลิวินาที)
    // ในช่วงเวลานี้ React Query จะไม่ทำการ fetch ข้อมูลใหม่ถ้ามีการเรียกใช้ Hook ซ้ำ
    staleTime: 1000 * 60 * 60,

    // Cache ข้อมูลไว้ตลอดไปจนกว่าจะมีการ refresh หน้าเว็บ
    // เหมาะสำหรับข้อมูลที่ไม่เปลี่ยนแปลงบ่อย مثل ราคาซ่อม
    gcTime: Infinity,
  });
};
