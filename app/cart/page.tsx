"use client";

import { useEffect, useState } from "react";
import { CartItem, getCart, removeFromCart } from "@/lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleRemove(id: string) {
    removeFromCart(id);
    setCart(getCart());
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="border-b border-[#e7d8c6] bg-[#f8f3ed]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold">
            Ressential ✨
          </a>

          <a
            href="/shop"
            className="rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Continue Shopping
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-5xl font-semibold md:text-7xl">Your Basket</h1>

        {cart.length === 0 ? (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
            <h2 className="text-3xl font-semibold">Your basket is empty</h2>
            <a href="/shop" className="mt-6 inline-block underline">
              Go to shop
            </a>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color || "default"}`}
                  className="flex gap-5 rounded-[2rem] bg-white p-5 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-32 w-32 rounded-[1.5rem] object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">{item.name}</h2>
                      <p className="mt-2 text-[#6f625b]">
                        Quantity: {item.quantity}
                      </p>
                      {item.color && (
                        <p className="text-[#6f625b]">Color: {item.color}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-left text-sm font-semibold uppercase tracking-widest text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-xl font-bold">
                    €{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-semibold">Order Summary</h2>

              <div className="mt-6 flex justify-between text-lg">
                <span>Total</span>
                <strong>€{total}</strong>
              </div>

              <a
                href="/checkout"
                className="mt-8 block rounded-full bg-[#2b211d] px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white"
              >
                Proceed to Checkout
              </a>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}