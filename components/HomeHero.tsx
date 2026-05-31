"use client";

import T from "@/components/T";

const quickLinks = ["Birthday Gifts", "Wedding Gifts", "Baptism", "Home Decor"];

export default function HomeHero() {
  return (
    <section className="w-full bg-[#fbf7f1]">
      <div className="w-full border-y border-[#eadccc] bg-white">
        <div className="mx-auto grid max-w-[1800px] items-center gap-4 px-4 py-6 md:grid-cols-[1fr_170px] md:px-10 md:py-8 lg:px-16">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b08a5b] md:text-xs">
              <T text="Ressential Handmade Studio" />
            </p>

            <h1 className="mt-3 max-w-5xl text-2xl font-semibold leading-tight text-[#2b211d] sm:text-3xl md:text-5xl">
              <T text="Handmade gifts with elegant personal details." />
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f625b] md:text-base">
              <T text="Premium resin art, soy candles and personalized creations for
              meaningful moments." />
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/shop"
                className="rounded-full bg-[#2b211d] px-7 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-white"
              >
                <T text="Shop" />
              </a>

              <a
                href="/custom"
                className="rounded-full border border-[#b08a5b] px-7 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-[#2b211d]"
              >
                <T text="Custom" />
              </a>
            </div>
          </div>

          <div className="hidden justify-self-center md:block">
                        <img
                    src="/images/logo.jpeg"
                    alt="Ressential"
                    className="h-42 w-42 rounded-full border border-[#eadccc] object-cover shadow-md lg:h-50 lg:w-50"
                    />
          </div>
        </div>
      </div>
    </section>
  );
}