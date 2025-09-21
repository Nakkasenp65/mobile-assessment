import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    img: "https://i.pravatar.cc/150?img=1",
    name: "By 096467xxxx",
    text: "กดประเมินจากเว็บมา ขายจริงหน้าร้านสาขาเซ็นทรัลเวิลด์ ได้ราคาดีจริงๆค่ะ ให้บริการดีเลยค่ะ",
  },
  {
    img: "https://i.pravatar.cc/150?img=2",
    name: "By 096467xxxx",
    text: "พี่ๆหน้าร้าน สาขาเซ็นทรัลเวิลด์ บริการดีมากเลยค่ะ ง่าย ไว ชัวร์ ตามที่บอกเลยค่ะ ประทับใจมาก",
  },
  {
    img: "https://i.pravatar.cc/150?img=3",
    name: "By 096467xxxx",
    text: "เห็นมาจาก FB Page เห็นมีหน้าร้าน เชื่อถือได้ เลยมาขายที่หน้าร้าน บริการเร็ว ได้เงินทันที",
  },
  {
    img: "https://i.pravatar.cc/150?img=4",
    name: "By 096467xxxx",
    text: "ชอบตั้งแต่ได้คุยกับแอดมินในเพจ ให้คำแนะนำดี ไม่ต้องรอนาน ชัดเจนรู้เรื่องที่จะคุยกับไรบวก",
  },
];

const ReviewsSection = () => (
  <section className="bg-white">
    <div className="mx-auto flex flex-col p-16 text-center">
      <h2 className="mb-4 text-3xl font-bold">ลูกค้าพูดถึงเรา</h2>
      <p className="text-muted-foreground mb-12 text-sm md:text-lg">
        ความคิดเห็นจากลูกค้าที่ใช้บริการของเรา
      </p>
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {reviews.map((review, index) => (
            <CarouselItem
              key={index}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="card-section h-full rounded-2xl shadow-lg">
                <CardContent className="flex flex-col p-2 md:p-6">
                  <div className="mb-2 flex items-center gap-4 md:mb-4">
                    <img
                      src={review.img}
                      alt="Customer"
                      className="h-16 w-16 rounded-full border-2 border-pink-200"
                    />
                    <div className="flex flex-col items-start justify-start">
                      <div className="text-xl text-yellow-500 drop-shadow-md drop-shadow-amber-200 md:text-2xl">
                        ★★★★★
                      </div>

                      <h5 className="text-secondary text-sm font-bold md:text-base">
                        {review.name}
                      </h5>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-base">
                    “{review.text}”
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  </section>
);

export default ReviewsSection;
