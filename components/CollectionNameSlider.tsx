"use client";

import { useState } from "react";

const collections = [
  "Soy Candles",
  "Resin Art",
  "Personalized Gifts",
  "Custom Creations",
  "Wedding",
  "Baptism",
  "Home Decor",
];

export default function CollectionNameSlider() {
  const [index, setIndex] = useState(0);

  const visibleCollections = [
    collections[index],
    collections[(index + 1) % collections.length],
    collections[(index + 2) % collections.length],
  ];

  function previous() {
    setIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
  }

  function next() {
    setIndex((prev) => (prev + 1) % collections.length);
  }

  return (
    <section className="w-full bg-[#ead8cf] py-10 md:py-12">
      <div className="relative mx-auto max-w-[1700px] px-4 md:px-8">
        <button
          onClick={previous}
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-md"
          aria-label="Previous collection"
        >
          ‹
        </button>

        <div className="mx-auto max-w-6xl px-14 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8a5f47]">
            Explore by collection
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center">
            {visibleCollections.map((category, position) => (
              <a
                key={`${category}-${position}`}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={`whitespace-normal text-center font-serif text-[#2b211d] transition hover:text-[#8a5f47] ${
                  position === 1
                    ? "text-4xl md:text-5xl"
                    : "text-3xl opacity-80 md:text-4xl"
                }`}
              >
                {category}
              </a>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {collections.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`h-1 rounded-full transition ${
                  dotIndex === index ? "w-10 bg-white" : "w-6 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-md"
          aria-label="Next collection"
        >
          ›
        </button>
      </div>
    </section>
  );
}