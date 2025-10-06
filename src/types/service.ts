import { LucideIcon } from "lucide-react";

export interface PawnServiceInfo {
  customerName: string;
  locationType: "home" | "bts" | "store";
  homeAddress?: string;
  province?: string;
  district?: string;
  btsLine?: string;
  btsStation?: string;
  storeBranch?: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: number;
}
