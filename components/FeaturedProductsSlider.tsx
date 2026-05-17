"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

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
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setProducts(data);
    }

    loadProducts();
  }, []);

  function next() {
    setStartIndex((prev) => (prev + 1) % Math.max(products.length, 1));
  }

  function previous() {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(products.length - 1, 0) : prev - 1
    );
  }

  if (products.length === 0) return null;

  const visibleProducts = [
    ...products.slice(startIndex),
    ...products.slice(0, startIndex),
  ].slice(0, 5);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Featured Products
          </p>

          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Selected handmade pieces
          </h2>
        </div>

        <a href="/shop" className="hidden text-sm font-semibold underline md:block">
          View all
        </a>
      </div>

      <div className="relative">
        <button
          onClick={previous}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:flex"
        >
          ‹
        </button>

        <div className="flex gap-3 overflow-x-auto scroll-smooth pb-4 md:grid md:grid-cols-5 md:overflow-visible md:px-12">
          {visibleProducts.map((product) => {
            const productImages =
              product.images && product.images.length > 0
                ? product.images
                : [product.image];
            
            const favoriteActive = isFavorite(product.id);

            return (
              <div
                key={product.id}
                className="group min-w-[68%] overflow-hidden rounded-[1.4rem] bg-white shadow-sm sm:min-w-[42%] md:min-w-0"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eee8]">
                  <a href={`/products/${product.slug}`}>
                    <img
                      src={productImages[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </a>

                  <button
                    onClick={() =>
                        toggleFavorite({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: Number(product.price),
                        image: productImages[0],
                        category: product.category,
                        size: product.size || "",
                        })
                    }
                    className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-2 text-lg shadow"
                  >
                    {favoriteActive ? "♥" : "♡"}
                  </button>

                  {product.badge && (
                    <span className="absolute left-3 top-3 bg-[#ead8cf] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#b08a5b]">
                    {product.category}
                  </p>

                  <a href={`/products/${product.slug}`}>
                    <h3 className="mt-2 min-h-[42px] text-xs font-semibold leading-5 md:text-sm">
                      {product.name}
                    </h3>
                  </a>

                  {product.size && (
                    <p className="mt-1 text-[11px] text-[#6f625b]">
                      {product.size}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-semibold">
                    €{Number(product.price)}
                  </p>

                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: Number(product.price),
                        image: productImages[0],
                        quantity: 1,
                        size: product.size || "",
                      });

                      alert(`${product.name} added to basket`);
                    }}
                    className="mt-3 w-full rounded-full bg-[#2b211d] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:flex"
        >
          ›
        </button>
      </div>
    </section>
  );
}