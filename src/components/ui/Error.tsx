import { motion } from "framer-motion";
import { Link } from "lucide-react";

export default function Error() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-white to-rose-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-white/70 p-8 text-center shadow-lg backdrop-blur-sm"
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100"
        >
          <svg
            className="h-8 w-8 text-rose-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-2 text-xl font-semibold text-gray-800"
        >
          โอ๊ะ... มีบางอย่างผิดพลาด
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-gray-600"
        >
          ไม่สามารถโหลดข้อมูลการประเมินได้ในขณะนี้
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:outline-none"
          >
            ลองใหม่อีกครั้ง
          </button>
          <Link href="/" className="text-sm text-rose-500 underline hover:text-rose-600">
            กลับไปหน้าแรก
          </Link>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
