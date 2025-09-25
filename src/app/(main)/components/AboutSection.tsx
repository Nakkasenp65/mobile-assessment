import { InteractiveGridPattern } from "@/components/ui/shadcn-io/interactive-grid-pattern";
import { Rocket, ShieldCheck, Store } from "lucide-react";

// 1. แตกข้อมูลจากย่อหน้ายาวๆ ออกมาเป็น Feature หลัก 3 ข้อ
const features = [
  {
    name: "ง่าย ไว ชัวร์",
    description:
      "ประเมินราคา iPhone ของคุณได้ราคาสูงภายใน 1 นาที โดยอิงจากราคาตลาดจริง ไม่มีการกดราคา ทำให้คุณมั่นใจได้ว่าจะได้รับข้อเสนอที่ดีที่สุด",
    icon: Rocket,
  },
  {
    name: "ปลอดภัยและเชื่อถือได้",
    description:
      "เราการันตีการซื้อขายที่สบายใจสำหรับทุกคน มีหน้าร้านสาขาจริงในศูนย์การค้าชั้นนำทั่วประเทศ คุณจึงมั่นใจได้ว่าจะไม่โดนโกง",
    icon: ShieldCheck,
  },
  {
    name: "สะดวกสบาย เลือกได้",
    description:
      "เลือกช่องทางที่คุณสะดวกได้เลย ไม่ว่าจะนำเครื่องมาขายที่หน้าร้านสาขาทั่วไทย หรือใช้บริการ Delivery รับเครื่องถึงที่",
    icon: Store,
  },
];

const AboutSection = () => (
  // 2. เพิ่ม Padding ให้ Section ดูมีพื้นที่หายใจ และใส่ relative เพื่อรองรับ background
  <section className="relative py-24 sm:py-32">
    {/* 3. เพิ่ม Background Pattern เพื่อลดความว่างเปล่า */}
    <InteractiveGridPattern className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(white,transparent_85%)] fill-white" />

    <div className="container mx-auto px-4">
      {/* 4. สร้างส่วน Header ที่มีหัวข้อหลักและคำโปรย */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          ทำไมต้องขาย iPhone กับ OK Mobile?
        </h2>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          เราออกแบบบริการรับซื้อให้ง่าย รวดเร็ว และให้ราคาดีที่สุด
          เพื่อให้คุณได้รับประสบการณ์ที่ยอดเยี่ยมและสบายใจที่สุด
        </p>
      </div>

      {/* 5. สร้าง Feature Grid เพื่อแสดงจุดเด่นพร้อมไอคอน */}
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="text-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
                  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                {feature.name}
              </dt>
              <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                <p className="flex-auto">{feature.description}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

export default AboutSection;
