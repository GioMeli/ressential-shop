"use client";

import { useEffect, useState } from "react";

const tags = [
  "Birthday Gifts",
  "Wedding Gifts",
  "Baptism Keepsakes",
  "Home Decor",
  "Custom Names",
  "Premium Packaging",
];

export default function OccasionTagsSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % tags.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  function previous() {
    setIndex((prev) => (prev === 0 ? tags.length - 1 : prev - 1));
  }

  function next() {
    setIndex((prev) => (prev + 1) % tags.length);
  }

  return (
    <section className="w-full border-y border-[#eadccc] bg-white py-4 md:py-6">
      <div className="mx-auto max-w-[1700px] px-4">
        {/* Desktop */}
        <div className="hidden items-center justify-center gap-4 lg:flex">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/shop?search=${encodeURIComponent(tag)}`}
              className="rounded-full border border-[#d8c5b6] bg-[#faf7f3] px-10 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2b211d] transition hover:bg-[#2b211d] hover:text-white"
            >
              {tag}
            </a>
          ))}
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-center lg:hidden">

          <a
            href={`/shop?search=${encodeURIComponent(tags[index])}`}
            className="min-w-[260px] rounded-full border border-[#d8c5b6] bg-[#faf7f3] px-8 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2b211d]"
          >
            {tags[index]}
          </a>

        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2 lg:hidden">
          {tags.map((_, dotIndex) => (
            <span
              key={dotIndex}
              className={`h-1 rounded-full transition ${
                dotIndex === index
                  ? "w-10 bg-[#2b211d]"
                  : "w-5 bg-[#d8c5b6]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}