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
    <div className="mx-auto mt-16 flex flex-col p-4 text-center md:p-16">
      <h2 className="mb-12 text-xl font-bold md:text-3xl">
        ขาย iPhone กับ Ok Mobile ดียังไง ?
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card-section rounded-2xl text-center shadow-lg transition-transform hover:-translate-y-2 md:p-8"
          >
            <img
              src={feature.icon}
              alt={feature.title}
              className="mx-auto mb-6 h-16 w-16 md:h-20 md:w-20"
            />
            <h4 className="text-secondary text-md mb-2 font-bold md:text-xl">
              {feature.title}
            </h4>
            <p className="text-muted-foreground text-xs md:text-base">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUsSection;
