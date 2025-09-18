import Link from "next/link";
import { ArrowRight, Smartphone, Zap, Shield, Clock } from "lucide-react";
import Layout from "../components/Layout/Layout";

export default function MainPage() {
  const features = [
    {
      icon: Zap,
      title: "ประเมินง่าย",
      description: "ตอบคำถามง่ายๆ เพียง 3 ขั้นตอน",
    },
    {
      icon: Clock,
      title: "รู้ผลทันที",
      description: "ได้ราคาประเมินภายใน 2 นาที",
    },
    {
      icon: Shield,
      title: "ปลอดภัย",
      description: "การประเมินฟรี ไม่มีค่าใช้จ่าย",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              เปลี่ยนมือถือเก่าของคุณ
              <br />
              <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                ให้มีมูลค่า
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              ประเมินราคาง่ายๆ ใน 3 ขั้นตอน รู้ผลทันที
              <br />
              ราคาดีที่สุด บริการรวดเร็ว น่าเชื่อถือ
            </p>

            <Link href="/assess" className="btn-hero inline-flex items-center text-lg">
              เริ่มประเมินราคาเลย
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ทำไมต้องเลือกเรา?</h2>
            <p className="text-lg text-muted-foreground">บริการประเมินราคามือถือที่ดีที่สุด ด้วยระบบที่ทันสมัย</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-assessment text-center hover:shadow-card transition-smooth">
                  <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>

                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card-assessment text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              พร้อมประเมินราคามือถือของคุณแล้วใช่ไหม?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">เพียง 2 นาทีเท่านั้น คุณจะได้รู้ราคาประเมินเบื้องต้น</p>
            <Link href="/assess" className="btn-hero inline-flex items-center text-lg">
              เริ่มประเมินตอนนี้
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
