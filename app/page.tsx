"use client";

import { useEffect, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { supabase } from "@/lib/supabase";
import CollectionNameSlider from "@/components/CollectionNameSlider";
import HomeHero from "@/components/HomeHero";
import GoodPriceSlider from "@/components/GoodPriceSlider";
import LuxuryFooter from "@/components/LuxuryFooter";
import TrustRotator from "@/components/TrustRotator";

const categoryTiles = [
  {
    title: "Soy Candles",
    text: "Elegant scents and handmade finishing.",
    image: "/images/candle1.jpeg",
    href: "/shop",
  },
  {
    title: "Resin Art",
    text: "Premium pieces with flowers, glitter and gold.",
    image: "/images/resin1.jpeg",
    href: "/shop",
  },
  {
    title: "Personalized Gifts",
    text: "Names, dates and emotional details.",
    image: "/images/gift1.jpeg",
    href: "/shop",
  },
  {
    title: "Custom Creations",
    text: "Design a unique handmade piece.",
    image: "/images/gallery7.jpeg",
    href: "/custom",
  },
];

const quickLinks = [
  "Birthday Gifts",
  "Wedding Gifts",
  "Baptism Keepsakes",
  "Home Decor",
  "Custom Names",
  "Premium Packaging",
];

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function checkWelcomeModal() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const alreadyShown = localStorage.getItem("ressential_welcome_seen");

      if (!alreadyShown) {
        setShowWelcome(true);
        localStorage.setItem("ressential_welcome_seen", "true");
      }
    }

    checkWelcomeModal();
  }, []);

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#2b211d]">
      <CustomerMenu />

      {showWelcome && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute right-5 top-4 text-2xl"
            >
              ×
            </button>

            <img
              src="/images/logo.jpeg"
              alt="Ressential"
              className="mx-auto h-24 w-24 rounded-full object-cover shadow-md"
            />

            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
              Welcome to Ressential
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Handmade luxury creations with emotion and detail.
            </h2>

            <p className="mt-4 leading-7 text-[#6f625b]">
              Explore soy candles, resin art, personalized gifts and custom
              handmade pieces for meaningful moments.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href="/shop"
                className="rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Shop Collection
              </a>

              <a
                href="/custom"
                className="rounded-full border border-[#b08a5b] px-6 py-4 text-xs font-semibold uppercase tracking-widest"
              >
                Create Your Own
              </a>
            </div>
          </div>
        </div>
      )}

      <TrustRotator />

      <HomeHero />

      <section className="w-full bg-white py-5">
        <div className="mx-auto max-w-[1600px] px-3 md:px-8">
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-6 md:overflow-visible">
            {quickLinks.map((item) => (
              <a
                key={item}
                href="/shop"
                className="min-w-[150px] rounded-full border border-[#eadccc] bg-[#fbf7f1] px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#2b211d] transition hover:border-[#2b211d]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <CollectionNameSlider />

      <FeaturedProductsSlider />

      <GoodPriceSlider />

      <section className="w-full bg-[#ead8cf] py-10">
        <div className="mx-auto max-w-[1700px] px-4 md:px-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8a5f47]">
              Your handmade gift journey
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              From idea to meaningful gift
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-3">
            {[
              {
                step: "1",
                title: "Choose",
                text: "Select a handmade product.",
              },
              {
                step: "2",
                title: "Edit",
                text: "Add color, name or details.",
              },
              {
                step: "3",
                title: "Gift",
                text: "Receive a unique creation.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-[1.5rem] bg-white/80 p-4 text-center shadow-sm md:p-6"
              >
                <p className="text-xs font-semibold tracking-[0.3em] text-[#b08a5b]">
                  {item.step}
                </p>

                <h3 className="mt-3 text-lg font-semibold md:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#6f625b] md:text-sm">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 text-center">
            <a
              href="/shop"
              className="inline-block rounded-full bg-[#2b211d] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#fbf7f1] py-10 md:py-14">
        <div className="mx-auto max-w-[1600px] px-3 md:px-8">
          <div className="mb-7 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
              Why customers choose Ressential
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              Handmade, personal, premium.
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["01", "Handmade Quality", "Each creation is prepared with care and attention."],
              ["02", "Custom Options", "Products can include names, colors and personal details."],
              ["03", "Elegant Gifting", "Designed for meaningful occasions and premium presentation."],
              ["04", "Direct Support", "Customers can message the administrator from their account."],
            ].map(([number, title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold tracking-[0.35em] text-[#b08a5b]">
                  {number}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6f625b]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </main>
  );
}