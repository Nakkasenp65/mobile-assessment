import { CheckCircle, Clock, Wrench } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: {
      label: "ประเมินเสร็จสิ้น",
      icon: CheckCircle,
      color: "bg-[#f0fdf4] text-[#16a34a]",
    },
    pending: {
      label: "รอการประเมิน",
      icon: Clock,
      color: "bg-[#fefce8] text-[#ca8a04]",
    },
    "in-progress": {
      label: "กำลังประเมิน",
      icon: Wrench,
      color: "bg-[#eff6ff] text-[#2563eb]",
    },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}
    >
      <Icon className="mr-1 h-4 w-4" />
      {config.label}
    </span>
  );
}
