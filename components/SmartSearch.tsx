"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProductResult = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[] | null;
};

const pages = [
  { title: "Shop", href: "/shop", type: "Page" },
  { title: "Custom", href: "/custom", type: "Page" },
  { title: "Favorites", href: "/favorites", type: "Page" },
  { title: "My Orders", href: "/account", type: "Page" },
  { title: "Messages", href: "/messages", type: "Page" },
  { title: "Contact", href: "/contact", type: "Page" },
  { title: "Shipping Information", href: "/shipping", type: "Page" },
  { title: "Returns Policy", href: "/returns", type: "Page" },
];

export default function SmartSearch({ mobile = false }: { mobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [open, setOpen] = useState(false);

  const filteredPages =
    query.trim().length > 1
      ? pages.filter((page) =>
          page.title.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  async function searchProducts() {
    if (query.trim().length < 2) {
      setProducts([]);
      return;
    }

    const value = query.trim();

    const { data } = await supabase
      .from("products")
      .select("id, slug, name, category, price, image, images")
      .eq("is_active", true)
      .or(
        `name.ilike.%${value}%,category.ilike.%${value}%,description.ilike.%${value}%,badge.ilike.%${value}%,size.ilike.%${value}%`
      )
      .limit(6);

    setProducts(data || []);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) return;

    window.location.href = `/shop?search=${encodeURIComponent(query.trim())}`;
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={submitSearch}
        className={`flex items-center border-b border-[#d8c7b4] ${
          mobile ? "px-2 py-3" : "px-2 py-2"
        }`}
      >
        <span className="mr-3 text-xl text-[#8a7b72]">⌕</span>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Search products, categories, pages..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#b8aca5]"
        />
      </form>

      {open && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-full z-[999] mt-3 max-h-[420px] overflow-y-auto rounded-[1.5rem] border border-[#eadccc] bg-white p-4 shadow-2xl">
          {products.length === 0 && filteredPages.length === 0 && (
            <div className="p-4 text-center text-sm text-[#6f625b]">
              No results found. Press Enter to search the shop.
            </div>
          )}

          {products.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                Products
              </p>

              <div className="space-y-3">
                {products.map((product) => {
                  const image =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : product.image;

                  return (
                    <a
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#fbf7f1]"
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#6f625b]">
                          {product.category} • €{Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPages.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                Pages
              </p>

              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <a
                    key={page.href}
                    href={page.href}
                    className="block rounded-xl p-3 text-sm font-semibold transition hover:bg-[#fbf7f1]"
                  >
                    {page.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() =>
              (window.location.href = `/shop?search=${encodeURIComponent(
                query.trim()
              )}`)
            }
            className="mt-5 w-full rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Search all products
          </button>
        </div>
      )}
    </div>
  );
}