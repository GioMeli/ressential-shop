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
    country: "Greece",
    city: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your basket is empty.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const orderPayload = {
      ...form,
      user_id: userData.user?.id ?? null,
      items: cart,
      total,
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
          total,
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
    alert("Your order has been submitted successfully.");
    window.location.href = "/shop";
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="text-5xl font-semibold md:text-7xl">Checkout</h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2.5rem] bg-white p-8 shadow-sm"
          >
            <h2 className="text-3xl font-semibold">Customer Details</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <input
                required
                placeholder="Full Name"
                value={form.customer_name}
                onChange={(e) =>
                  setForm({ ...form, customer_name: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.customer_email}
                onChange={(e) =>
                  setForm({ ...form, customer_email: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <input
                placeholder="Phone Number"
                value={form.customer_phone}
                onChange={(e) =>
                  setForm({ ...form, customer_phone: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <select
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              >
                <option value="Greece">Greece</option>
                <option value="Cyprus">Cyprus</option>
              </select>

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <input
                placeholder="Shipping Address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />
            </div>

            <textarea
              rows={5}
              placeholder="Order notes / customization request"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
              className="mt-6 w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
            />

            <button
              disabled={loading}
              type="submit"
              className="mt-8 w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Order"}
            </button>
          </form>

          <aside className="h-fit rounded-[2.5rem] bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color || "default"}`}
                  className="flex justify-between gap-4 border-b border-[#eee] pb-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-[#6f625b]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    €{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between text-xl">
              <span>Total</span>
              <strong>€{total}</strong>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}