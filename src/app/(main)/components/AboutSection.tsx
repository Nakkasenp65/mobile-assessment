import { InteractiveGridPattern } from "@/components/ui/shadcn-io/interactive-grid-pattern";
import { Rocket, ShieldCheck, Store } from "lucide-react";

// ข้อมูล Features (ไม่มีการเปลี่ยนแปลง)
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
  <section className="relative py-24 sm:py-32">
    <div className="container mx-auto px-4">
      {/* Header (ไม่มีการเปลี่ยนแปลง) */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          ทำไมต้องขาย iPhone กับ OK Mobile?
        </h2>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          เราออกแบบบริการรับซื้อให้ง่าย รวดเร็ว
          และให้ราคาดีที่สุด
          เพื่อให้คุณได้รับประสบการณ์ที่ยอดเยี่ยมและสบายใจที่สุด
        </p>
      </div>

      {/* Feature Grid */}
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-16 md:max-w-none md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col last:col-span-2 lg:last:col-span-1"
            >
              <dt className="text-foreground flex items-center gap-x-1 text-xs leading-7 font-semibold sm:gap-x-2 sm:text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 sm:h-12 sm:w-12">
                  <feature.icon
                    className="h-4 w-4 text-white sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />
                </div>
                {feature.name}
              </dt>
              <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                <p className="flex-auto">
                  {feature.description}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

export default AboutSection;
