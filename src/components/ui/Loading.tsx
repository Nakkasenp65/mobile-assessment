import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[100dvh] w-full items-center justify-center bg-white p-6"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated dots */}
        <div className="flex space-x-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-lg font-bold text-transparent">
          กำลังโหลดรายการประเมิน…
        </div>
      </div>
    </motion.div>
  );
}
