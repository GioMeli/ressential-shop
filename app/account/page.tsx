"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerMenu from "@/components/CustomerMenu";

type Order = {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadAccount() {
      const { data: authData } = await supabase.auth.getUser();

      const user = authData.user;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || "");
        setFullName(profile.full_name || "");
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      setLoading(false);
    }

    loadAccount();
  }, []);

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        full_name: fullName,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated successfully.");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ed]">
        <CustomerMenu />

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="rounded-[2rem] bg-white px-10 py-8 text-lg shadow-sm">
            Loading account...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            My Account
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            Welcome back
          </h1>

          <p className="mt-4 max-w-2xl text-[#6f625b]">
            Manage your profile information, orders and communication settings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3ebe3] text-3xl font-semibold">
                {displayName
                  ? displayName.charAt(0).toUpperCase()
                  : "R"}
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  {displayName || "Customer"}
                </h2>

                <p className="mt-1 text-sm text-[#6f625b]">
                  {email}
                </p>
              </div>
            </div>

            <form
              onSubmit={updateProfile}
              className="mt-8 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Name
                </label>

                <input
                  required
                  type="text"
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  disabled
                  type="email"
                  value={email}
                  className="w-full rounded-2xl border border-[#ddd0c0] bg-[#efebe7] px-5 py-4 text-[#7b6f67] outline-none"
                />
              </div>

              <button
                disabled={saving}
                type="submit"
                className="w-full rounded-full bg-[#2b211d] px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                {saving
                  ? "Saving..."
                  : "Update Profile"}
              </button>
            </form>

            <div className="mt-8 space-y-3 border-t border-[#eadccc] pt-8">
              <a
                href="/messages"
                className="block rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                Open Messages
              </a>

              <a
                href="/favorites"
                className="block rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                View Favorites
              </a>

              <a
                href="/shop"
                className="block rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                Continue Shopping
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
                  Orders
                </p>

                <h2 className="mt-3 text-3xl font-semibold">
                  My Orders
                </h2>
              </div>

              <a
                href="/shop"
                className="rounded-full border border-[#d8c7b4] px-5 py-3 text-xs font-semibold uppercase tracking-widest"
              >
                Shop More
              </a>
            </div>

            {orders.length === 0 && (
              <div className="mt-10 rounded-[2rem] bg-[#faf7f3] p-10 text-center">
                <h3 className="text-2xl font-semibold">
                  No orders yet
                </h3>

                <p className="mt-3 text-[#6f625b]">
                  Start exploring handmade products.
                </p>

                <a
                  href="/shop"
                  className="mt-6 inline-block rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
                >
                  Explore Shop
                </a>
              </div>
            )}

            {orders.length > 0 && (
              <div className="mt-8 space-y-5">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[2rem] border border-[#eadccc] bg-[#faf7f3] p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                          Order #{order.order_number}
                        </p>

                        <h3 className="mt-3 text-2xl font-semibold">
                          €{Number(order.total).toFixed(2)}
                        </h3>

                        <p className="mt-3 text-sm text-[#6f625b]">
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span
                          className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-[#f3ebe3] text-[#2b211d]"
                          }`}
                        >
                          {order.status}
                        </span>

                        <a
                          href={`/account/orders/${order.id}`}
                          className="text-sm font-semibold underline"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}