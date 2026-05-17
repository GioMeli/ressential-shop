"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import AuthButtons from "@/components/AuthButtons";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  price: number;
  image: string;
  images: string[] | null;
  description: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
};

function ProductCard({ product }: { product: Product }) {
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [imageIndex, setImageIndex] = useState(0);

  function nextImage() {
    setImageIndex((prev) => (prev + 1) % productImages.length);
  }

  function previousImage() {
    setImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }

  return (
    <div className="group bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eee8]">
        <a href={`/products/${product.slug}`}>
          <img
            src={productImages[imageIndex]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </a>

        {product.badge && (
          <span className="absolute left-3 top-3 bg-[#f3bfd2] px-3 py-1 text-xs font-medium">
            {product.badge}
          </span>
        )}

        {productImages.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg shadow"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="px-2 py-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#b08a5b]">
          {product.category}
        </p>

        <a href={`/products/${product.slug}`}>
          <h3 className="mt-2 min-h-[48px] text-sm font-semibold leading-6 text-[#2b211d] md:text-base">
            {product.name}
          </h3>
        </a>

        <p className="mt-2 text-sm font-semibold">€{Number(product.price)}</p>

        <button
          onClick={() => {
            addToCart({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              image: productImages[0],
              quantity: 1,
            });

            alert(`${product.name} added to basket`);
          }}
          className="mt-3 w-full rounded-full bg-[#2b211d] px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-white"
        >
          Add to Basket
        </button>
      </div>
    </div>
  );
}

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
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
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
      <nav className="sticky top-0 z-50 border-b border-[#e7d8c6] bg-[#f8f3ed]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="text-2xl font-semibold tracking-wide">
            Ressential ✨
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/cart"
              className="rounded-full border border-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Basket
            </a>

            <AuthButtons />
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
            Ressential Shop
          </p>

          <h1 className="text-4xl font-semibold md:text-7xl">
            All handmade products
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[#6f625b]">
            Browse handmade resin art, soy candles, gifts and custom creations.
          </p>
        </div>

        <div className="sticky top-[72px] z-40 mt-8 border-y border-[#eadccc] bg-[#f8f3ed]/95 py-4 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-none border border-[#ddd0c0] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-none border border-[#ddd0c0] bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="default">Sort by</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>

            <button
              onClick={() => setBestSellerOnly(!bestSellerOnly)}
              className={`col-span-2 border px-4 py-3 text-sm font-semibold uppercase tracking-widest md:col-span-1 ${
                bestSellerOnly
                  ? "border-[#2b211d] bg-[#2b211d] text-white"
                  : "border-[#ddd0c0] bg-white text-[#2b211d]"
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
            Loading products...
          </div>
        )}

        {!loading && (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
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