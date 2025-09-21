const features = [
  {
    icon: "https://applehouseth.com/images/icons/retail_feature_icon.png",
    title: "น่าเชื่อถือ ชัวร์",
    desc: "ไว้ใจได้ หมดปัญหาโดนโกง มีหน้าร้านสาขาทั่วไทย",
  },
  {
    icon: "https://applehouseth.com/images/icons/phone_feature_icon.png",
    title: "ง่าย ชัวร์",
    desc: "เพียง 3 ขั้นตอนง่ายๆ ประเมิน > นัดหมาย > รับเงินทันที",
  },
  {
    icon: "https://applehouseth.com/images/icons/payment_feature_icon.png",
    title: "ให้สูง ชัวร์",
    desc: "รับซื้อราคาสูง ยุติธรรมไม่กดราคา",
  },
  {
    icon: "https://applehouseth.com/images/icons/driver_feature_icon.png",
    title: "สะดวก ชัวร์",
    desc: "บริการรับซื้อถึงที่ ฟรี ไม่มีค่าใช้จ่าย",
  },
];

const WhyUsSection = () => (
  <section>
    <div className="mx-auto flex flex-col p-16 text-center">
      <h2 className="mb-12 text-3xl font-bold">
        ขาย iPhone กับ Ok Mobile ดียังไง ?
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-8 text-center shadow-lg transition-transform hover:-translate-y-2"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="mx-auto mb-6 h-20 w-20"
            />
            <h4 className="text-secondary mb-2 text-xl font-bold">
              {feature.title}
            </h4>
            <p className="text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUsSection;
