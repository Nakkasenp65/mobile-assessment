import { SearchIcon, ArrowLeft, LogOut } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../../../components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import AssessmentCard from "./AssessmentCard";
import clsx from "clsx";
import FramerButton from "../../../components/ui/framer/FramerButton";
import type { Assessment } from "@/types/assessment";

export default function ResultsView({ assessments, onBack, onLogout }: { assessments: Assessment[]; onBack: () => void; onLogout?: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusFilters = [
    {
      label: "ทั้งหมด",
      value: "all",
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "เสร็จสิ้น",
      value: "completed",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "กำลังดำเนินการ",
      value: "in-progress",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "รอประเมิน",
      value: "pending",
      color: "bg-yellow-50 text-yellow-700",
    },
  ];

  const filteredAssessments = useMemo(() => {
    return assessments
      .filter((a) => filterStatus === "all" || a.status === filterStatus)
      .filter((a) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return `${a.deviceInfo.brand} ${a.deviceInfo.model}`.toLowerCase().includes(searchLower);
      });
  }, [assessments, searchTerm, filterStatus]);

  return (
    <motion.div
      key="show-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-8rem)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-lg sm:p-6"
    >
      {/* Header */}
      <div className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-foreground text-2xl font-bold md:text-3xl">รายการประเมินของคุณ</h1>
          </div>
          {onLogout && (
            <FramerButton
              variant="ghost"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-10 items-center rounded-full border bg-white px-4 text-sm transition-colors sm:h-12 sm:px-6"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 text-stone-500" />
              <span className="ml-2 font-semibold text-stone-500">ออกจากระบบ</span>
            </FramerButton>
          )}
        </div>
      </div>

      {/* Filter/Search Bar */}
      <section className="flex-shrink-0 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="ค้นหาอุปกรณ์ เช่น iPhone 15 Pro"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-primary focus:ring-primary/15 h-10 w-full rounded-full border-2 border-slate-300 bg-white pr-4 pl-12 text-sm shadow-sm transition sm:h-12 sm:text-base"
            />
            <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={clsx(
                  "rounded-full border-2 border-transparent px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm",
                  filter.value === filterStatus
                    ? "from-primary to-secondary bg-gradient-to-r text-white shadow-sm"
                    : `${filter.color} hover:border-primary/50 hover:bg-white`,
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredAssessments.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredAssessments.map((assessment, index) => (
                <AssessmentCard key={assessment.id} assessment={assessment} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full items-center justify-center py-8 text-center"
            >
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 sm:h-20 sm:w-20">
                  <SearchIcon className="h-8 w-8 text-slate-400 sm:h-9 sm:w-9" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 sm:text-lg">
                  ไม่พบรายการที่ตรงกัน
                </h3>
                <p className="text-sm text-slate-500 sm:text-base">
                  ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองของคุณ
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      <div className="flex-shrink-0 pt-4">
        <FramerButton
          variant="ghost"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-10 w-max items-center rounded-full border bg-white px-4 text-sm transition-colors sm:h-12 sm:px-6"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 text-stone-500" />
          <span className="ml-2 font-semibold text-stone-500">กลับ</span>
        </FramerButton>
      </div>
    </motion.div>
  );
}
