"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  price: number;
  image: string;
  description: string | null;
  badge: string | null;
  is_best_seller: boolean;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [bestSellerOnly, setBestSellerOnly] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading products:", error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategory
      );
    }

    if (bestSellerOnly) {
      filtered = filtered.filter((product) => product.is_best_seller);
    }

    if (sortOption === "low-high") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "high-low") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [products, selectedCategory, sortOption, bestSellerOnly]);

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="border-b border-[#e7d8c6] bg-[#f8f3ed]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold tracking-wide">
            Ressential ✨
          </a>

          <a
            href="/"
            className="rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Back Home
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          Ressential Shop
        </p>

        <h1 className="text-5xl font-semibold md:text-7xl">
          All handmade products
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6f625b]">
          Browse all available creations and filter by category, price and best
          sellers.
        </p>

        <div className="mt-12 rounded-[2rem] border border-[#e7d8c6] bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-widest text-[#6f625b]">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#fdfaf7] px-5 py-4 outline-none transition focus:border-[#2b211d]"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-widest text-[#6f625b]">
                Sort By
              </label>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#fdfaf7] px-5 py-4 outline-none transition focus:border-[#2b211d]"
              >
                <option value="default">Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setBestSellerOnly(!bestSellerOnly)}
                className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold uppercase tracking-widest transition ${
                  bestSellerOnly
                    ? "bg-[#2b211d] text-white"
                    : "border border-[#ddd0c0] bg-[#fdfaf7] text-[#2b211d]"
                }`}
              >
                {bestSellerOnly
                  ? "Showing Best Sellers"
                  : "Best Sellers Only"}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-16 rounded-[2rem] border border-[#e4d2bd] bg-white p-10 text-center">
            <h2 className="text-3xl font-semibold">Loading products...</h2>
          </div>
        )}

        {!loading && (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-[2.5rem] border border-[#e4d2bd] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  {product.badge && (
                    <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2b211d] shadow">
                      {product.badge}
                    </div>
                  )}
                </div>

                <div className="p-7">
                  <p className="mb-2 text-sm uppercase tracking-[0.25em] text-[#b08a5b]">
                    {product.category}
                  </p>

                  <h3 className="text-3xl font-semibold text-[#2b211d]">
                    {product.name}
                  </h3>

                  <p className="mt-4 leading-7 text-[#6f625b]">
                    {product.description}
                  </p>

                    <div className="mt-8 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-[#2b211d]">
                                €{Number(product.price)}
                            </span>

                            <a
                                href={`/products/${product.slug}`}
                                className="rounded-full border border-[#2b211d] px-5 py-3 text-sm font-semibold uppercase tracking-widest text-[#2b211d] transition hover:bg-[#2b211d] hover:text-white"
                            >
                                View Product
                            </a>
                        </div>

                        <button
                            onClick={() => {
                                addToCart({
                                    id: product.id,
                                    slug: product.slug,
                                    name: product.name,
                                    price: Number(product.price),
                                    image: product.image,
                                    quantity: 1,
                                });

                                alert(`${product.name} added to basket`);
                            }}
                            className="w-full rounded-full bg-[#2b211d] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:scale-[1.02]"
                        >
                            Add to Basket
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="mt-16 rounded-[2rem] border border-[#e4d2bd] bg-white p-10 text-center">
            <h2 className="text-3xl font-semibold">No products found</h2>
            <p className="mt-3 text-[#6f625b]">
              Try another category or filter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}