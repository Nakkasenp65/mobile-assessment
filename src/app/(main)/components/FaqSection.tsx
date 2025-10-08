// FaqSection.tsx

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// [ADD] Import ไอคอน Plus และ Minus
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "ขายไอโฟนกับ Ok Mobile จะต้องทำอย่างไร",
    a: "เพียงแค่ประเมินราคาผ่านหน้าเว็บไซต์ จากนั้นนัดหมายกับทีมงานของเราเพื่อนำเครื่องมาให้เราตรวจสอบสภาพ หรือเลือกใช้บริการรับเครื่องถึงที่ และรับเงินสดทันที",
  },
  {
    q: "มีหน้าร้านที่ไหนบ้าง",
    a: "เรามีสาขาทั่วกรุงเทพฯ และปริมณฑลในห้างสรรพสินค้าชั้นนำ สามารถตรวจสอบสาขาใกล้บ้านคุณได้ที่หน้า 'สาขาใกล้คุณ' บนเว็บไซต์ของเรา",
  },
  {
    q: "ขายไอโฟนกับ Ok Mobile ดียังไง?",
    a: "เราให้ราคาสูงและยุติธรรมตามสภาพจริง มีความน่าเชื่อถือด้วยหน้าร้านที่ชัดเจน ขั้นตอนง่าย สะดวก และรวดเร็ว พร้อมจ่ายเงินทันที",
  },
];

const FaqSection = () => (
  <section className="relative py-24 sm:py-32">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">คำถามที่พบบ่อย</h2>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          เราได้รวบรวมคำตอบสำหรับคำถามที่ลูกค้าสงสัยมากที่สุดไว้ที่นี่
        </p>
      </div>

      {/* [MOD] ลบ Background Panel ที่ไม่จำเป็นออก เพื่อให้ดีไซน์คลีนขึ้น */}
      <div className="mx-auto mt-16 w-full max-w-4xl">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              // [MOD] ปรับสไตล์ Accordion Item ให้มีเงา, ขอบมน, และพื้นหลังสี card
              className="bg-card rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* [MOD] ปรับโครงสร้าง Trigger ทั้งหมด */}
              <AccordionTrigger className="group text-foreground flex w-full items-center justify-between p-4 text-left font-semibold hover:no-underline sm:p-6 sm:text-lg">
                <span className="flex-1 pr-4">{faq.q}</span>
                {/* [ADD] สร้างปุ่มวงกลมพร้อมไอคอนที่เปลี่ยนตามสถานะ */}
                <div className="bg-primary relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  <Minus className="text-primary-foreground absolute h-5 w-5 opacity-0 transition-all duration-300 group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-100" />
                  <Plus className="text-primary-foreground absolute h-5 w-5 transition-all duration-300 group-data-[state=open]:-rotate-90 group-data-[state=open]:opacity-0" />
                </div>
              </AccordionTrigger>
              {/* [MOD] ปรับ Padding ของ Content */}
              <AccordionContent className="text-muted-foreground px-6 pt-0 pb-6 text-base">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FaqSection;
