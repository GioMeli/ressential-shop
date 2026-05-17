"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerNavbar from "@/components/CustomerMenu";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  templateDescription?: string;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  items: OrderItem[];
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
      <CustomerNavbar />

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
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
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
                    className="rounded-2xl bg-[#faf6f1] p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {item.name} × {item.quantity}
                        </p>

                        {item.size && (
                          <p className="mt-1 text-sm text-[#6f625b]">
                            Size: {item.size}
                          </p>
                        )}

                        {item.color && (
                          <p className="mt-1 text-sm text-[#6f625b]">
                            Color: {item.color}
                          </p>
                        )}

                        {item.templateDescription && (
                          <p className="mt-2 text-sm text-[#6f625b]">
                            Details: {item.templateDescription}
                          </p>
                        )}
                      </div>

                      <span className="font-semibold">
                        €{item.price * item.quantity}
                      </span>
                    </div>
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