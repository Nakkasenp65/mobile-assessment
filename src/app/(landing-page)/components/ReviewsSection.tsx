// src/app/(landing-page)/components/ReviewsSection.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useReview } from "@/hooks/useReview"; // Adjust the import path as needed
import Image from "next/image";

// Dot button component remains the same
const DotButton = ({ selected, onClick }: { selected: boolean; onClick: () => void }) => (
  <button
    className={cn(
      "h-2 rounded-full transition-all duration-300",
      selected ? "bg-foreground w-6" : "w-2 bg-slate-300 dark:bg-zinc-600",
    )}
    type="button"
    onClick={onClick}
  />
);

export default function ReviewsSection() {
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  // State for carousel API and dot indicators remains the same
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fetch data using the custom hook
  const { data, isLoading, isError, error } = useReview();

  console.log("review data", data);

  const scrollTo = useCallback((index: number) => api && api.scrollTo(index), [api]);

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

  // Handle Loading State
  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  // Handle Error State
  if (isError) {
    return (
      <section className="py-20">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Failed to load reviews: {error.message}</p>
        </div>
      </section>
    );
  }

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
            {/* Map over the fetched reviews data */}
            {data?.reviews.map((review, index) => (
              <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <Card className="from-secondary/5 via-card to-card flex h-full flex-col rounded-3xl rounded-bl-[75px] border-none bg-gradient-to-br p-8 shadow-sm">
                  <CardContent className="flex h-full flex-col p-0">
                    <Quote className="h-10 w-10 text-slate-200 dark:text-zinc-700" />
                    <p className="text-foreground mt-6 flex-grow text-lg font-medium">
                      {review.text}
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                      <Image
                        src={review.profilePhotoUrl}
                        alt={review.author}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-foreground font-bold">{review.author}</h4>
                        <p className="text-muted-foreground text-sm">{review.timeDescription}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
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
}
