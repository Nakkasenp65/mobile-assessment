"use client";

import React, { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// [MOD] ปรับปรุงข้อมูลรีวิวให้เข้ากับดีไซน์ใหม่
const reviews = [
  {
    img: "https://i.pravatar.cc/150?img=1",
    name: "คุณสมหญิง",
    handle: "@somying_k",
    text: "ประทับใจความเป็นมืออาชีพและความใส่ใจในรายละเอียดมากๆ เลยค่ะ",
  },
  {
    img: "https://i.pravatar.cc/150?img=2",
    name: "คุณกรกนก",
    handle: "@kornkanok_p",
    text: "ประสบการณ์ราบรื่นไร้ที่ติเลยค่ะ ตั้งแต่ต้นจนจบ แนะนำเลย!",
  },
  {
    img: "https://i.pravatar.cc/150?img=3",
    name: "คุณเจนวิทย์",
    handle: "@jane_witt",
    text: "เชื่อถือได้และไว้วางใจได้จริงๆ ทำให้ชีวิตผมง่ายขึ้นเยอะเลยครับ",
  },
  {
    img: "https://i.pravatar.cc/150?img=4",
    name: "คุณธนพล",
    handle: "@thanapon.p",
    text: "ให้ราคายุติธรรม บริการรวดเร็วมาก ไม่ต้องรอนาน ได้เงินสดทันที ชอบมากครับ",
  },
  {
    img: "https://i.pravatar.cc/150?img=5",
    name: "คุณอารยา",
    handle: "@araya.s",
    text: "ขั้นตอนไม่ยุ่งยากเลยค่ะ แค่ประเมินราคาออนไลน์แล้วไปที่สาขา สะดวกมากๆ",
  },
];

// [ADD] Component สำหรับปุ่ม Dot ด้านล่าง
const DotButton = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "h-2 rounded-full transition-all duration-300",
      selected ? "bg-foreground w-6" : "w-2 bg-slate-300 dark:bg-zinc-600",
    )}
    type="button"
    onClick={onClick}
  />
);

const ReviewsSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  // [ADD] State สำหรับจัดการ Carousel API และ Dot Indicators
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => api && api.scrollTo(index),
    [api],
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
            Testimonial
          </p>
          <h2 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            ลูกค้าพูดถึงเรา
          </h2>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ loop: true, align: "start" }}
          className="mt-16 w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="my-4 -ml-6">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-6 md:basis-1/2 lg:basis-1/3"
              >
                {/* [MOD] การ์ดรีวิวดีไซน์ใหม่ทั้งหมด */}
                <Card className="from-secondary/5 via-card to-card flex h-full flex-col rounded-3xl rounded-bl-[75px] border-none bg-gradient-to-br p-8 shadow-sm">
                  <CardContent className="flex h-full flex-col p-0">
                    <Quote className="h-10 w-10 text-slate-200 dark:text-zinc-700" />
                    <p className="text-foreground mt-6 flex-grow text-lg font-medium">
                      {review.text}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <img
                        src={review.img}
                        alt={review.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-foreground font-bold">
                          {review.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {review.handle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* [DEL] ลบลูกศรซ้าย-ขวาออก */}
        </Carousel>

        {/* [ADD] Dot Indicators */}
        <div className="mt-10 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
