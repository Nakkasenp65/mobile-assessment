import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  <section>
    <div className="mx-auto flex flex-col p-4 text-center md:p-16">
      <h2 className="mb-4 text-3xl font-bold">คำถามที่พบบ่อย</h2>
      <p className="text-muted-foreground mb-12 text-sm md:text-lg">
        คำตอบสำหรับคำถามที่ลูกค้าสงสัยมากที่สุด
      </p>
      <Accordion
        type="single"
        collapsible
        className="mx-auto w-full max-w-3xl text-left"
      >
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className="bg-card border-border mb-4 rounded-xl shadow-lg"
          >
            <AccordionTrigger className="p-4 text-sm font-bold hover:no-underline md:p-6 md:text-lg">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground p-6 pt-0 text-base">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
