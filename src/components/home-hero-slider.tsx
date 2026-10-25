"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/brand/593526734_1268684031944594_5008414505073743212_n.jpg",
    title: "Elegant celebration cakes",
    description: "Beautiful handcrafted cakes for birthdays, anniversaries, and sweet family moments.",
  },
  {
    image: "/brand/675438982_1377145581098438_2099959744242678321_n.jpg",
    title: "Made fresh with love",
    description: "Fresh flavors, smooth finishing, and a premium home bakery touch in every order.",
  },
  {
    image: "/brand/726892417_1430068989139430_146306851239618482_n.jpg",
    title: "Custom orders for special days",
    description: "Make every event memorable with customized creamy creations by Alpona.",
  },
];

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-rose-100 backdrop-blur">
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.5rem] bg-rose-50 sm:aspect-[4/3.6]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-700 ${activeIndex === index ? 'translate-x-0 scale-100 opacity-100' : index < activeIndex ? '-translate-x-8 scale-[1.02] opacity-0' : 'translate-x-8 scale-[1.02] opacity-0'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white sm:p-8">
          <div className="max-w-md rounded-3xl bg-black/20 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-100">Freshly made</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{activeSlide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-rose-50/90 sm:text-base">{activeSlide.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/products"><Button className="bg-white text-zinc-900 hover:bg-rose-50">Shop now</Button></Link>
              <a
                href="https://www.facebook.com/share/19mADXz9Yc/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/70 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Order on Facebook
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow transition hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-800 shadow transition hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-rose-500' : 'w-2.5 bg-rose-200 hover:bg-rose-300'}`}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-zinc-500">0{activeIndex + 1} / 0{slides.length}</p>
      </div>
    </div>
  );
}
