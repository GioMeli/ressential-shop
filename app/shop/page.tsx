"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { addToCart } from "@/lib/cart";
import CustomerNavbar from "@/components/CustomerMenu";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

type Category = {
  id: string;
  title: string;
};

type Subcategory = {
  id: string;
  category_id: string;
  title: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  subcategory_id: string | null;
  price: number;
  size: string | null;
  image: string;
  images: string[] | null;
  description: string | null;
  short_description: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
  is_customizable: boolean;
  allow_custom_text: boolean;
  allow_color_choice: boolean;
  custom_note_label: string | null;
  created_at?: string;
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

  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [customNote, setCustomNote] = useState("");

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

  function addDirectlyToBasket() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: productImages[0],
      quantity: 1,
      size: product.size || "",
      color: "",
      templateDescription: "",
    });

    alert(`${product.name} added to basket`);
  }

  function handleAddCustomToBasket() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: productImages[0],
      quantity,
      size: product.size || "",
      color: product.allow_color_choice ? selectedColor : "",
      templateDescription: [customText, customNote].filter(Boolean).join(" | "),
    });

    setModalOpen(false);
    alert(`${product.name} added to basket`);
  }

  return (
    <>
      <div className="group bg-white text-center">
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          <a href={`/products/${product.slug}`}>
            <img
              src={productImages[imageIndex]}
              alt={product.name}
              className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105 md:p-4"
            />
          </a>

          <button
            onClick={handleFavorite}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg shadow"
            aria-label="Favorite"
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

        <div className="px-2 pb-6 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2b211d]">
            {product.category}
          </p>

          <a href={`/products/${product.slug}`}>
            <h3 className="mx-auto mt-2 min-h-[44px] max-w-[250px] text-sm font-medium leading-6 text-[#6f625b]">
              {product.name}
            </h3>
          </a>

          {product.size && (
            <p className="mt-2 min-h-[18px] text-xs text-[#8a7b72]">
              {product.size}
            </p>
          )}

          <p className="mt-2 text-sm font-semibold text-[#2b211d]">
            €{Number(product.price).toFixed(2)}
          </p>

          <button
            onClick={() =>
              product.is_customizable
                ? setModalOpen(true)
                : addDirectlyToBasket()
            }
            className="mx-auto mt-4 block rounded-full bg-[#2b211d] px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-white md:px-6"
          >
            Add to Basket
          </button>
        </div>
      </div>

      {modalOpen && product.is_customizable && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
          <div className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:grid-cols-[320px_1fr] md:p-10">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-2xl"
            >
              ×
            </button>

            <img
              src={productImages[imageIndex]}
              alt={product.name}
              className="h-[320px] w-full rounded-[1.5rem] object-contain"
            />

            <div className="mt-8 md:mt-0 md:pl-10">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                {product.category}
              </p>

              <h2 className="mt-3 text-3xl font-semibold">{product.name}</h2>

              <p className="mt-4 text-2xl font-bold">
                €{Number(product.price).toFixed(2)}
              </p>

              {product.short_description && (
                <p className="mt-4 text-[#6f625b]">
                  {product.short_description}
                </p>
              )}

              {product.allow_custom_text && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold">
                    Name or phrase
                  </label>

                  <input
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Example: Maria, Love you, 12/06/2026"
                    className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                  />
                </div>
              )}

              {product.allow_color_choice && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold">
                    Select Color
                  </label>

                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                  >
                    <option value="">Select color</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold">
                  {product.custom_note_label || "Custom details"}
                </label>

                <textarea
                  rows={4}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Write any special details..."
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
                onClick={handleAddCustomToBasket}
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

type FiltersProps = {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string;
  selectedSubcategory: string;
  selectedBadge: string;
  minPrice: string;
  maxPrice: string;
  bestSellerOnly: boolean;
  customizableOnly: boolean;
  availableBadges: string[];
  setSelectedCategory: (value: string) => void;
  setSelectedSubcategory: (value: string) => void;
  setSelectedBadge: (value: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setBestSellerOnly: (value: boolean) => void;
  setCustomizableOnly: (value: boolean) => void;
};

function FilterPanel({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
  selectedBadge,
  minPrice,
  maxPrice,
  bestSellerOnly,
  customizableOnly,
  availableBadges,
  setSelectedCategory,
  setSelectedSubcategory,
  setSelectedBadge,
  setMinPrice,
  setMaxPrice,
  setBestSellerOnly,
  setCustomizableOnly,
}: FiltersProps) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(
    selectedCategory !== "all" ? selectedCategory : null
  );

  function clearFilters() {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedBadge("all");
    setMinPrice("");
    setMaxPrice("");
    setBestSellerOnly(false);
    setCustomizableOnly(false);
  }

  return (
    <div className="space-y-0 bg-white">
      <div className="border-b border-[#eadccc] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filters</h2>

          <button
            onClick={clearFilters}
            className="text-xs font-semibold uppercase tracking-widest text-[#b08a5b]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="border-b border-[#eadccc] p-5">
        <p className="mb-4 font-semibold">Categories</p>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubcategory("all");
              setOpenCategoryId(null);
            }}
            className={`block w-full px-3 py-3 text-left text-sm ${
              selectedCategory === "all"
                ? "border-l-2 border-[#b08a5b] bg-[#f8f3ed] font-semibold"
                : "hover:bg-[#f8f3ed]"
            }`}
          >
            All Categories
          </button>

          {categories.map((category) => {
            const categorySubcategories = subcategories.filter(
              (item) => item.category_id === category.id
            );

            const isOpen = openCategoryId === category.id;
            const isSelected = selectedCategory === category.id;

            return (
              <div key={category.id} className="border-b border-[#f0e5d8]">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory("all");
                      setOpenCategoryId(category.id);
                    }}
                    className={`block flex-1 px-3 py-3 text-left text-sm ${
                      isSelected
                        ? "border-l-2 border-[#b08a5b] bg-[#f8f3ed] font-semibold"
                        : "hover:bg-[#f8f3ed]"
                    }`}
                  >
                    {category.title}
                  </button>

                  {categorySubcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCategoryId(isOpen ? null : category.id)
                      }
                      className="px-3 py-3 text-lg"
                      aria-label="Toggle subcategories"
                    >
                      {isOpen ? "−" : "+"}
                    </button>
                  )}
                </div>

                {isOpen && categorySubcategories.length > 0 && (
                  <div className="pb-3 pl-5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory("all");
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm ${
                        selectedCategory === category.id &&
                        selectedSubcategory === "all"
                          ? "font-semibold text-[#2b211d]"
                          : "text-[#6f625b]"
                      }`}
                    >
                      View all {category.title}
                    </button>

                    {categorySubcategories.map((subcategory, index) => (
                      <button
                        key={subcategory.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedSubcategory(subcategory.id);
                        }}
                        className={`block w-full px-4 py-3 text-left text-sm ${
                          selectedSubcategory === subcategory.id
                            ? "font-semibold text-[#2b211d]"
                            : "text-[#6f625b]"
                        } ${index % 2 === 1 ? "bg-[#f1f1f1]" : "bg-white"}`}
                      >
                        {subcategory.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-b border-[#eadccc] p-5">
        <p className="mb-4 font-semibold">Badge</p>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              checked={selectedBadge === "all"}
              onChange={() => setSelectedBadge("all")}
            />
            All Badges
          </label>

          {availableBadges.map((badge) => (
            <label
              key={badge}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                checked={selectedBadge === badge}
                onChange={() => setSelectedBadge(badge)}
              />
              {badge}
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-[#eadccc] p-5">
        <p className="mb-4 font-semibold">Price</p>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-[#ddd0c0] px-4 py-3 text-sm outline-none"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-[#ddd0c0] px-4 py-3 text-sm outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={bestSellerOnly}
            onChange={(e) => setBestSellerOnly(e.target.checked)}
          />
          Best Sellers
        </label>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={customizableOnly}
            onChange={(e) => setCustomizableOnly(e.target.checked)}
          />
          Customizable Products
        </label>
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryQuery = searchParams.get("category") || "";
  const subcategoryQuery = searchParams.get("subcategory") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    categoryQuery || "all"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategoryQuery || "all"
  );

  const [sortOption, setSortOption] = useState("newest");
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setSelectedCategory(categoryQuery || "all");
    setSelectedSubcategory(subcategoryQuery || "all");
  }, [categoryQuery, subcategoryQuery]);

  useEffect(() => {
    async function loadData() {
      const [productsResult, categoriesResult, subcategoriesResult] =
        await Promise.all([
          supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),

          supabase
            .from("categories")
            .select("id, title")
            .eq("is_active", true)
            .order("title", { ascending: true }),

          supabase
            .from("subcategories")
            .select("id, category_id, title")
            .eq("is_active", true)
            .order("title", { ascending: true }),
        ]);

      if (productsResult.data) setProducts(productsResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
      if (subcategoriesResult.data) setSubcategories(subcategoriesResult.data);

      setLoading(false);
    }

    loadData();
  }, []);

  const availableBadges = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.badge)
          .filter((badge): badge is string => Boolean(badge))
      )
    ).sort();
  }, [products]);

  const activeCategory = categories.find((item) => item.id === selectedCategory);
  const activeSubcategory = subcategories.find(
    (item) => item.id === selectedSubcategory
  );

  const pageTitle =
    activeSubcategory?.title ||
    activeCategory?.title ||
    (searchQuery ? `Search: ${searchQuery}` : "All Products");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategory
      );
    }

    if (selectedSubcategory !== "all") {
      filtered = filtered.filter(
        (product) => product.subcategory_id === selectedSubcategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.description,
          product.short_description,
          product.badge,
          product.size,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchQuery);
      });
    }

    if (selectedBadge !== "all") {
      filtered = filtered.filter((product) => product.badge === selectedBadge);
    }

    if (bestSellerOnly) {
      filtered = filtered.filter((product) => product.is_best_seller);
    }

    if (customizableOnly) {
      filtered = filtered.filter((product) => product.is_customizable);
    }

    if (minPrice) {
      filtered = filtered.filter(
        (product) => Number(product.price) >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (product) => Number(product.price) <= Number(maxPrice)
      );
    }

    if (sortOption === "low-high") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "high-low") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "best-sellers") {
      filtered.sort(
        (a, b) => Number(b.is_best_seller) - Number(a.is_best_seller)
      );
    }

    return filtered;
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedBadge,
    sortOption,
    bestSellerOnly,
    customizableOnly,
    minPrice,
    maxPrice,
    searchQuery,
  ]);

  const filtersProps = {
    categories,
    subcategories,
    selectedCategory,
    selectedSubcategory,
    selectedBadge,
    minPrice,
    maxPrice,
    bestSellerOnly,
    customizableOnly,
    availableBadges,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedBadge,
    setMinPrice,
    setMaxPrice,
    setBestSellerOnly,
    setCustomizableOnly,
  };

  return (
    <main className="min-h-screen bg-white text-[#2b211d]">
      <CustomerNavbar />

      <div className="grid lg:grid-cols-[300px_1fr]">
        <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-[#eadccc] bg-white lg:block">
          <FilterPanel {...filtersProps} />
        </aside>

        <section className="min-w-0 px-4 py-0 lg:px-8 lg:py-6">
          <div className="mb-5 hidden items-center justify-between gap-4 lg:flex">
            <div className="text-sm">
              <a href="/" className="font-medium">
                Home
              </a>
              <span className="mx-3">›</span>
              <a href="/shop" className="font-medium">
                Shop
              </a>
              <span className="mx-3">›</span>
              <span>{pageTitle}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="text-sm font-semibold"
              >
                Sort by :{" "}
                {sortOption === "newest"
                  ? "Newest First"
                  : sortOption === "low-high"
                  ? "Price Low to High"
                  : sortOption === "high-low"
                  ? "Price High to Low"
                  : sortOption === "best-sellers"
                  ? "Best Sellers"
                  : "Name"}{" "}
                ⌄
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full z-40 mt-3 w-56 rounded-xl border border-[#eadccc] bg-white p-3 shadow-xl">
                  {[
                    ["newest", "Newest First"],
                    ["low-high", "Price Low to High"],
                    ["high-low", "Price High to Low"],
                    ["best-sellers", "Best Sellers"],
                    ["name", "Name"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortOption(value);
                        setSortOpen(false);
                      }}
                      className="block w-full rounded-lg px-4 py-3 text-left text-sm hover:bg-[#f8f3ed]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-0 flex items-center justify-between border-y border-[#eadccc] py-3 lg:hidden">
            <button
              onClick={() => setSortOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 border-r border-[#eadccc] text-sm"
            >
              ☰ Sort
            </button>

            <button
              onClick={() => setFilterOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 text-sm"
            >
              ⚱ Filter
            </button>
          </div>

          <div className="border-b border-[#eadccc] pb-4 pt-0">
            <h1 className="hidden text-4xl font-semibold text-[#40506b] md:block md:text-6xl">
              {pageTitle}
            </h1>

            <div className="mt-0 bg-[#ead8cf] px-4 py-4 text-center md:mt-5 md:px-5 md:py-6">
              <p className="font-serif text-2xl leading-snug text-[#2b211d] md:text-5xl">
                Handmade pieces for meaningful moments
              </p>
            </div>

            <p className="mt-3 text-sm text-[#6f625b]">
              {filteredProducts.length} products found
            </p>
          </div>

          {loading && (
            <div className="mt-12 rounded-[2rem] bg-[#f8f3ed] p-10 text-center">
              Loading products...
            </div>
          )}

          {!loading && (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="mt-12 rounded-[2rem] bg-[#f8f3ed] p-10 text-center">
              <h2 className="text-3xl font-semibold">No products found</h2>
              <p className="mt-3 text-[#6f625b]">
                Try another category, subcategory or filter.
              </p>
            </div>
          )}
        </section>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 lg:hidden">
          <aside className="h-full w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadccc] p-5">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-2xl">
                ×
              </button>
            </div>

            <FilterPanel {...filtersProps} />

            <div className="p-5">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Show Products
              </button>
            </div>
          </aside>
        </div>
      )}

      {sortOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sort by</h2>
              <button onClick={() => setSortOpen(false)} className="text-2xl">
                ×
              </button>
            </div>

            {[
              ["newest", "Newest First"],
              ["low-high", "Price Low to High"],
              ["high-low", "Price High to Low"],
              ["best-sellers", "Best Sellers"],
              ["name", "Name"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  setSortOption(value);
                  setSortOpen(false);
                }}
                className="block w-full border-b border-[#eadccc] px-4 py-4 text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
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
