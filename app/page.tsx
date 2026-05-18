"use client";

import { useEffect, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";
import { supabase } from "@/lib/supabase";
import CollectionNameSlider from "@/components/CollectionNameSlider";
import HomeHero from "@/components/HomeHero";
import GoodPriceSlider from "@/components/GoodPriceSlider";

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

      <section className="w-full border-b border-[#eadccc] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-center text-xs text-[#5b4a42] md:flex-row md:items-center md:justify-center md:gap-10 md:text-sm">
          <span>✦ Handmade in small batches</span>
          <span>✦ Custom orders available</span>
          <span>✦ Greece & Cyprus focused service</span>
        </div>
      </section>

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

      <section className="w-full bg-white py-10 md:py-14">
        <div className="mx-auto grid max-w-[1600px] gap-5 px-3 md:grid-cols-[1.2fr_0.8fr] md:px-8">
          <div className="rounded-[2rem] bg-[#2b211d] p-7 text-white md:p-12">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d6b488]">
              Custom Studio
            </p>

            <h2 className="mt-4 max-w-4xl text-3xl font-semibold md:text-5xl">
              A future custom design experience built around the customer’s idea.
            </h2>

            <p className="mt-5 max-w-3xl leading-8 text-white/75">
              Customers will be able to choose a product type, describe their
              preferred colors, text, names, dates and special details before
              placing a custom request.
            </p>

            <a
              href="/custom"
              className="mt-7 inline-block rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Preview Custom Page
            </a>
          </div>

          <div className="grid gap-5">
            {[
              ["Premium Finish", "Gold flakes, flowers, glitter and soft luxury details."],
              ["Personalized Meaning", "Names, dates, messages and emotional symbols."],
              ["Gift Ready", "Perfect for birthdays, weddings, baptisms and keepsakes."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[2rem] border border-[#eadccc] bg-[#fbf7f1] p-6"
              >
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-[#6f625b]">{text}</p>
              </div>
            ))}
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

      <footer className="border-t border-[#eadccc] bg-white px-4 py-10">
        <div className="mx-auto grid max-w-[1600px] gap-8 text-sm text-[#6f625b] md:grid-cols-4 md:px-4">
          <div>
            <img
              src="/images/logo.jpeg"
              alt="Ressential logo"
              className="h-16 w-16 rounded-full object-cover"
            />
            <p className="mt-4 leading-7">
              Handmade resin art, soy candles and personalized gifts with
              premium aesthetics.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Shop</h4>
            <div className="mt-4 space-y-2">
              <p><a href="/shop">All Products</a></p>
              <p><a href="/favorites">Favorites</a></p>
              <p><a href="/cart">Basket</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Customer Care</h4>
            <div className="mt-4 space-y-2">
              <p><a href="/account">My Orders</a></p>
              <p><a href="/messages">Messages</a></p>
              <p><a href="/contact">Contact</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Coming Soon</h4>
            <div className="mt-4 space-y-2">
              <p><a href="/custom">Custom Designer</a></p>
              <p>Shipping Information</p>
              <p>Returns Policy</p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#8a7b72]">
          © 2026 Ressential. All rights reserved.
        </p>
      </footer>
    </main>
  );
}