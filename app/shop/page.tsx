"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import CustomerNavbar from "@/components/CustomerMenu";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useSearchParams } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  price: number;
  size: string | null;
  image: string;
  images: string[] | null;
  description: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
};

const colorOptions = [
  "White",
  "Black",
  "Gold",
  "Silver",
  "Pink",
  "Blue",
  "Green",
  "Custom / Other",
];

function ProductCard({ product }: { product: Product }) {
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [imageIndex, setImageIndex] = useState(0);
  const [favoriteActive, setFavoriteActive] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const [templateDescription, setTemplateDescription] = useState("");

  useEffect(() => {
    setFavoriteActive(isFavorite(product.id));
  }, [product.id]);

  function nextImage() {
    setImageIndex((prev) => (prev + 1) % productImages.length);
  }

  function previousImage() {
    setImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  }

  function handleFavorite() {
    const active = toggleFavorite({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: productImages[0],
      category: product.category,
      size: product.size || "",
    });

    setFavoriteActive(active);
  }

  function handleAddToBasket() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: productImages[0],
      quantity,
      size: product.size || "",
      color: selectedColor,
      templateDescription,
    });

    setModalOpen(false);
    alert(`${product.name} added to basket`);
  }

  return (
    <>
      <div className="group bg-white">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f3eee8]">
          <a href={`/products/${product.slug}`}>
            <img
              src={productImages[imageIndex]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </a>

          <button
            onClick={handleFavorite}
            className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-3 py-2 text-lg shadow"
            aria-label="Toggle favorite"
          >
            {favoriteActive ? "♥" : "♡"}
          </button>

          {product.badge && (
            <span className="absolute left-2 top-2 bg-[#f3bfd2] px-2 py-1 text-[10px] font-medium">
              {product.badge}
            </span>
          )}

          {productImages.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg shadow"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg shadow"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="px-2 py-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#b08a5b]">
            {product.category}
          </p>

          <a href={`/products/${product.slug}`}>
            <h3 className="mt-2 min-h-[42px] text-xs font-semibold leading-5 text-[#2b211d] md:text-sm">
              {product.name}
            </h3>
          </a>

          {product.size && (
            <p className="mt-1 text-[11px] text-[#6f625b]">{product.size}</p>
          )}

          <p className="mt-1 text-sm font-semibold">€{Number(product.price)}</p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 w-full rounded-full bg-[#2b211d] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white"
          >
            Add to Basket
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:grid-cols-[320px_1fr] md:p-10">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-2xl"
              aria-label="Close"
            >
              ×
            </button>

            <div>
              <img
                src={productImages[imageIndex]}
                alt={product.name}
                className="h-[360px] w-full rounded-[1.5rem] object-cover"
              />

              {productImages.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {productImages.map((image, index) => (
                    <button key={image} onClick={() => setImageIndex(index)}>
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className={`h-24 w-full rounded-xl object-cover ${
                          imageIndex === index ? "ring-2 ring-[#2b211d]" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 md:mt-0 md:pl-10">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                {product.category}
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#2b211d]">
                {product.name}
              </h2>

              <p className="mt-4 text-2xl font-bold">
                €{Number(product.price)}
              </p>

              {product.size && (
                <p className="mt-2 text-sm text-[#6f625b]">
                  Size: <strong>{product.size}</strong>
                </p>
              )}

              <p className="mt-4 text-[#6f625b]">{product.description}</p>

              <div className="mt-8">
                <label className="mb-2 block text-sm font-semibold">
                  Select Color
                </label>

                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                >
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Describe Template / Custom Details
                </label>

                <textarea
                  rows={4}
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Example: I want gold flakes, white base, name Maria..."
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  Quantity
                </label>

                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#ddd0c0]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3"
                  >
                    -
                  </button>

                  <span className="px-5 py-3">{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToBasket}
                className="mt-8 w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

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

    if (searchQuery) {
      filtered = filtered.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.description,
          product.badge,
          product.size,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchQuery);
      });
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
  }, [products, selectedCategory, sortOption, bestSellerOnly, searchQuery]);

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-7xl px-3 py-8 md:px-6 md:py-14">
        <div className="text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#b08a5b] md:text-sm">
            Ressential Shop
          </p>

          <h1 className="text-3xl font-semibold md:text-6xl">
            All handmade products
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#6f625b] md:text-base">
            Browse handmade resin art, soy candles, gifts and custom creations.
          </p>
        </div>

        <div className="sticky top-[65px] z-40 mt-8 border-y border-[#eadccc] bg-[#f8f3ed]/95 py-3 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-[#ddd0c0] bg-white px-3 py-3 text-xs outline-none md:text-sm"
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
              className="border border-[#ddd0c0] bg-white px-3 py-3 text-xs outline-none md:text-sm"
            >
              <option value="default">Sort by</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>

            <button
              onClick={() => setBestSellerOnly(!bestSellerOnly)}
              className={`col-span-2 border px-3 py-3 text-xs font-semibold uppercase tracking-widest md:col-span-1 ${
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
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 lg:grid-cols-5">
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f3ed] p-10 text-center">
          Loading shop...
        </main>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

