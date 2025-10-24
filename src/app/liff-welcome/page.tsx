// src/app/liff-welcome/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Sparkles, Smartphone, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";

export default function LiffWelcomePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lineUserId, setLineUserId] = useState<string | null>(null);
  const [isFetchingAssessment, setIsFetchingAssessment] = useState(false);

  useEffect(() => {
    // Initialize LIFF
    const initializeLiff = async () => {
      try {
        const liff = (await import("@line/liff")).default;

        if (!liff.isInClient()) {
          // Not in LINE app
          console.warn("Not in LINE app, redirecting to assess page");
          router.push("/assess");
          return;
        }

        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        // Get LINE user profile
        const profile = await liff.getProfile();
        setLineUserId(profile.userId);
        setIsLoading(false);
        setIsModalOpen(true);
      } catch (error) {
        console.error("LIFF initialization error:", error);
        // Fallback to normal flow
        router.push("/assess");
      }
    };

    initializeLiff();
  }, [router]);

  const handleHasAssessment = async () => {
    if (!lineUserId) {
      router.push("/assess");
      return;
    }

    setIsFetchingAssessment(true);

    try {
      // TODO: Implement API call to fetch latest assessment by LINE user ID
      console.log("Fetching assessment for LINE user ID:", lineUserId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Temporary: redirect to assess page
      router.push("/assess");
    } catch (error) {
      console.error("Error fetching assessment:", error);
      router.push("/assess");
    } finally {
      setIsFetchingAssessment(false);
    }
  };

  const handleNoAssessment = () => {
    router.push("/assess");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-gray-600">กำลังเตรียมความพร้อม...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50">
      {/* Welcome Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="mx-auto max-w-md overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl backdrop-blur-xl">
          {/* Header with Gradient Background */}
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 px-6 pt-8 pb-6 text-center">
            <DialogHeader className="space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-lg" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Smartphone className="h-8 w-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-white">ยินดีต้อนรับ</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-white/90">
                  คุณเคยประเมินอุปกรณ์กับเรามาก่อนหรือไม่?
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6">
            {/* Simple Two Button Layout */}
            <div className="space-y-3">
              {/* Existing Assessment Button */}
              <Button
                onClick={handleHasAssessment}
                className="h-14 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 font-semibold text-white shadow-lg transition-all duration-300 hover:from-pink-600 hover:to-rose-600 hover:shadow-xl active:scale-95"
                disabled={isFetchingAssessment}
              >
                {isFetchingAssessment ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    กำลังค้นหา...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-base">
                    <ClipboardList className="h-5 w-5" />
                    ดูการประเมินล่าสุด
                  </span>
                )}
              </Button>

              {/* New Assessment Button */}
              <Button
                variant="outline"
                onClick={handleNoAssessment}
                className="h-14 w-full rounded-2xl border-2 border-pink-200 bg-white font-semibold text-pink-600 transition-all duration-300 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 active:scale-95"
                disabled={isFetchingAssessment}
              >
                <span className="inline-flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5" />
                  เริ่มประเมินใหม่
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>

            {/* Quick Info */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-pink-400"></div>
                <span className="text-xs text-pink-600">ประเมินฟรี • ใช้เวลาเพียง 2 นาที</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4">
            <p className="text-center text-xs text-gray-400">บริการประเมินอุปกรณ์โดยผู้เชี่ยวชาญ</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
