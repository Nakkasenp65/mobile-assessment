import { InteractiveGridPattern } from "../../../components/ui/shadcn-io/interactive-grid-pattern";

const AboutSection = () => (
  <section className="relative container">
    <div className="mx-auto">
      <p className="text-foreground mx-auto max-w-4xl p-2 py-16 text-center text-sm leading-relaxed whitespace-pre-wrap md:p-16 md:text-lg">
        Ok Mobile บริการรับซื้อ iPhone ราคาสูงประเมินไว้ราคาภายใน 1 นาที ปลอดภัย
        ไม่โดนโกง ขายไอโฟนกับเราที่นี่ "ง่ายไวชัวร์" นอกจากให้ราคาสูง
        ประเมินราคาจากตลาดไม่กดราคารับซื้อทางเรายังการันตีรับซื้อ-ขายสบายใจทั้งผู้ซื้อและผู้ขาย
        นอกจากนี้ยังมีบริการรับซื้อถึงหน้าร้าน และ Delivery
        ร้านเราเชื่อถือได้เพราะมีหน้าร้านสาขาทั่วไทยทุกที่ตั้งอยู่ในศูนย์การค้าชั้นนำทั่วประเทศ
      </p>
    </div>
    <InteractiveGridPattern className="rounded-4xl" />
  </section>
);

export default AboutSection;
