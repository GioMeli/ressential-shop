"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import T from "@/components/T";

type ProductResult = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[] | null;
  size: string | null;
};

type CategoryResult = {
  id: string;
  title: string;
  slug: string;
};

type SubcategoryResult = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
};

const pages = [
  { title: "Home", href: "/", type: "Page" },
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
  const [open, setOpen] = useState(false);

  const [products, setProducts] = useState<ProductResult[]>([]);
  const [categories, setCategories] = useState<CategoryResult[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryResult[]>([]);

  const filteredPages = useMemo(() => {
    if (query.trim().length < 2) return [];

    const value = query.toLowerCase();

    return pages.filter((page) =>
      page.title.toLowerCase().includes(value)
    );
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch();
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  async function runSearch() {
    const value = query.trim();

    if (value.length < 2) {
      setProducts([]);
      setCategories([]);
      setSubcategories([]);
      return;
    }

    const [productsResult, categoriesResult, subcategoriesResult] =
      await Promise.all([
        supabase
          .from("products")
          .select("id, slug, name, category, price, image, images, size")
          .eq("is_active", true)
          .or(
            `name.ilike.%${value}%,category.ilike.%${value}%,description.ilike.%${value}%,short_description.ilike.%${value}%,badge.ilike.%${value}%,size.ilike.%${value}%`
          )
          .limit(6),

        supabase
          .from("categories")
          .select("id, title, slug")
          .eq("is_active", true)
          .ilike("title", `%${value}%`)
          .limit(5),

        supabase
          .from("subcategories")
          .select("id, category_id, title, slug")
          .eq("is_active", true)
          .ilike("title", `%${value}%`)
          .limit(5),
      ]);

    setProducts(productsResult.data || []);
    setCategories(categoriesResult.data || []);
    setSubcategories(subcategoriesResult.data || []);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();

    const value = query.trim();
    if (!value) return;

    window.location.href = `/shop?search=${encodeURIComponent(value)}`;
  }

  const hasResults =
    products.length > 0 ||
    categories.length > 0 ||
    subcategories.length > 0 ||
    filteredPages.length > 0;

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

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="ml-2 text-lg"
          >
            ×
          </button>
        )}
      </form>

      {open && query.trim().length > 1 && (
        <div
          className={`absolute left-0 right-0 top-full z-[999] mt-3 max-h-[430px] overflow-y-auto rounded-[1.5rem] border border-[#eadccc] bg-white p-4 shadow-2xl ${
            mobile ? "max-h-[70vh]" : ""
          }`}
        >
          {!hasResults && (
            <div className="p-4 text-center text-sm text-[#6f625b]">
              <T text="No direct results. Press Enter to search all products." />
            </div>
          )}

          {products.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                <T text="Products" />
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

                        {product.size && (
                          <p className="truncate text-[11px] text-[#8a7b72]">
                            {product.size}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                <T text="Categories" />
              </p>

              <div className="space-y-2">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className="block rounded-xl bg-[#fbf7f1] p-3 text-sm font-semibold transition hover:bg-[#ead8cf]"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {subcategories.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                <T text="Subcategories" />
              </p>

              <div className="space-y-2">
                {subcategories.map((subcategory) => (
                  <a
                    key={subcategory.id}
                    href={`/shop?subcategory=${subcategory.id}`}
                    className="block rounded-xl bg-[#fbf7f1] p-3 text-sm font-semibold transition hover:bg-[#ead8cf]"
                  >
                    {subcategory.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                <T text="Pages" />
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
            <T text="Search all products" />
          </button>
        </div>
      )}
    </div>
  );
}