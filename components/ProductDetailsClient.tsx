"use client";

import { useEffect, useMemo, useState } from "react";
import CustomerNavbar from "@/components/CustomerMenu";
import { addToCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import T from "@/components/T";


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
  details: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
  is_customizable: boolean;
  allow_custom_text: boolean;
  allow_color_choice: boolean;
  custom_note_label: string | null;
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

export default function ProductDetailsClient({ product }: { product: Product }) {
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const tabs = useMemo(
    () =>
      [
        { key: "description", label: "Description", value: product.description },
        { key: "details", label: "Details", value: product.details },
        { key: "ingredients", label: "Ingredients", value: product.ingredients },
        { key: "how_to_use", label: "How To Use", value: product.how_to_use },
      ].filter((tab) => tab.value && tab.value.trim() !== ""),
    [product]
  );

  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

      useEffect(() => {
      if (tabs.length > 0 && !tabs.some((tab) => tab.key === activeTab)) {
        setActiveTab(tabs[0].key);
      }

}, [tabs, activeTab]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [customText, setCustomText] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadRelatedProducts() {
      const query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", product.id)
        .limit(8);

      if (product.subcategory_id) {
        query.eq("subcategory_id", product.subcategory_id);
      } else {
        query.eq("category_id", product.category_id);
      }

      const { data } = await query;
      if (data) setRelatedProducts(data);
    }

    loadRelatedProducts();
  }, [product]);

  function changeImage(index: number) {
    setImageIndex(index);
    setSelectedImage(productImages[index]);
  }

  function nextImage() {
    const next = (imageIndex + 1) % productImages.length;
    changeImage(next);
  }

  function previousImage() {
    const previous =
      imageIndex === 0 ? productImages.length - 1 : imageIndex - 1;
    changeImage(previous);
  }

  function handleAddToBasket() {
    if (product.is_customizable && product.allow_color_choice && !selectedColor) {
      alert("Please select a color before adding to basket.");
      return;
    }

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: selectedImage,
      quantity,
      size: product.size || "",
      color: product.is_customizable ? selectedColor : "",
      templateDescription: product.is_customizable
        ? [customText, customNote].filter(Boolean).join(" | ")
        : "",
    });

    window.dispatchEvent(new Event("cart-updated"));
    alert(`${product.name} added to basket`);
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-[1600px] px-3 py-5 md:px-8 md:py-10">
        <div className="mb-5 hidden text-sm text-[#6f625b] md:block">
          <a href="/" className="hover:text-[#2b211d]">
            Home
          </a>
          <span className="mx-2">›</span>
          <a href="/shop" className="hover:text-[#2b211d]">
            Shop
          </a>
          <span className="mx-2">›</span>
          <a
            href={`/shop?category=${product.category_id}`}
            className="hover:text-[#2b211d]"
          >
            {product.category}
          </a>
          <span className="mx-2">›</span>
          <span className="text-[#2b211d]">{product.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <section className="min-w-0">
            <div className="relative overflow-hidden bg-white shadow-sm">
              <div className="flex aspect-[4/5] items-center justify-center bg-[#fbf7f1] md:aspect-[5/6]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 md:p-8"
                />
              </div>

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-3xl shadow-md"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-3xl shadow-md"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => changeImage(index)}
                    className={`min-w-[78px] overflow-hidden border bg-white md:min-w-[110px] ${
                      selectedImage === image
                        ? "border-[#2b211d]"
                        : "border-[#eadccc]"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-20 w-full object-contain p-1 md:h-28"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="min-w-0 lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white p-5 shadow-sm md:p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#b08a5b]">
                {product.category}
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl xl:text-6xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {product.badge && (
                  <span className="rounded-full bg-[#ead8cf] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest">
                    {product.badge}
                  </span>
                )}

                {product.is_best_seller && (
                  <span className="rounded-full bg-[#2b211d] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white">
                    Best Seller
                  </span>
                )}

                {product.is_customizable && (
                  <span className="rounded-full border border-[#b08a5b] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest">
                    Customizable
                  </span>
                )}
              </div>

              <p className="mt-6 text-3xl font-bold">
                €{Number(product.price).toFixed(2)}
              </p>

              {product.size && (
                <p className="mt-3 text-sm text-[#6f625b]">
                  Size / Details: <strong>{product.size}</strong>
                </p>
              )}

              {product.short_description && (
                <p className="mt-6 text-base leading-8 text-[#6f625b]">
                  {product.short_description}
                </p>
              )}

              <div className="mt-7 grid grid-cols-1 gap-3 border-y border-[#eadccc] py-5 text-sm text-[#6f625b] sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-[#2b211d]">Handmade</p>
                  <p className="mt-1">Prepared with care.</p>
                </div>

                <div>
                  <p className="font-semibold text-[#2b211d]">Custom Care</p>
                  <p className="mt-1">Details reviewed before preparation.</p>
                </div>

                <div>
                  <p className="font-semibold text-[#2b211d]">Support</p>
                  <p className="mt-1">Message admin anytime.</p>
                </div>
              </div>

              {product.is_customizable && (
                <div className="mt-7 bg-[#fbf7f1] p-5 md:p-6">
                  <h2 className="text-2xl font-semibold">
                    Customize your product
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#6f625b]">
                    Add the available custom details below. The admin can contact
                    you if anything needs confirmation.
                  </p>

                  {product.allow_custom_text && (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold">
                        Name or phrase
                      </label>

                      <input
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Example: Maria, Love you, 12/06/2026"
                        className="w-full border border-[#ddd0c0] bg-white px-5 py-4 text-sm outline-none"
                      />
                    </div>
                  )}

                  {product.allow_color_choice && (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold">
                        Color choice
                      </label>

                      <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-full border border-[#ddd0c0] bg-white px-5 py-4 text-sm outline-none"
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

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold">
                      {product.custom_note_label || "Custom note"}
                    </label>

                    <textarea
                      rows={4}
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="Write any special details..."
                      className="w-full resize-none border border-[#ddd0c0] bg-white px-5 py-4 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-7 flex items-center gap-3">
                <div className="flex shrink-0 items-center border border-[#ddd0c0] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-4"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <span className="px-5 py-4">{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-4"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToBasket}
                  className="flex-1 rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:opacity-90"
                >
                  <T text="Add to Basket" />
                </button>
              </div>

              <a
                href="/messages"
                className="mt-4 block rounded-full border border-[#b08a5b] px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest"
              >
                Ask about this product
              </a>
            </div>
          </section>
        </div>

        {tabs.length > 0 && (
          <section className="mt-8 bg-white shadow-sm">
            <div className="flex overflow-x-auto border-b border-[#eadccc]">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`min-w-fit px-5 py-4 text-[11px] font-semibold uppercase tracking-widest md:px-7 ${
                    activeTab === tab.key
                      ? "bg-[#2b211d] text-white"
                      : "bg-white text-[#2b211d]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="whitespace-pre-line p-5 text-sm leading-8 text-[#6f625b] md:p-8 md:text-base">
              {tabs.find((tab) => tab.key === activeTab)?.value || tabs[0]?.value}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-12 border-t border-[#eadccc] pt-10">
            <div className="mb-7 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
                You may also like
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
                Related handmade pieces
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.slice(0, 4).map((item) => {
                const image =
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : item.image;

                return (
                  <a
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="bg-white text-center shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-[#fbf7f1]">
                      <img
                        src={image}
                        alt={item.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>

                    <div className="px-3 py-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#b08a5b]">
                        {item.category}
                      </p>

                      <h3 className="mt-2 min-h-[42px] text-sm font-semibold leading-6 text-[#6f625b]">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm font-bold">
                        €{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
