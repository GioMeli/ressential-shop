"use client";

import { useEffect, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import { FavoriteItem, getFavorites, removeFavorite } from "@/lib/favorites";
import { addToCart } from "@/lib/cart";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  function handleRemove(id: string) {
    removeFavorite(id);
    setFavorites(getFavorites());
  }

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
          Saved Products
        </p>

        <h1 className="mt-3 text-4xl font-semibold md:text-6xl">
          My Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="mt-10 rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No favorites yet</h2>

            <a href="/shop" className="mt-6 inline-block underline">
              Explore products
            </a>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[1.4rem] bg-white shadow-sm"
              >
                <a href={`/products/${product.slug}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </a>

                <div className="p-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#b08a5b]">
                    {product.category}
                  </p>

                  <h3 className="mt-2 min-h-[42px] text-xs font-semibold leading-5 md:text-sm">
                    {product.name}
                  </h3>

                  {product.size && (
                    <p className="mt-1 text-[11px] text-[#6f625b]">
                      {product.size}
                    </p>
                  )}

                  <p className="mt-2 text-sm font-semibold">
                    €{product.price}
                  </p>

                  <button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                        size: product.size || "",
                      })
                    }
                    className="mt-3 w-full rounded-full bg-[#2b211d] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white"
                  >
                    Add to Basket
                  </button>

                  <button
                    onClick={() => handleRemove(product.id)}
                    className="mt-3 text-xs font-semibold uppercase tracking-widest text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}