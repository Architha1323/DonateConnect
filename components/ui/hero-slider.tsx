"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { DonateButton } from "@/components/ui/donate-button";

// Find the generated images in the public folder by their prefixes
const slides = [
  {
    image: "/images/slide_1_family_donating_1785047959483.png",
    title: "Empower Communities Together",
    subtitle: "Your donations bring hope and essential support to those in need.",
  },
  {
    image: "/images/slide_2_ngo_volunteers_1785047970283.png",
    title: "Dedicated Volunteers",
    subtitle: "Join hands with our verified NGOs working tirelessly on the ground.",
  },
  {
    image: "/images/slide_3_children_books_1785047980625.png",
    title: "Educate the Future",
    subtitle: "Donating books and school supplies opens doors for countless children.",
  },
  {
    image: "/images/slide_4_elderly_1785048006279.png",
    title: "Care for the Elderly",
    subtitle: "Provide warmth and essentials to the senior members of our society.",
  },
  {
    image: "/images/slide_5_community_drive_1785048016971.png",
    title: "Community Drives",
    subtitle: "Participate in local events to spread joy and share resources.",
  },
  {
    image: "/images/slide_6_sorting_items_1785048028228.png",
    title: "Organized Impact",
    subtitle: "Every item is carefully sorted to ensure quality and dignity.",
  },
  {
    image: "/images/slide_7_food_donation_1785048040944.png",
    title: "Nourish Families",
    subtitle: "Contribute to food banks and help eradicate hunger in your city.",
  },
  {
    image: "/images/slide_8_happy_beneficiaries_1785048061434.png",
    title: "Smiles Guaranteed",
    subtitle: "Experience the authentic joy of giving and changing lives.",
  },
  {
    image: "/images/slide_9_sustainability_1785048072346.png",
    title: "Sustainable Future",
    subtitle: "Reuse and recycle. Give your old items a new, meaningful life.",
  },
  {
    image: "/images/slide_10_ngo_distribution_1785048083559.png",
    title: "Transparent Distribution",
    subtitle: "Track your impact from the moment of pickup to the final smile.",
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    requestAnimationFrame(onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden group">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                      <motion.div
                        key={`content-${index}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                      >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-xl relative z-10">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-lg relative z-10">
                          {slide.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 relative z-10">
                          <DonateButton className="w-full sm:w-auto h-14 px-10 text-[16px] shadow-2xl shadow-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl hover:scale-105 transition-all" />
                          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-10 text-[16px] bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-xl rounded-2xl hover:scale-105 transition-all">
                            <Link href="/ngos"><Search className="mr-2 h-5 w-5" /> Explore NGOs</Link>
                          </Button>
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={scrollNext}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 md:bottom-16 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-primary w-6"
                : "bg-white/50 hover:bg-white/80 w-2"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
