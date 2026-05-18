"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[] | null;
  size: string | null;
};

export default function GoodPriceSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .lte("price", 20)
        .order("price", { ascending: true });

      if (data) setProducts(data);
    }

    loadProducts();
  }, []);

  function scrollSlider() {
    sliderRef.current?.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-[#fbf7f1] py-8 md:py-12">
      <div className="mx-auto max-w-[1700px] px-3 md:px-8">
        <div className="rounded-[1.8rem] bg-[#ead8cf] p-4 md:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold md:text-4xl">
              <span className="text-[#d94f4f]">G</span>ood Price
            </h2>

            <button
              onClick={scrollSlider}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl shadow-md"
              aria-label="Next good price products"
            >
              ›
            </button>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-3 scrollbar-hide md:gap-5"
          >
            {products.map((product) => {
              const productImages =
                product.images && product.images.length > 0
                  ? product.images
                  : [product.image];

              return (
                <div
                  key={product.id}
                  className="min-w-[48%] rounded-[1.2rem] bg-white p-3 shadow-sm sm:min-w-[38%] md:min-w-[260px] lg:min-w-[300px]"
                >
                  <a href={`/products/${product.slug}`}>
                    <img
                      src={productImages[0]}
                      alt={product.name}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </a>

                  <div className="pt-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#b08a5b]">
                      {product.category}
                    </p>

                    <h3 className="mt-1 line-clamp-2 min-h-[42px] text-sm font-semibold">
                      {product.name}
                    </h3>

                    {product.size && (
                      <p className="mt-1 text-xs text-[#6f625b]">
                        {product.size}
                      </p>
                    )}

                    <p className="mt-2 text-2xl font-bold text-[#2b211d]">
                      €{Number(product.price).toFixed(2)}
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
                      className="mt-3 w-full rounded-full bg-[#2b211d] px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}