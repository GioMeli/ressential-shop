"use client";

import { useState } from "react";

const benefits = [
  "Handmade Quality",
  "Custom Details",
  "Elegant Gifting",
  "Direct Support",
  "Premium Finish",
  "Made With Emotion",
];

export default function WhyChooseSlider() {
  const [index, setIndex] = useState(0);

  function previous() {
    setIndex((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
  }

  function next() {
    setIndex((prev) => (prev + 1) % benefits.length);
  }

  const visibleBenefits = [
    benefits[index],
    benefits[(index + 1) % benefits.length],
    benefits[(index + 2) % benefits.length],
  ];

  return (
    <section className="w-full bg-[#2b211d] py-10 md:py-12">
      <div className="relative mx-auto max-w-[1700px] px-4 md:px-8">
        <button
          onClick={previous}
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-md"
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="mx-auto max-w-6xl px-14 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d6b488]">
            Why customers choose Ressential
          </p>

          <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-3 md:items-center">
            {visibleBenefits.map((item, position) => (
              <div
                key={`${item}-${position}`}
                className={`font-serif text-white transition ${
                  position === 1
                    ? "text-4xl md:text-5xl"
                    : "text-3xl opacity-75 md:text-4xl"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {benefits.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1 rounded-full transition ${
                  dotIndex === index ? "w-10 bg-[#d6b488]" : "w-6 bg-[#d6b488]/40"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-md"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}