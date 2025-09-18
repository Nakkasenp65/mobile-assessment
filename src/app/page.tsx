"use client";
import Link from "next/link"; // ใช้ next/link สำหรับการนำทางภายในแอป
import {
  ArrowRight,
  Smartphone,
  ClipboardCheck,
  Calendar,
  Banknote,
} from "lucide-react";
import Layout from "@/components/Layout/Layout"; // โปรดตรวจสอบ Path ของ Layout Component
import { Card, CardContent } from "@/components/ui/card"; // Import Card components from shadcn/ui
import { Button } from "@/components/ui/button"; // Import Button from shadcn/ui
import { PhoneScene } from "../components/3D/PhoneScene";
import { cn } from "@/lib/utils"; // Utility function for merging classNames

// =================================================================
// [Data Definitions]
// =================================================================
const HERO_FEATURES = [
  {
    icon: ClipboardCheck,
    title: "ประเมินง่าย",
    description: "ตอบคำถามง่ายๆ เพียง 3 ขั้นตอน",
  },
  {
    icon: Calendar,
    title: "รู้ผลทันที",
    description: "ได้ราคาประเมินภายใน 2 นาที",
  },
  {
    icon: Banknote,
    title: "ปลอดภัย",
    description: "การประเมินฟรี ไม่มีค่าใช้จ่าย",
  },
];

const SALES_STEPS = [
  {
    icon: ClipboardCheck,
    title: "ประเมิน",
    description: "ประเมินราคามือถือของคุณออนไลน์",
  },
  {
    icon: Calendar,
    title: "นัดหมาย",
    description: "เลือกวันเวลาที่สะดวกสำหรับคุณ",
  },
  {
    icon: Banknote,
    title: "รับเงินทันที",
    description: "รับเงินสดทันทีหลังจากตรวจสอบ",
  },
];

const WHY_CHOOSE_US = [
  {
    icon: Smartphone,
    title: "ราคาดีที่สุด",
    description: "ประเมินราคายุติธรรม ไม่มีการหักเปอร์เซ็นต์",
  },
  {
    icon: ClipboardCheck,
    title: "ตรวจสอบละเอียด",
    description: "ตรวจสอบเครื่องอย่างละเอียด โปร่งใส",
  },
  {
    icon: Calendar,
    title: "บริการรวดเร็ว",
    description: "นัดหมายง่าย ไม่ต้องรอนาน",
  },
  {
    icon: Banknote,
    title: "จ่ายเงินทันที",
    description: "รับเงินสดทันทีหลังตรวจสอบ",
  },
];

// =================================================================
// [Main Component: Index Page]
// =================================================================
const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Phone Scene and Quick Quote */}
      <section className="relative overflow-hidden px-4 py-8 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            {/* Left Column - Content */}
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h1 className="text-foreground mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                  รับซื้อมือถือ
                  <br />
                  <span className="from-primary to-secondary bg-gradient-to-br bg-clip-text text-transparent">
                    OK Mobile
                  </span>
                </h1>

                <div className="mb-8 space-y-4">
                  {HERO_FEATURES.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-full">
                          <Icon className="text-primary h-3 w-3" />
                        </div>
                        <span className="text-muted-foreground text-lg">
                          {feature.description}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/assess"
                  className="btn-hero inline-flex items-center text-lg"
                >
                  เริ่มประเมินราคาเลย
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Right Column - Quick Quote Form */}
            <div className="order-1 lg:order-2">
              <Card className="card-assessment border-primary/20 shadow-card border-2">
                <CardContent className="p-6">
                  <h3 className="text-foreground mb-4 text-xl font-bold">
                    ประเมินราคามือถือที่ต้องการขาย
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        เลือกยี่ห้อมือถือของคุณ
                      </label>
                      {/* Using shadcn/ui Select for better UX */}
                      <select className="border-input bg-background text-foreground focus:ring-primary focus:border-primary h-12 w-full rounded-xl border px-3 py-2 text-base focus:ring-2">
                        <option value="">เลือกยี่ห้อมือถือ</option>
                        <option value="apple">iPhone</option>
                        <option value="samsung">Samsung Galaxy</option>
                        <option value="google">Google Pixel</option>
                        <option value="huawei">Huawei</option>
                        <option value="xiaomi">Xiaomi</option>
                        <option value="oppo">OPPO</option>
                        <option value="vivo">Vivo</option>
                        <option value="oneplus">OnePlus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        เลือกความจุ GB
                      </label>
                      {/* Using shadcn/ui Select for better UX */}
                      <select className="border-input bg-background text-foreground focus:ring-primary focus:border-primary h-12 w-full rounded-xl border px-3 py-2 text-base focus:ring-2">
                        <option value="">เลือกความจุ</option>
                        <option value="128">128 GB</option>
                        <option value="256">256 GB</option>
                        <option value="512">512 GB</option>
                        <option value="1024">1 TB</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="icloud"
                        className="border-primary text-primary focus:ring-primary h-4 w-4 rounded"
                      />
                      <label
                        htmlFor="icloud"
                        className="text-muted-foreground cursor-pointer text-sm"
                      >
                        สามารถปลดล็อก iCloud ได้
                      </label>
                    </div>

                    <Button className="shadow-soft hover:shadow-card h-12 w-full transform text-lg font-semibold hover:scale-105">
                      ประเมินราคา
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              3 ขั้นตอนง่ายๆ ขายมือถือ กับ OK Mobile
            </h2>
            <p className="text-muted-foreground text-lg">
              รับซื้อมือถือทุกยี่ห้อ ทั่วกรุงเทพฯ และปริมณฑล
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {SALES_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="gradient-primary mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl">
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  <h3 className="text-foreground mb-3 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              ขายมือถือ กับ OK Mobile ดียังไง ?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="card-assessment *:text-center">
                  <div className="gradient-primary shadow-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-foreground mb-2 font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="card-assessment shadow-card text-center">
            <h3 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
              พร้อมประเมินราคามือถือของคุณแล้วใช่ไหม?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              เพียง 2 นาทีเท่านั้น คุณจะได้รู้ราคาประเมินเบื้องต้น
            </p>
            <Link
              href="/assess"
              className="btn-hero inline-flex items-center text-lg"
            >
              เริ่มประเมินตอนนี้
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
