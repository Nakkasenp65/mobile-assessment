import { SearchIcon, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../../../components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import AssessmentCard from "./AssessmentCard";
import clsx from "clsx";
import { Button } from "../../../components/ui/button";

export default function ResultsView({
  assessments,
  onBack,
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
      .filter(
        (a) =>
          filterStatus === "all" ||
          a.status === filterStatus,
      )
      .filter((a) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return `${a.device.brand} ${a.device.model}`
          .toLowerCase()
          .includes(searchLower);
      });
  }, [assessments, searchTerm, filterStatus]);

  return (
    <motion.div
      key="show-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container min-h-[80dvh] w-full pt-4 pb-16"
    >
      {/* --- Custom Back Button --- */}
      <div className="mb-4 flex items-center">
        <button
          onClick={onBack}
          className="focus:ring-primary/40 mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:bg-slate-100 focus:ring-2 focus:outline-none"
          aria-label="ย้อนกลับ"
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>
        <span className="text-lg font-semibold text-slate-800">
          กลับ
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#110e0c] sm:text-4xl md:text-5xl">
          รายการประเมินของคุณ
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#78716c] md:text-lg">
          พบทั้งหมด {assessments.length} รายการ
        </p>
      </div>

      {/* --- Filter/Search Bar --- */}
      <section className="mx-auto my-8 w-full max-w-4xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white/80 to-slate-50/80 p-4 shadow-xl backdrop-blur-[2px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="ค้นหาอุปกรณ์ เช่น iPhone 15 Pro"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-full border-2 border-slate-300 bg-white pr-5 pl-12 text-base shadow transition"
            />
            <span className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-4">
            {statusFilters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() =>
                  setFilterStatus(filter.value)
                }
                className={clsx(
                  "rounded-full border-2 border-transparent px-4 py-2 text-sm font-medium transition",
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

      {/* --- Assessments Cards --- */}
      <div className="mt-8">
        <AnimatePresence>
          {filteredAssessments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.map(
                (assessment, index) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    index={index}
                  />
                ),
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <SearchIcon className="h-9 w-9 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                ไม่พบรายการที่ตรงกัน
              </h3>
              <p className="mt-1 text-slate-500">
                ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองของคุณ
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
