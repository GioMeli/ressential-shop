"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

export default function BestSellerSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, image, price")
        .eq("is_active", true)
        .eq("is_best_seller", true)
        .limit(10);

      if (data) setProducts(data);
    }

    loadProducts();
  }, []);

  function scrollSlider(direction: "left" | "right") {
    sliderRef.current?.scrollBy({
      left: direction === "right" ? 316 : -316,
      behavior: "smooth",
    });
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-[#f8f3ed] py-8 md:py-10">
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#7b5a4b] via-[#8a6a5a] to-[#b08a72] p-6 text-white shadow-2xl md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#d8b38a]">
              BEST SELLERS
            </p>

            <h2 className="mt-2 text-3xl font-semibold md:text-5xl">
              Most loved creations 🔥
            </h2>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => scrollSlider("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-lg"
            >
              ‹
            </button>

            <button
              onClick={() => scrollSlider("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-3xl text-[#2b211d] shadow-lg"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        >
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug}`}
              className="group min-w-[280px] snap-start rounded-[2rem] bg-white/18 p-4 backdrop-blur-sm transition hover:bg-white/25 md:min-w-[300px]"
            >
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white md:h-28 md:w-28">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b38a]">
                    Premium Piece
                  </p>

                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-white">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-xl font-semibold text-[#f2d7ba]">
                    €{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-3 md:hidden">
          <button
            onClick={() => scrollSlider("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-[#2b211d]"
          >
            ‹
          </button>

          <button
            onClick={() => scrollSlider("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-[#2b211d]"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}