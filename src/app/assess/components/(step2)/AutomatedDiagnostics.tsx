"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutomatedDiagnosticsProps {
  onComplete: () => void;
  onBack: () => void;
}

type Status = "checking" | "success" | "failed";

export const AutomatedDiagnostics = ({ onComplete, onBack }: AutomatedDiagnosticsProps) => {
  const [wifiStatus, setWifiStatus] = useState<Status>("checking");
  const [chargingStatus, setChargingStatus] = useState<Status>("checking");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate diagnostics
    const timer1 = setTimeout(() => setWifiStatus("success"), 1500);
    const timer2 = setTimeout(() => setChargingStatus("success"), 2500);
    const timer3 = setTimeout(() => {
      setIsComplete(true);
      onComplete(); // Automatically move to the next step after a delay
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const StatusIndicator = ({ status }: { status: Status }) => {
    if (status === "checking")
      return <motion.div className="w-4 h-4 rounded-full bg-muted-foreground/50 animate-pulse" />;
    if (status === "success") return <CheckCircle className="w-5 h-5 text-success" />;
    return null;
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">ขั้นตอนที่ 2: ตรวจสอบอัตโนมัติ</h2>
        <p className="text-muted-foreground">ระบบกำลังตรวจสอบการเชื่อมต่อพื้นฐานของเครื่อง</p>
      </div>

      <div className="space-y-4 my-8 min-h-[250px] flex flex-col justify-center">
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div className="flex items-center">
            <Wifi className="w-5 h-5 mr-4 text-primary" />
            <span className="text-foreground font-medium">การเชื่อมต่อ Wi-Fi</span>
          </div>
          <StatusIndicator status={wifiStatus} />
        </div>
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-4 text-primary" />
            <span className="text-foreground font-medium">การชาร์จไฟ</span>
          </div>
          <StatusIndicator status={chargingStatus} />
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="flex items-center text-foreground rounded-xl h-12 px-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </Button>
        <Button disabled className="h-12 px-8 rounded-xl">
          <motion.div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
          กำลังตรวจสอบ...
        </Button>
      </div>
    </div>
  );
};
