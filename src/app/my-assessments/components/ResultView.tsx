import { SearchIcon, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../../../components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import AssessmentCard from "./AssessmentCard";
import clsx from "clsx";
import FramerButton from "../../../components/ui/framer/FramerButton";
import type { Assessment } from "@/types/assessment";

export default function ResultsView({
  totalPages,
  currentPage,
  handlePrevPage,
  handleNextPage,
  assessments,
  onClearSession,
}: {
  totalPages: number;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  assessments: Assessment[];
  onClearSession?: () => void;
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
      label: "ระหว่างการจอง",
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
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-foreground text-2xl font-bold md:text-3xl">รายการประเมินของคุณ</h1>
          </div>
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
                    "flex-shrink-0 rounded-full border-2 border-transparent px-2 py-1 text-sm whitespace-nowrap duration-200 ease-in-out",
                    filter.value === filterStatus
                      ? "from-primary to-secondary bg-gradient-to-r text-white shadow-sm"
                      : `${filter.color} hover:border-primary hover:bg-white`,
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
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

      {/* Actions Footer */}
      <div className="flex w-full items-center justify-center border-t border-slate-200 py-4">
        <div className="flex w-full items-center justify-end gap-2 sm:gap-3">
          {/* Pagination  */}
          {totalPages > 1 && (
            <div className="flex w-full max-w-4xl items-center justify-center gap-2 sm:gap-4">
              <FramerButton
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-10 text-[10px] sm:text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                ก่อนหน้า
              </FramerButton>
              <span className="text-[10px] text-gray-700 sm:text-sm">
                หน้า {currentPage} จาก {totalPages}
              </span>
              <FramerButton
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-10 text-[10px] sm:text-xs"
              >
                ถัดไป
                <ChevronRight className="h-4 w-4" />
              </FramerButton>
            </div>
          )}
          {onClearSession && (
            <FramerButton
              variant="outline"
              className="h-10 text-[10px] sm:text-xs"
              onClick={onClearSession}
              aria-label="ล้างเซสชัน"
              title="ล้างเซสชัน — จะลบการยืนยันหมายเลขชั่วคราวและต้องยืนยันใหม่เมื่อกลับมา"
            >
              <LogOut className="h-4 w-4 text-stone-500" />

              <span className="font-semibold text-stone-500">ล้างเซสชัน</span>
            </FramerButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}
