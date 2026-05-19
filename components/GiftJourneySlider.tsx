"use client";

import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Choose",
    text: "Select the handmade product that fits the occasion.",
  },
  {
    number: "02",
    title: "Personalize",
    text: "Add names, colors, dates or special details.",
  },
  {
    number: "03",
    title: "Gift",
    text: "Receive a meaningful creation ready to offer.",
  },
];

export default function GiftJourneySlider() {
  const [index, setIndex] = useState(0);

  function previous() {
    setIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  }

  function next() {
    setIndex((prev) => (prev + 1) % steps.length);
  }

  const visibleSteps = [
    steps[index],
    steps[(index + 1) % steps.length],
    steps[(index + 2) % steps.length],
  ];

  return (
    <section className="w-full bg-[#f6eee7] py-8 md:py-12">
      <div className="relative mx-auto max-w-[1700px] px-4 md:px-8">
        <button
          onClick={previous}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-md"
          aria-label="Previous step"
        >
          ‹
        </button>

        <div className="mx-auto max-w-6xl px-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#b08a5b] md:text-xs">
            Your handmade gift journey
          </p>

          <h2 className="mt-3 text-2xl font-semibold md:text-5xl">
            From idea to meaningful gift
          </h2>

          {/* MOBILE */}
            <div className="mt-7 md:hidden">
            <div className="rounded-[1.5rem] border border-[#eadccc] bg-white/90 p-6 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.3em] text-[#b08a5b]">
                {steps[index].number}
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                {steps[index].title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#6f625b]">
                {steps[index].text}
                </p>
            </div>
            </div>

            {/* DESKTOP */}
            <div className="mt-7 hidden gap-3 md:grid md:grid-cols-3">
            {visibleSteps.map((item, position) => (
              <div
                key={`${item.number}-${position}`}
                className={`rounded-[1.5rem] border border-[#eadccc] bg-white/80 p-5 shadow-sm transition md:p-6 ${
                  position === 1 ? "md:scale-105" : "opacity-90"
                }`}
              >
                <p className="text-xs font-semibold tracking-[0.3em] text-[#b08a5b]">
                  {item.number}
                </p>

                <h3 className="mt-3 text-xl font-semibold md:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-6 text-[#6f625b] md:text-sm">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {steps.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1 rounded-full transition ${
                  dotIndex === index ? "w-10 bg-[#b08a5b]" : "w-6 bg-[#d8c7b4]"
                }`}
              />
            ))}
          </div>

          <a
            href="/shop"
            className="mt-6 inline-block rounded-full bg-[#2b211d] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Start Shopping
          </a>
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-md"
          aria-label="Next step"
        >
          ›
        </button>
      </div>
    </section>
  );
}