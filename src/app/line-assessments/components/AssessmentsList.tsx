import { SearchIcon, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import AssessmentCard from "./AssessmentCard";
import clsx from "clsx";
import type { Assessment } from "@/types/assessment";

export default function AssessmentsList({
  assessments,
  onRefresh,
  totalCount,
}: {
  assessments: Assessment[];
  onRefresh?: () => void;
  totalCount?: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusFilters = [
    {
      label: "ทั้งหมด",
      value: "all",
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "จองแล้ว",
      value: "reserved",
      color: "bg-blue-100 text-blue-700",
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
      className="flex w-full flex-col"
    >
      {/* Summary Card */}
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">รายการประเมินทั้งหมด</p>
            <p className="text-4xl font-bold">{totalCount ?? assessments.length}</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
              aria-label="รีเฟรช"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter/Search Bar */}
      <section className="mb-4">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="ค้นหาอุปกรณ์ เช่น iPhone 15 Pro"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-full border-2 border-slate-300 bg-white pr-4 pl-12 text-base shadow-sm transition"
            />
            <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="scrollbar-hide -mx-1 overflow-x-auto px-1">
            <div className="flex gap-2 pb-1">
              {statusFilters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setFilterStatus(filter.value)}
                  className={clsx(
                    "flex-shrink-0 rounded-full border-2 border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition",
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
        </div>
      </section>

      {/* Assessments List */}
      <div className="flex-1">
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
              className="flex min-h-[40vh] items-center justify-center py-8 text-center"
            >
              <div>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <SearchIcon className="h-9 w-9 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">ไม่พบรายการที่ตรงกัน</h3>
                <p className="text-base text-slate-500">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองของคุณ</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
