"use client";

import { FormEvent, useEffect, useState } from "react";
import { CartItem, clearCart, getCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import CustomerNavbar from "@/components/CustomerMenu";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    country: "Cyprus",
    city: "",
    address: "",
    postal_code: "",
    notes: "",
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your basket is empty.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const orderPayload = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      country: form.country,
      city: form.city,
      address: `${form.address}${form.postal_code ? `, ${form.postal_code}` : ""}`,
      notes: form.notes,
      user_id: userData.user?.id ?? null,
      items: cart,
      total: subtotal,
      status: "pending",
    };

    const { error } = await supabase.from("orders").insert(orderPayload);

    if (error) {
      setLoading(false);
      console.error(error);
      alert("Something went wrong. Please try again.");
      return;
    }

    try {
      await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customer_name,
          customerEmail: form.customer_email,
          total: subtotal,
          items: cart,
          address: form.address,
          city: form.city,
          country: form.country,
        }),
      });
    } catch (emailError) {
      console.error("Order email failed:", emailError);
    }

    setLoading(false);
    clearCart();
    window.dispatchEvent(new Event("cart-updated"));

    alert("Your order request has been submitted successfully.");
    window.location.href = "/order-success";
  }

  return (
    <main className="min-h-screen bg-[#f4f0eb] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 text-center text-sm text-[#6f625b]">
          Cart <span className="mx-2">›</span>
          <strong className="text-[#2b211d]">Place Order</strong>
          <span className="mx-2">›</span>
          Payment <span className="mx-2">›</span>
          Complete
        </div>

        <div className="mb-5 border border-[#b7d7c0] bg-[#f1fbf4] px-5 py-4 text-sm font-semibold text-[#166534]">
          ✓ Secure order request • Payment method will be confirmed after review
        </div>

        {cart.length === 0 ? (
          <div className="mx-auto max-w-2xl bg-white p-10 text-center">
            <h1 className="text-4xl font-semibold">Your basket is empty</h1>
            <a
              href="/shop"
              className="mt-8 inline-block rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Return to Shop
            </a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="space-y-5">
              <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8">
                <h1 className="text-3xl font-bold">Shipping Address</h1>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input
                    required
                    placeholder="Full Name*"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email Address*"
                    value={form.customer_email}
                    onChange={(e) =>
                      setForm({ ...form, customer_email: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <input
                    required
                    placeholder="Phone Number*"
                    value={form.customer_phone}
                    onChange={(e) =>
                      setForm({ ...form, customer_phone: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <select
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  >
                    <option value="Cyprus">Cyprus</option>
                    <option value="Greece">Greece</option>
                  </select>

                  <input
                    required
                    placeholder="City*"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <input
                    placeholder="Post / Zip Code"
                    value={form.postal_code}
                    onChange={(e) =>
                      setForm({ ...form, postal_code: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none"
                  />

                  <textarea
                    required
                    rows={4}
                    placeholder="Address Line*"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="border border-[#ddd0c0] px-5 py-4 outline-none md:col-span-2"
                  />
                </div>

                <textarea
                  rows={4}
                  placeholder="Order notes / delivery notes / special instructions"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-4 w-full border border-[#ddd0c0] px-5 py-4 outline-none"
                />

                <div className="mt-6 border-t border-[#eadccc] pt-5 text-sm text-[#6f625b]">
                  <p>✓ Your information is used only for this order request.</p>
                  <p className="mt-2">
                    ✓ Final shipping and payment details will be confirmed before payment.
                  </p>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="mt-8 hidden w-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60 md:block"
                >
                  {loading ? "Submitting..." : "Submit Order Request"}
                </button>
              </form>

              <div className="bg-white p-5 md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Order Details</h2>
                  <p className="text-sm font-semibold">
                    View {totalItems} item{totalItems > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.color || ""}-${item.templateDescription || ""}`}
                      className="grid grid-cols-[90px_1fr] gap-4 border-b border-[#eadccc] pb-4 md:grid-cols-[110px_1fr_120px]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-full bg-[#fbf7f1] object-contain p-2"
                      />

                      <div>
                        <p className="font-semibold">{item.name}</p>

                        <p className="mt-1 text-sm text-[#6f625b]">
                          Qty: {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-sm text-[#6f625b]">
                            Size: {item.size}
                          </p>
                        )}

                        {item.color && (
                          <p className="text-sm text-[#6f625b]">
                            Color: {item.color}
                          </p>
                        )}

                        {item.templateDescription && (
                          <p className="mt-2 rounded-xl bg-[#f8f3ed] p-3 text-sm text-[#6f625b]">
                            Custom Details: {item.templateDescription}
                          </p>
                        )}
                      </div>

                      <p className="col-span-2 text-right font-bold md:col-span-1">
                        €{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="font-semibold">
                    Standard Shipping:{" "}
                    <span className="rounded bg-[#166534] px-2 py-1 text-xs text-white">
                      To be confirmed
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-[#6f625b]">
                    Delivery options and courier costs will be confirmed before final payment.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 md:p-8">
                <h2 className="text-3xl font-bold">Payment Method</h2>

                <div className="mt-5 border border-[#ddd0c0] p-5">
                  <p className="font-semibold">Payment will be added later</p>
                  <p className="mt-2 text-sm text-[#6f625b]">
                    For now, this checkout creates an order request. Payment integration will be activated after the company confirms payment provider, shipping fees and policies.
                  </p>
                </div>
              </div>
            </div>

            <aside className="h-fit bg-white p-6 shadow-sm lg:sticky lg:top-32">
              <h2 className="text-3xl font-bold">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <strong>€{subtotal.toFixed(2)}</strong>
                </div>

                <div className="flex justify-between text-[#6f625b]">
                  <span>Shipping Fee</span>
                  <span>To be confirmed</span>
                </div>

                <div className="border-t border-[#eadccc] pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Estimated Total</span>
                    <strong>€{subtotal.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const formElement = document.querySelector("form");
                  formElement?.requestSubmit();
                }}
                disabled={loading}
                className="mt-8 w-full bg-[#2b211d] px-6 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60"
              >
                {loading ? "Submitting..." : `Submit Order (${totalItems})`}
              </button>

              <div className="mt-6 space-y-4 border-t border-[#eadccc] pt-6 text-sm text-[#6f625b]">
                <p>✓ Secure order request</p>
                <p>✓ Handmade items prepared with care</p>
                <p>✓ Customer support through messages</p>
                <p>✓ Payment confirmation will follow later</p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-[800] border-t border-[#eadccc] bg-white p-3 md:hidden">
          <button
            onClick={() => {
              const formElement = document.querySelector("form");
              formElement?.requestSubmit();
            }}
            disabled={loading}
            className="block w-full bg-[#2b211d] px-5 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60"
          >
            {loading ? "Submitting..." : `Submit Order • €${subtotal.toFixed(2)}`}
          </button>
        </div>
      )}
    </main>
  );
}