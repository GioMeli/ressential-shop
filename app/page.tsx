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
import WhyChooseSlider from "@/components/WhyChooseSlider";
import GiftJourneySlider from "@/components/GiftJourneySlider";
import BestSellerSlider from "@/components/BestSellerSlider";
import OccasionTagsSlider from "@/components/OccasionTagsSlider";
import T from "@/components/T";

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
  <T text="Birthday Gifts" />,
  <T text="Wedding Gifts" />,
  <T text="Baptism Keepsakes" />,
  <T text="Home Decor" />,
  <T text="Custom Names" />,
  <T text="Premium Packaging" />,
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

      <OccasionTagsSlider />

      <CollectionNameSlider />

      <FeaturedProductsSlider />

      <BestSellerSlider />

      <GoodPriceSlider />

      <WhyChooseSlider />

      <GiftJourneySlider />

      <LuxuryFooter />
    </main>
  );
}