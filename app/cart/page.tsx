"use client";

import { useEffect, useState } from "react";
import { CartItem, getCart, removeFromCart } from "@/lib/cart";
import CustomerNavbar from "@/components/CustomerMenu";
import T from "@/components/T";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleRemove(id: string) {
    removeFromCart(id);
    setCart(getCart());
    window.dispatchEvent(new Event("cart-updated"));
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 text-center text-sm text-[#6f625b]">
          <T text="Cart" /> <span className="mx-2">›</span>
          <strong className="text-[#2b211d]">Place Order</strong>
          <span className="mx-2">›</span>
          <T text="Payment" /> <span className="mx-2">›</span>
          <T text="Complete" />
        </div>

        <div className="mb-5 border border-[#b7d7c0] bg-[#f1fbf4] px-5 py-4 text-sm font-semibold text-[#166534]">
          <T text="✓ Secure handmade checkout • Order request before payment" />
        </div>

        {cart.length === 0 ? (
          <div className="mx-auto max-w-2xl bg-white p-10 text-center">
            <h1 className="text-4xl font-semibold"><T text="Your basket is empty" /></h1>
            <p className="mt-4 text-[#6f625b]">
              <T text="Explore handmade gifts, candles and custom creations." />
            </p>
            <a
              href="/shop"
              className="mt-8 inline-block rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              <T text="Start Shopping" />
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="bg-white px-5 py-5">
                <h1 className="text-2xl font-bold md:text-3xl">
                  <T text="All Items" /> ({totalItems})
                </h1>
              </div>

              <div className="mt-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.color || ""}-${item.templateDescription || ""}`}
                    className="bg-white p-4 md:p-5"
                  >
                    <div className="grid grid-cols-[110px_1fr] gap-4 md:grid-cols-[140px_1fr_130px] md:items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-full bg-[#fbf7f1] object-contain p-2 md:h-36"
                      />

                      <div>
                        <h2 className="text-base font-semibold md:text-xl">
                          {item.name}
                        </h2>

                        <div className="mt-3 space-y-1 text-sm text-[#6f625b]">
                          <p>Quantity: {item.quantity}</p>

                          {item.size && <p>Size: {item.size}</p>}

                          {item.color && <p>Color: {item.color}</p>}

                          {item.templateDescription && (
                            <p className="mt-2 rounded-xl bg-[#f8f3ed] p-3">
                              <T text="Custom Details:" /> {item.templateDescription}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="mt-4 text-xs font-semibold uppercase tracking-widest text-red-700"
                        >
                          <T text="Remove" />
                        </button>
                      </div>

                      <div className="col-span-2 text-right md:col-span-1">
                        <p className="text-lg font-bold">
                          €{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <p className="mt-1 text-xs text-[#8a7b72]">
                          €{Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 bg-white p-5">
                <p className="font-semibold"><T text="Standard Delivery" /></p>
                <p className="mt-2 text-sm text-[#6f625b]">
                  <T text="Delivery cost and courier options will be confirmed before final payment." />
                </p>
              </div>
            </div>

            <aside className="h-fit bg-white p-6 shadow-sm lg:sticky lg:top-32">
              <h2 className="text-2xl font-bold"><T text="Order Summary" /></h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span><T text="Subtotal" /> ({totalItems} items)</span>
                  <strong>€{subtotal.toFixed(2)}</strong>
                </div>

                <div className="flex justify-between text-[#6f625b]">
                  <span>Shipping</span>
                  <span>Calculated later</span>
                </div>

                <div className="border-t border-[#eadccc] pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold"><T text="Estimated Total" /></span>
                    <strong>€{subtotal.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <a
                href="/checkout"
                className="mt-8 block bg-[#2b211d] px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white"
              >
                <T text="Checkout Now" /> ({totalItems})
              </a>

              <div className="mt-6 space-y-4 border-t border-[#eadccc] pt-6 text-sm text-[#6f625b]">
                <p><T text="✓ Secure order request" /></p>
                <p><T text="✓ Handmade products prepared with care" /></p>
                <p><T text="✓ Customer support through messages" /></p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-[800] border-t border-[#eadccc] bg-white p-3 md:hidden">
          <a
            href="/checkout"
            className="block bg-[#2b211d] px-5 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white"
          >
            <T text="Checkout" /> ({totalItems}) • €{subtotal.toFixed(2)}
          </a>
        </div>
      )}
    </main>
  );
}