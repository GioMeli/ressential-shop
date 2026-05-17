"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  created_at: string;
};

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(userData.user.email ?? null);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(data || []);
      }

      setLoading(false);
    }

    loadAccount();
  }, []);

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
            Back to Shop
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          My Account
        </p>

        <h1 className="text-5xl font-semibold md:text-7xl">My Orders</h1>

        <p className="mt-5 text-[#6f625b]">
          Logged in as: <strong>{email}</strong>
        </p>

        {loading && (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
            Loading orders...
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
            <h2 className="text-3xl font-semibold">No orders yet</h2>
            <a href="/shop" className="mt-6 inline-block underline">
              Start shopping
            </a>
          </div>
        )}

        <div className="mt-12 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-[2rem] border border-[#e4d2bd] bg-white p-7 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#b08a5b]">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    €{Number(order.total)}
                  </h2>

                  <p className="mt-2 text-[#6f625b]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-6 border-t border-[#eee] pt-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between py-2 text-[#6f625b]"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>€{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}