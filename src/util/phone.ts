// src/app/assess/components/phone.ts

// สร้าง Interface เพื่อกำหนดโครงสร้างข้อมูลให้ชัดเจน
interface PhoneData {
  brands: {
    id: string;
    name: string;
    logo: string;
  }[];
  models: Record<string, string[]>;
  storage: Record<string, string[]>;
}

// ส่งออกข้อมูลทั้งหมดในตัวแปรเดียวเพื่อให้ import ไปใช้ง่าย
export const PHONE_DATA: PhoneData = {
  brands: [
    {
      id: "Apple",
      name: "Apple",
      logo: "https://cdn.simpleicons.org/apple/black",
    },
    {
      id: "Samsung",
      name: "Samsung",
      logo: "https://cdn.simpleicons.org/samsung/black",
    },
    {
      id: "Google",
      name: "Google",
      logo: "https://cdn.simpleicons.org/google/black",
    },
    {
      id: "Xiaomi",
      name: "Xiaomi",
      logo: "https://cdn.simpleicons.org/xiaomi/black",
    },
    {
      id: "Oppo",
      name: "Oppo",
      logo: "https://cdn.simpleicons.org/oppo/black",
    },
    {
      id: "Vivo",
      name: "Vivo",
      logo: "https://cdn.simpleicons.org/vivo/black",
    },
    {
      id: "OnePlus",
      name: "OnePlus",
      logo: "https://cdn.simpleicons.org/oneplus/black",
    },
  ],
  models: {
    Apple: [
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
    Google: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a", "Pixel 7 Pro", "Pixel 7"],
    Xiaomi: [
      "Xiaomi 14",
      "Xiaomi 13T Pro",
      "Xiaomi 13T",
      "Redmi Note 13 Pro Plus",
      "Redmi Note 13 Pro",
      "POCO F5 Pro",
      "POCO F5",
    ],
    Oppo: [
      "Oppo Find N3 Flip",
      "Oppo Reno11 Pro",
      "Oppo Reno11",
      "Oppo Reno10 Pro Plus",
      "Oppo A98",
      "Oppo A79",
    ],
    Vivo: ["Vivo X100 Pro", "Vivo V30 Pro", "Vivo V30", "Vivo V29", "Vivo Y36"],
    OnePlus: [
      "OnePlus 12",
      "OnePlus 11",
      "OnePlus Nord 3",
      "OnePlus Nord CE 3 Lite",
    ],
  },
  storage: {
    // Apple
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
    // Google
    "Pixel 8 Pro": ["128 GB", "256 GB", "512 GB", "1 TB"],
    "Pixel 8": ["128 GB", "256 GB"],
    "Pixel 7a": ["128 GB"],
    "Pixel 7 Pro": ["128 GB", "256 GB", "512 GB"],
    "Pixel 7": ["128 GB", "256 GB"],
    // Xiaomi
    "Xiaomi 14": ["256 GB", "512 GB"],
    "Xiaomi 13T Pro": ["256 GB", "512 GB", "1 TB"],
    "Xiaomi 13T": ["256 GB"],
    "Redmi Note 13 Pro Plus": ["256 GB", "512 GB"],
    "Redmi Note 13 Pro": ["256 GB"],
    "POCO F5 Pro": ["256 GB", "512 GB"],
    "POCO F5": ["256 GB"],
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
    // OnePlus
    "OnePlus 12": ["256 GB", "512 GB"],
    "OnePlus 11": ["128 GB", "256 GB"],
    "OnePlus Nord 3": ["128 GB", "256 GB"],
    "OnePlus Nord CE 3 Lite": ["128 GB", "256 GB"],
  },
};
