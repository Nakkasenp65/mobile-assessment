// src/util/phone.ts

import { Smartphone, Tablet, Laptop, Watch, Ear, Ellipsis, LucideIcon, Pen } from "lucide-react";
import { BsEarbuds } from "react-icons/bs";
import { IoWatchOutline } from "react-icons/io5";
import type { IconType } from "react-icons";

// สร้าง Interface เพื่อกำหนดโครงสร้างข้อมูลให้ชัดเจน
interface PhoneData {
  brands: {
    id: string;
    name: string;
    logo?: string;
    color?: string;
    import?: string;
    icon?: LucideIcon | IconType;
  }[];
  products: Record<string, { id: string; name: string; icon: LucideIcon | IconType }[]>;
  models: Record<string, string[]>;
  storage: Record<string, string[]>;
}

export const PHONE_DATA: PhoneData = {
  brands: [
    {
      id: "Apple",
      name: "Apple",
      logo: "https://cdn.simpleicons.org/apple/black",
      color: "bg-[black]",
    },
    {
      id: "Samsung",
      name: "Samsung",
      logo: "https://cdn.simpleicons.org/samsung/black",
      color: "bg-[#1363DF]",
    },
    {
      id: "Oppo",
      name: "Oppo",
      logo: "https://cdn.simpleicons.org/oppo/black",
      color: "bg-[#008A45]",
    },
    {
      id: "Vivo",
      name: "Vivo",
      logo: "https://cdn.simpleicons.org/vivo/black",
      color: "bg-[#415FFF]",
    },
    {
      id: "Xiaomi",
      name: "Xiaomi",
      logo: "https://cdn.simpleicons.org/xiaomi/black",
      color: "bg-[#FF6900]",
    },
    {
      id: "Redmi",
      name: "Redmi",
      import: "/assets/redmi.svg",
      color: "bg-[#e61d40]",
    },
    {
      id: "Realme",
      name: "Realme",
      import: "/assets/realme.svg",
      color: "bg-[#fac91b]",
    },
    {
      id: "Honor",
      name: "Honor",
      logo: "https://cdn.simpleicons.org/Honor/black",
      color: "bg-[#3bb1ff]",
    },
    {
      id: "Others",
      name: "อื่นๆ",
      icon: Ellipsis,
      color: "bg-[black]",
    },
  ],
  products: {
    Apple: [
      { id: "iPhone", name: "iPhone", icon: Smartphone },
      { id: "iPad", name: "iPad", icon: Tablet },
      { id: "Mac", name: "Mac", icon: Laptop },
      { id: "Apple Watch", name: "Apple Watch", icon: IoWatchOutline },
      { id: "AirPods", name: "AirPods", icon: BsEarbuds },
      { id: "Apple Pencil", name: "Apple Pencil", icon: Pen },
    ],
  },
  models: {
    iPhone: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 14 Plus",
      "iPhone 14",
      "iPhone 13 Pro Max",
      "iPhone 13 Pro",
      "iPhone 13",
      "iPhone 13 Mini",
      "iPhone XR",
      "iPhone 11 Pro Max",
      "iPhone 11 Pro",
      "iPhone 11",
    ],
    iPad: ["iPad Pro 12.9-inch (6th gen)", "iPad Pro 11-inch (4th gen)", "iPad Air (5th gen)", "iPad (10th gen)"],
    Samsung: [
      "Galaxy S24 Ultra",
      "Galaxy S24 Plus",
      "Galaxy S24",
      "Galaxy S23 Ultra",
      "Galaxy S23 Plus",
      "Galaxy S23",
      "Galaxy S23 FE",
      "Galaxy Z Fold5",
      "Galaxy Z Flip5",
      "Galaxy A55",
      "Galaxy A35",
    ],
    Oppo: ["Oppo Find N3 Flip", "Oppo Reno11 Pro", "Oppo Reno11", "Oppo Reno10 Pro Plus", "Oppo A98", "Oppo A79"],
    Vivo: ["Vivo X100 Pro", "Vivo V30 Pro", "Vivo V30", "Vivo V29", "Vivo Y36"],
    Xiaomi: [
      "Xiaomi 14",
      "Xiaomi 13T Pro",
      "Xiaomi 13T",
      "Redmi Note 13 Pro Plus",
      "Redmi Note 13 Pro",
      "POCO F5 Pro",
      "POCO F5",
    ],
    Redmi: ["Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 13", "Redmi 13C", "Redmi A3"],
    Realme: ["Realme GT 6", "Realme 12 Pro+", "Realme 12+", "Realme C67", "Realme Narzo 70 Pro"],
    Honor: ["Honor Magic6 Pro", "Honor 200 Pro", "Honor Magic V2", "Honor 90"],
    Others: [],
  },
  storage: {
    // Apple iPhone
    "iPhone 15 Pro Max": ["256 GB", "512 GB", "1 TB"],
    "iPhone 15 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 15 Plus": ["128 GB", "256 GB", "512 GB"],
    "iPhone 15": ["128 GB", "256 GB", "512 GB"],
    "iPhone 14 Pro Max": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 14 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 14 Plus": ["128 GB", "256 GB", "512 GB"],
    "iPhone 14": ["128 GB", "256 GB", "512 GB"],
    "iPhone 13 Pro Max": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 13 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPhone 13": ["128 GB", "256 GB", "512 GB"],
    "iPhone 13 Mini": ["128 GB", "256 GB", "512 GB"],
    "iPhone XR": ["64 GB", "128 GB", "256 GB"],
    "iPhone 11 Pro Max": ["64 GB", "128 GB", "256 GB"],
    "iPhone 11 Pro": ["64 GB", "128 GB", "256 GB"],
    "iPhone 11": ["64 GB", "128 GB", "256 GB"],
    // Apple iPad
    "iPad Pro 12.9-inch (6th gen)": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11-inch (4th gen)": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Air (5th gen)": ["64 GB", "256 GB"],
    "iPad (10th gen)": ["64 GB", "256 GB"],
    // Samsung
    "Galaxy S24 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Galaxy S24 Plus": ["256 GB", "512 GB"],
    "Galaxy S24": ["128 GB", "256 GB", "512 GB"],
    "Galaxy S23 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Galaxy S23 Plus": ["256 GB", "512 GB"],
    "Galaxy S23": ["128 GB", "256 GB"],
    "Galaxy S23 FE": ["128 GB", "256 GB"],
    "Galaxy Z Fold5": ["256 GB", "512 GB", "1 TB"],
    "Galaxy Z Flip5": ["256 GB", "512 GB"],
    "Galaxy A55": ["128 GB", "256 GB"],
    "Galaxy A35": ["128 GB", "256 GB"],
    // Oppo
    "Oppo Find N3 Flip": ["256 GB"],
    "Oppo Reno11 Pro": ["256 GB", "512 GB"],
    "Oppo Reno11": ["128 GB", "256 GB"],
    "Oppo Reno10 Pro Plus": ["256 GB"],
    "Oppo A98": ["256 GB"],
    "Oppo A79": ["128 GB", "256 GB"],
    // Vivo
    "Vivo X100 Pro": ["512 GB"],
    "Vivo V30 Pro": ["512 GB"],
    "Vivo V30": ["256 GB"],
    "Vivo V29": ["256 GB", "512 GB"],
    "Vivo Y36": ["128 GB", "256 GB"],
    // Xiaomi
    "Xiaomi 14": ["256 GB", "512 GB"],
    "Xiaomi 13T Pro": ["256 GB", "512 GB", "1 TB"],
    "Xiaomi 13T": ["256 GB"],
    "Redmi Note 13 Pro Plus": ["256 GB", "512 GB"],
    "Redmi Note 13 Pro": ["256 GB"],
    "POCO F5 Pro": ["256 GB", "512 GB"],
    "POCO F5": ["256 GB"],
    // Redmi
    "Redmi Note 14 Pro+": ["256 GB", "512 GB"],
    "Redmi Note 14 Pro": ["128 GB", "256 GB", "512 GB"],
    "Redmi Note 13": ["128 GB", "256 GB"],
    "Redmi 13C": ["128 GB", "256 GB"],
    "Redmi A3": ["64 GB", "128 GB"],
    // Realme
    "Realme GT 6": ["256 GB", "512 GB", "1 TB"],
    "Realme 12 Pro+": ["128 GB", "256 GB", "512 GB"],
    "Realme 12+": ["128 GB", "256 GB"],
    "Realme C67": ["128 GB", "256 GB"],
    "Realme Narzo 70 Pro": ["128 GB", "256 GB"],
    // Honor
    "Honor Magic6 Pro": ["256 GB", "512 GB", "1 TB"],
    "Honor 200 Pro": ["256 GB", "512 GB", "1 TB"],
    "Honor Magic V2": ["256 GB", "512 GB", "1 TB"],
    "Honor 90": ["256 GB", "512 GB"],
  },
};
