// src/util/phone.ts

// =================================================================================
// SECTION: Imports & Type Definitions
// =================================================================================

import { Smartphone, Tablet, Laptop, Ellipsis, LucideIcon } from "lucide-react";
import { BsEarbuds } from "react-icons/bs";
import { IoWatchOutline } from "react-icons/io5";
import { PiPencilSimpleLineBold } from "react-icons/pi";
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

// =================================================================================
// SECTION: Main Data Object
// =================================================================================

export const PHONE_DATA: PhoneData = {
  // -------------------------------------------------------------------------------
  // SUB-SECTION: Brands
  // -------------------------------------------------------------------------------
  brands: [
    {
      id: "Apple",
      name: "Apple",
      logo: "https://cdn.simpleicons.org/apple/black",
      color: "#000000",
    },
    {
      id: "Samsung",
      name: "Samsung",
      logo: "https://cdn.simpleicons.org/samsung/black",
      color: "#1363DF",
    },
    {
      id: "Vivo",
      name: "Vivo",
      logo: "https://cdn.simpleicons.org/vivo/black",
      color: "#415FFF",
    },
    {
      id: "Oppo",
      name: "Oppo",
      logo: "https://cdn.simpleicons.org/oppo/black",
      color: "#008A45",
    },
    {
      id: "Xiaomi",
      name: "Xiaomi",
      logo: "https://cdn.simpleicons.org/xiaomi/black",
      color: "#FF6900",
    },
    {
      id: "Redmi",
      name: "Redmi",
      import: "/assets/redmi.svg",
      color: "#e61d40",
    },
    {
      id: "Realme",
      name: "Realme",
      import: "/assets/realme.svg",
      color: "#fac91b",
    },
    {
      id: "Honor",
      name: "Honor",
      logo: "https://cdn.simpleicons.org/Honor/black",
      color: "#3bb1ff",
    },
    {
      id: "Others",
      name: "อื่นๆ",
      icon: Ellipsis,
      color: "#000000",
    },
  ],

  // -------------------------------------------------------------------------------
  // SUB-SECTION: Product Categories per Brand
  // -------------------------------------------------------------------------------
  products: {
    Apple: [
      { id: "iPhone", name: "iPhone", icon: Smartphone },
      { id: "iPad", name: "iPad", icon: Tablet },
      { id: "Mac", name: "Mac", icon: Laptop },
      { id: "Apple Watch", name: "Apple Watch", icon: IoWatchOutline },
      { id: "AirPods", name: "AirPods", icon: BsEarbuds },
      { id: "Apple Pencil", name: "Apple Pencil", icon: PiPencilSimpleLineBold },
    ],
    Samsung: [
      { id: "Galaxy S", name: "Galaxy S", icon: Smartphone },
      { id: "Galaxy Z", name: "Galaxy Z", icon: Smartphone },
      { id: "Galaxy A", name: "Galaxy A", icon: Smartphone },
      { id: "Galaxy M", name: "Galaxy M", icon: Smartphone },
      { id: "Galaxy Tab", name: "Galaxy Tab", icon: Tablet },
    ],
    Vivo: [
      { id: "Vivo X", name: "Vivo X Series", icon: Smartphone },
      { id: "Vivo Y", name: "Vivo Y Series", icon: Smartphone },
    ],
    Oppo: [
      { id: "Find Series", name: "Find Series", icon: Smartphone },
      { id: "Reno Series", name: "Reno Series", icon: Smartphone },
      { id: "A Series", name: "A Series", icon: Smartphone },
    ],
    Xiaomi: [
      { id: "Xiaomi Series", name: "Xiaomi Series", icon: Smartphone },
      { id: "POCO Series", name: "POCO Series", icon: Smartphone },
    ],
    Redmi: [
      { id: "Note Series", name: "Note Series", icon: Smartphone },
      { id: "Redmi Series", name: "Redmi Series", icon: Smartphone },
    ],
    Realme: [
      { id: "GT Series", name: "GT Series", icon: Smartphone },
      { id: "Realme Series", name: "Realme Series", icon: Smartphone },
      { id: "C Series", name: "C Series", icon: Smartphone },
    ],
    Honor: [
      { id: "Magic Series", name: "Magic Series", icon: Smartphone },
      { id: "Honor Series", name: "Honor Series", icon: Smartphone },
    ],
  },

  // -------------------------------------------------------------------------------
  // SUB-SECTION: Device Models
  // -------------------------------------------------------------------------------
  models: {
    // Apple
    iPhone: [
      "iPhone 16 Pro Max",
      "iPhone 16 Pro",
      "iPhone 16 Plus",
      "iPhone 16",
      "iPhone 16e",
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
      "iPhone 12 Pro Max",
      "iPhone 12 Pro",
      "iPhone 12",
      "iPhone 12 Mini",
      "iPhone SE 2022",
      "iPhone 11 Pro Max",
      "iPhone 11 Pro",
      "iPhone 11",
      "iPhone XR",
    ],
    iPad: [
      "iPad Pro 13 M4 WiFi",
      "iPad Pro 13 M4 Cellular",
      "iPad Pro 11 M4 WiFi",
      "iPad Pro 11 M4 Cellular",
      "iPad Pro 12.9 M2 WiFi",
      "iPad Pro 12.9 M2 Cellular",
      "iPad Pro 11 M2 WiFi",
      "iPad Pro 11 M2 Cellular",
      "iPad Pro 12.9 M1 WiFi",
      "iPad Pro 12.9 M1 Cellular",
      "iPad Pro 11 M1 WiFi",
      "iPad Pro 11 M1 Cellular",
      "iPad Pro 12.9 2020 WiFi",
      "iPad Pro 12.9 2020 Cellular",
      "iPad Pro 11 2020 WiFi",
      "iPad Pro 11 2020 Cellular",
      "iPad Pro 12.9 2018 WiFi",
      "iPad Pro 12.9 2018 Cellular",
      "iPad Pro 11 2018 WiFi",
      "iPad Pro 11 2018 Cellular",
      "iPad Pro 10.5 WiFi",
      "iPad Pro 10.5 Cellular",
      "iPad Mini 7 Cellular",
      "iPad Mini 6 WiFi",
      "iPad Mini 6 Cellular",
      "iPad Mini 5 WiFi",
      "iPad Mini 5 Cellular",
      "iPad Mini 4 WiFi",
      "iPad Mini 4 Cellular",
      "iPad Gen 10 WiFi",
      "iPad Gen 10 Cellular",
      "iPad Gen 9 WiFi",
      "iPad Gen 9 Cellular",
      "iPad Gen 8 WiFi",
      "iPad Gen 8 Cellular",
      "iPad Gen 7 WiFi",
      "iPad Gen 7 Cellular",
    ],

    // Samsung
    Samsung: [
      "Samsung S24 Ultra",
      "Samsung S24 Plus",
      "Samsung S24 FE",
      "Samsung S24",
      "Samsung S23 Ultra",
      "Samsung S23 Plus",
      "Samsung S23 FE",
      "Samsung S23",
      "Samsung S22 Ultra",
      "Samsung S22 Plus",
      "Samsung S22",
      "Samsung Z Fold 6",
      "Samsung Z Flip 6",
      "Samsung Z Fold 5",
      "Samsung Z Flip 5",
      "Samsung A55 5G",
      "Samsung A35 5G",
      "Samsung A25 5G",
      "Samsung A16 5G",
      "Samsung A15 5G",
      "Samsung A15",
      "Samsung A06",
      "Samsung A05",
      "Samsung M55s",
      "Samsung M35",
      "Samsung M05",
      "Samsung Tab A9+",
    ],

    // Vivo
    Vivo: [
      "Vivo X100s",
      "Vivo X100",
      "Vivo X90 Pro Plus",
      "Vivo X90 Pro",
      "Vivo X90",
      "Vivo X80 Pro",
      "Vivo X80 Lite",
      "Vivo X80",
      "Vivo Y28s",
      "Vivo Y28",
      "Vivo Y19s",
      "Vivo Y18",
      "Vivo Y03T",
      "Vivo Y03",
      "Vivo Y02T",
      "Vivo Y02",
    ],
    // Oppo
    Oppo: [
      "Oppo Find N3",
      "Oppo Find N3 Flip",
      "Oppo Reno12 Pro",
      "Oppo Reno12",
      "Oppo Reno11 Pro 5G",
      "Oppo Reno11 5G",
      "Oppo Reno10 Pro+ 5G",
      "Oppo A98 5G",
      "Oppo A79 5G",
      "Oppo A60",
      "Oppo A38",
      "Oppo A18",
    ],

    // Xiaomi
    Xiaomi: ["Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 13T Pro", "Xiaomi 13T"],

    // Redmi
    Redmi: ["Redmi Note 13 Pro+ 5G", "Redmi Note 13 Pro 5G", "Redmi Note 13 5G", "Redmi 13C", "Redmi A3"],

    // Realme
    Realme: [
      "Realme GT 6",
      "Realme GT 6T",
      "Realme GT Neo 3",
      "Realme 12 Pro+ 5G",
      "Realme 12+ 5G",
      "Realme 12 5G",
      "Realme C67",
      "Realme C65",
      "Realme C53",
    ],

    // Honor
    Honor: [
      "Honor 200 Pro",
      "Honor 200",
      "Honor X9b 5G",
      "Honor 90 5G",
      "Honor X8b",
      "Honor Magic6 Pro",
      "Honor Magic V2",
    ],

    // Others
    Others: [],
  },

  // -------------------------------------------------------------------------------
  // SUB-SECTION: Storage Options per Model
  // -------------------------------------------------------------------------------
  // Note: Storage data can be filled in later as needed.
  // -------------------------------------------------------------------------------
  storage: {
    // ===========================================================================
    // Apple
    // ===========================================================================

    // iPhone
    "iPhone 16 Pro Max": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPhone 16 Pro": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPhone 16 Plus": ["128 GB", "256 GB", "512 GB"],
    "iPhone 16": ["128 GB", "256 GB", "512 GB"],
    "iPhone 16e": ["128 GB", "256 GB"],
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
    "iPhone 12 Pro Max": ["128 GB", "256 GB", "512 GB"],
    "iPhone 12 Pro": ["128 GB", "256 GB", "512 GB"],
    "iPhone 12": ["64 GB", "128 GB", "256 GB"],
    "iPhone 12 Mini": ["64 GB", "128 GB", "256 GB"],
    "iPhone SE 2022": ["64 GB", "128 GB", "256 GB"],
    "iPhone 11 Pro Max": ["64 GB", "256 GB", "512 GB"],
    "iPhone 11 Pro": ["64 GB", "256 GB", "512 GB"],
    "iPhone 11": ["64 GB", "128 GB", "256 GB"],
    "iPhone XR": ["64 GB", "128 GB", "256 GB"],

    // iPad
    "iPad Pro 13 M4 WiFi": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 13 M4 Cellular": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M4 WiFi": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M4 Cellular": ["256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 12.9 M2 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 12.9 M2 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M2 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M2 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 12.9 M1 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 12.9 M1 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M1 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 11 M1 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    "iPad Pro 12.9 2020 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 12.9 2020 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 11 2020 WiFi": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 11 2020 Cellular": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 12.9 2018 WiFi": ["64 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 12.9 2018 Cellular": ["64 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 11 2018 WiFi": ["64 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 11 2018 Cellular": ["64 GB", "256 GB", "512 GB", "1 TB"],
    "iPad Pro 10.5 WiFi": ["64 GB", "256 GB", "512 GB"],
    "iPad Pro 10.5 Cellular": ["64 GB", "256 GB", "512 GB"],
    "iPad Mini 7 Cellular": ["128 GB", "256 GB"],
    "iPad Mini 6 WiFi": ["64 GB", "256 GB"],
    "iPad Mini 6 Cellular": ["64 GB", "256 GB"],
    "iPad Mini 5 WiFi": ["64 GB", "256 GB"],
    "iPad Mini 5 Cellular": ["64 GB", "256 GB"],
    "iPad Mini 4 WiFi": ["16 GB", "64 GB", "128 GB"],
    "iPad Mini 4 Cellular": ["16 GB", "64 GB", "128 GB"],
    "iPad Gen 10 WiFi": ["64 GB", "256 GB"],
    "iPad Gen 10 Cellular": ["64 GB", "256 GB"],
    "iPad Gen 9 WiFi": ["64 GB", "256 GB"],
    "iPad Gen 9 Cellular": ["64 GB", "256 GB"],
    "iPad Gen 8 WiFi": ["32 GB", "128 GB"],
    "iPad Gen 8 Cellular": ["32 GB", "128 GB"],
    "iPad Gen 7 WiFi": ["32 GB", "128 GB"],
    "iPad Gen 7 Cellular": ["32 GB", "128 GB"],

    // ===========================================================================
    // Samsung
    // ===========================================================================
    "Samsung S24 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Samsung S24 Plus": ["256 GB", "512 GB"],
    "Samsung S24 FE": ["128 GB", "256 GB"],
    "Samsung S24": ["128 GB", "256 GB", "512 GB"],
    "Samsung S23 Ultra": ["256 GB", "512 GB", "1 TB"],
    "Samsung S23 Plus": ["256 GB", "512 GB"],
    "Samsung S23 FE": ["128 GB", "256 GB"],
    "Samsung S23": ["128 GB", "256 GB"],
    "Samsung S22 Ultra": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "Samsung S22 Plus": ["128 GB", "256 GB"],
    "Samsung S22": ["128 GB", "256 GB"],
    "Samsung Z Fold 6": ["256 GB", "512 GB", "1 TB"],
    "Samsung Z Flip 6": ["256 GB", "512 GB"],
    "Samsung Z Fold 5": ["256 GB", "512 GB", "1 TB"],
    "Samsung Z Flip 5": ["256 GB", "512 GB"],
    "Samsung A55 5G": ["128 GB", "256 GB"],
    "Samsung A35 5G": ["128 GB", "256 GB"],
    "Samsung A25 5G": ["128 GB", "256 GB"],
    "Samsung A16 5G": ["128 GB", "256 GB"],
    "Samsung A15 5G": ["128 GB", "256 GB"],
    "Samsung A15": ["128 GB", "256 GB"],
    "Samsung A06": ["128 GB"],
    "Samsung A05": ["64 GB", "128 GB"],
    "Samsung M55s": ["128 GB", "256 GB"],
    "Samsung M35": ["128 GB", "256 GB"],
    "Samsung M05": ["64 GB", "128 GB"],
    "Samsung Tab A9+": ["64 GB", "128 GB"],

    // ===========================================================================
    // Vivo
    // ===========================================================================
    "Vivo X100s": ["256 GB", "512 GB", "1 TB"],
    "Vivo X100": ["256 GB", "512 GB"],
    "Vivo X90 Pro Plus": ["256 GB", "512 GB"],
    "Vivo X90 Pro": ["256 GB", "512 GB"],
    "Vivo X90": ["128 GB", "256 GB", "512 GB"],
    "Vivo X80 Pro": ["256 GB", "512 GB"],
    "Vivo X80 Lite": ["256 GB"],
    "Vivo X80": ["128 GB", "256 GB"],
    "Vivo Y28s": ["128 GB", "256 GB"],
    "Vivo Y28": ["128 GB", "256 GB"],
    "Vivo Y19s": ["128 GB"],
    "Vivo Y18": ["64 GB", "128 GB"],
    "Vivo Y03T": ["64 GB", "128 GB"],
    "Vivo Y03": ["64 GB", "128 GB"],
    "Vivo Y02T": ["64 GB"],
    "Vivo Y02": ["32 GB"],

    // ===========================================================================
    // Oppo
    // ===========================================================================
    "Oppo Find N3": ["512 GB"],
    "Oppo Find N3 Flip": ["256 GB"],
    "Oppo Reno12 Pro": ["256 GB", "512 GB"],
    "Oppo Reno12": ["256 GB", "512 GB"],
    "Oppo Reno11 Pro 5G": ["256 GB", "512 GB"],
    "Oppo Reno11 5G": ["128 GB", "256 GB"],
    "Oppo Reno10 Pro+ 5G": ["256 GB"],
    "Oppo A98 5G": ["256 GB"],
    "Oppo A79 5G": ["128 GB", "256 GB"],
    "Oppo A60": ["128 GB", "256 GB"],
    "Oppo A38": ["128 GB"],
    "Oppo A18": ["64 GB", "128 GB"],

    // ===========================================================================
    // Xiaomi / POCO / Redmi
    // ===========================================================================
    "Xiaomi 14 Ultra": ["512 GB", "1 TB"],
    "Xiaomi 14": ["256 GB", "512 GB"],
    "Xiaomi 13T Pro": ["256 GB", "512 GB", "1 TB"],
    "Xiaomi 13T": ["256 GB"],
    "POCO F6 Pro": ["256 GB", "512 GB", "1 TB"],
    "POCO F6": ["256 GB", "512 GB"],
    "POCO X6 Pro 5G": ["256 GB", "512 GB"],
    "POCO M6 Pro": ["256 GB", "512 GB"],
    "Redmi Note 13 Pro+ 5G": ["256 GB", "512 GB"],
    "Redmi Note 13 Pro 5G": ["128 GB", "256 GB", "512 GB"],
    "Redmi Note 13 5G": ["128 GB", "256 GB"],
    "Redmi 13C": ["128 GB", "256 GB"],
    "Redmi A3": ["64 GB", "128 GB"],

    // ===========================================================================
    // Realme
    // ===========================================================================
    "Realme GT 6": ["256 GB", "512 GB"],
    "Realme GT 6T": ["128 GB", "256 GB", "512 GB"],
    "Realme GT Neo 3": ["128 GB", "256 GB"],
    "Realme 12 Pro+ 5G": ["128 GB", "256 GB", "512 GB"],
    "Realme 12+ 5G": ["128 GB", "256 GB"],
    "Realme 12 5G": ["128 GB"],
    "Realme C67": ["128 GB", "256 GB"],
    "Realme C65": ["128 GB", "256 GB"],
    "Realme C53": ["128 GB"],

    // ===========================================================================
    // Honor
    // ===========================================================================
    "Honor Magic6 Pro": ["256 GB", "512 GB", "1 TB"],
    "Honor Magic V2": ["256 GB", "512 GB", "1 TB"],
    "Honor 200 Pro": ["256 GB", "512 GB", "1 TB"],
    "Honor 200": ["256 GB", "512 GB"],
    "Honor X9b 5G": ["256 GB"],
    "Honor 90 5G": ["256 GB", "512 GB"],
    "Honor X8b": ["128 GB", "256 GB", "512 GB"],
  },
};
