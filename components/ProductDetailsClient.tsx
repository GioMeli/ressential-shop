"use client";

import { useState } from "react";
import CustomerNavbar from "@/components/CustomerMenu";
import { addToCart } from "@/lib/cart";

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

  const tabs = [
    { key: "description", label: "Description", value: product.description },
    { key: "details", label: "Details", value: product.details },
    { key: "ingredients", label: "Ingredients", value: product.ingredients },
    { key: "how_to_use", label: "How To Use", value: product.how_to_use },
  ].filter((tab) => tab.value && tab.value.trim() !== "");

  const [selectedImage, setSelectedImage] = useState(productImages[0]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [customText, setCustomText] = useState("");
  const [customNote, setCustomNote] = useState("");

  function handleAddToBasket() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: productImages[0],
      quantity,
      size: product.size || "",
      color: product.is_customizable ? selectedColor : "",
      templateDescription: product.is_customizable
        ? [customText, customNote].filter(Boolean).join(" | ")
        : "",
    });

    alert(`${product.name} added to basket`);
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-[#e4d2bd] bg-white p-3 shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-[420px] w-full rounded-[1.5rem] object-cover md:h-[620px]"
            />
          </div>

          {productImages.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {productImages.map((image) => (
                <button key={image} onClick={() => setSelectedImage(image)}>
                  <img
                    src={image}
                    alt={product.name}
                    className={`h-24 w-full rounded-xl object-cover md:h-32 ${
                      selectedImage === image ? "ring-2 ring-[#2b211d]" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">
            {product.name}
          </h1>

          {product.badge && (
            <span className="mt-4 inline-block rounded-full bg-[#ead8cf] px-4 py-2 text-xs font-semibold uppercase tracking-widest">
              {product.badge}
            </span>
          )}

          <p className="mt-5 text-3xl font-bold">
            €{Number(product.price).toFixed(2)}
          </p>

          {product.size && (
            <p className="mt-3 text-[#6f625b]">
              Size: <strong>{product.size}</strong>
            </p>
          )}

          {product.short_description && (
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f625b]">
              {product.short_description}
            </p>
          )}

          {product.is_customizable && (
            <div className="mt-8 rounded-[2rem] border border-[#eadccc] bg-white p-6">
              <h2 className="text-2xl font-semibold">Customize your product</h2>

              {product.allow_custom_text && (
                <div className="mt-5">
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
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold">
                    Color choice
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

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  {product.custom_note_label || "Custom note"}
                </label>
                <textarea
                  rows={4}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Write any special details..."
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-8">
            <label className="mb-2 block text-sm font-semibold">Quantity</label>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#ddd0c0] bg-white">
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
            className="mt-8 w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white md:w-auto"
          >
            Add to Basket
          </button>

          {tabs.length > 0 && (
            <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 border-b border-[#eadccc] pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                      activeTab === tab.key
                        ? "bg-[#2b211d] text-white"
                        : "bg-[#f8f3ed] text-[#2b211d]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 whitespace-pre-line leading-8 text-[#6f625b]">
                {tabs.find((tab) => tab.key === activeTab)?.value}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}