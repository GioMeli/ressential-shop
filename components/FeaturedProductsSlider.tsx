"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import T from "@/components/T";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  size: string | null;
  image: string;
  images: string[] | null;
  badge: string | null;
  is_best_seller: boolean;
};

export default function FeaturedProductsSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (data) setProducts(data);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    setFavoriteIds(products.filter((p) => isFavorite(p.id)).map((p) => p.id));
  }, [products]);

  function scrollSlider(direction: "left" | "right") {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "right" ? 520 : -520,
      behavior: "smooth",
    });
  }

  function handleFavorite(product: Product, image: string) {
    const active = toggleFavorite({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image,
      category: product.category,
      size: product.size || "",
    });

    setFavoriteIds((prev) =>
      active
        ? [...prev, product.id]
        : prev.filter((id) => id !== product.id)
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1700px] px-3 md:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            <T text="Featured Products" />
          </p>

          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            <T text="Selected handmade pieces" />
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollSlider("left")}
            className="absolute left-0 top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-lg transition hover:scale-105 md:flex"
            aria-label="Previous products"
          >
            ‹
          </button>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-5 scrollbar-hide md:gap-6 md:px-16"
          >
            {products.map((product) => {
              const productImages =
                product.images && product.images.length > 0
                  ? product.images
                  : [product.image];

              const mainImage = productImages[0];
              const favoriteActive = favoriteIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group min-w-[48%] snap-start bg-white text-center sm:min-w-[42%] md:min-w-[260px] lg:min-w-[300px]"
                >
                  <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-white">
                    <a href={`/products/${product.slug}`} className="h-full w-full">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </a>

                    <button
                      onClick={() => handleFavorite(product, mainImage)}
                      className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-2 text-xl shadow"
                      aria-label="Toggle favorite"
                    >
                      {favoriteActive ? "♥" : "♡"}
                    </button>

                    {product.badge && (
                      <span className="absolute left-3 top-3 bg-[#f3bfd2] px-3 py-1 text-xs font-medium">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="px-2 py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b211d]">
                      {product.category}
                    </p>

                    <a href={`/products/${product.slug}`}>
                      <h3 className="mx-auto mt-2 min-h-[48px] max-w-[260px] text-sm font-medium leading-6 text-[#6f625b] md:text-base">
                        {product.name}
                      </h3>
                    </a>

                    {product.size && (
                      <p className="mt-1 text-xs text-[#8a7b72]">
                        {product.size}
                      </p>
                    )}

                    <p className="mt-3 text-sm font-semibold text-[#2b211d]">
                      €{Number(product.price).toFixed(2)}
                    </p>

                    <button
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          price: Number(product.price),
                          image: mainImage,
                          quantity: 1,
                          size: product.size || "",
                        });

                        alert(`${product.name} added to basket`);
                      }}
                      className="mx-auto mt-4 block rounded-full bg-[#2b211d] px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white"
                    >
                      <T text="Add to Basket" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scrollSlider("right")}
            className="absolute right-0 top-[38%] z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-lg transition hover:scale-105 md:flex"
            aria-label="Next products"
          >
            ›
          </button>
        </div>

        <div className="mt-2 text-center">
          <a
            href="/shop"
            className="inline-block rounded-full border border-[#b08a5b] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
          >
            <T text="View all products" />
          </a>
        </div>
      </div>
    </section>
  );
}