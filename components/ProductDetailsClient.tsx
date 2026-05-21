"use client";

import { useEffect, useMemo, useState } from "react";
import CustomerNavbar from "@/components/CustomerMenu";
import { addToCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";

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
    const prev = imageIndex === 0 ? productImages.length - 1 : imageIndex - 1;
    changeImage(prev);
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

    alert(`${product.name} added to basket`);
  }

  return (
    <main className="min-h-screen bg-white text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6 text-sm text-[#6f625b]">
          <a href="/" className="hover:text-[#2b211d]">Home</a>
          <span className="mx-2">›</span>
          <a href="/shop" className="hover:text-[#2b211d]">Shop</a>
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

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="relative overflow-hidden bg-[#fbf7f1]">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-[420px] w-full object-contain p-4 md:h-[680px]"
              />

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-md"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl shadow-md"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => changeImage(index)}
                    className={`min-w-[90px] overflow-hidden border bg-white md:min-w-[120px] ${
                      selectedImage === image
                        ? "border-[#2b211d]"
                        : "border-[#eadccc]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-24 w-full object-cover md:h-32"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="rounded-full bg-[#ead8cf] px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                  {product.badge}
                </span>
              )}

              {product.is_best_seller && (
                <span className="rounded-full bg-[#2b211d] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
                  Best Seller
                </span>
              )}

              {product.is_customizable && (
                <span className="rounded-full border border-[#b08a5b] px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                  Customizable
                </span>
              )}
            </div>

            <p className="mt-6 text-3xl font-bold">
              €{Number(product.price).toFixed(2)}
            </p>

            {product.size && (
              <p className="mt-3 text-sm text-[#6f625b]">
                Size: <strong>{product.size}</strong>
              </p>
            )}

            {product.short_description && (
              <p className="mt-6 max-w-xl text-base leading-8 text-[#6f625b]">
                {product.short_description}
              </p>
            )}

            {product.is_customizable && (
              <div className="mt-8 border border-[#eadccc] bg-[#fbf7f1] p-6">
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
                      className="w-full border border-[#ddd0c0] bg-white px-5 py-4 outline-none"
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
                      className="w-full border border-[#ddd0c0] bg-white px-5 py-4 outline-none"
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
                    className="w-full border border-[#ddd0c0] bg-white px-5 py-4 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-[#ddd0c0] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-4"
                >
                  -
                </button>

                <span className="px-5 py-4">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-4"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToBasket}
                className="flex-1 rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                Add to Basket
              </button>
            </div>

            {tabs.length > 0 && (
              <div className="mt-10 border border-[#eadccc] bg-white">
                <div className="flex overflow-x-auto border-b border-[#eadccc]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`min-w-fit px-5 py-4 text-xs font-semibold uppercase tracking-widest ${
                        activeTab === tab.key
                          ? "bg-[#2b211d] text-white"
                          : "bg-white text-[#2b211d]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="whitespace-pre-line p-6 leading-8 text-[#6f625b]">
                  {tabs.find((tab) => tab.key === activeTab)?.value}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#eadccc] pt-10">
            <div className="mb-8 text-center">
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
                  <a key={item.id} href={`/products/${item.slug}`} className="bg-white">
                    <div className="aspect-[3/4] bg-[#fbf7f1]">
                      <img
                        src={image}
                        alt={item.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>

                    <div className="py-4 text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#b08a5b]">
                        {item.category}
                      </p>
                      <h3 className="mt-2 text-sm font-semibold text-[#6f625b]">
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