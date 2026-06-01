"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerMenu from "@/components/CustomerMenu";
import T from "@/components/T";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  templateDescription?: string;
  image?: string;
};

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  city: string;
  address: string;
  notes: string | null;
  items: OrderItem[];
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

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

      if (ordersData) setOrders(ordersData);

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

  function statusClass(status: string) {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "processing") return "bg-yellow-100 text-yellow-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-[#f3ebe3] text-[#2b211d]";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f3ed]">
        <CustomerMenu />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="rounded-[2rem] bg-white px-10 py-8 text-lg shadow-sm">
            <T text="Loading account..." />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-[1500px] px-4 py-8 md:px-8 md:py-14">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            <T text="My Account" />
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            <T text="Welcome back" />
          </h1>

          <p className="mt-4 max-w-2xl text-[#6f625b]">
            <T text="Manage your profile, track your handmade orders and contact
            Ressential about any request." />
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[390px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-32">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2b211d] text-3xl font-semibold text-white">
                {displayName ? displayName.charAt(0).toUpperCase() : "R"}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold">
                  {displayName || "Customer"}
                </h2>

                <p className="mt-1 break-all text-sm text-[#6f625b]">
                  {email}
                </p>
              </div>
            </div>

            <form onSubmit={updateProfile} className="mt-8 space-y-5">
              <input
                required
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />

              <input
                required
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />

              <input
                disabled
                type="email"
                value={email}
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#efebe7] px-5 py-4 text-[#7b6f67] outline-none"
              />

              <button
                disabled={saving}
                type="submit"
                className="w-full rounded-full bg-[#2b211d] px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </form>

            <div className="mt-8 grid gap-3 border-t border-[#eadccc] pt-8">
              <a
                href="/messages"
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                <T text="Open Messages" />
              </a>

              <a
                href="/favorites"
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                <T text="View Favorites" />
              </a>

              <a
                href="/shop"
                className="rounded-2xl border border-[#ddd0c0] px-5 py-4 text-center text-sm font-semibold"
              >
                <T text="Continue Shopping" />
              </a>
            </div>
          </aside>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 border-b border-[#eadccc] pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
                  <T text="Orders" />
                </p>

                <h2 className="mt-3 text-3xl font-semibold"><T text="My Orders" /></h2>

                <p className="mt-2 text-sm text-[#6f625b]">
                  <T text="Track your order status and review product details." />
                </p>
              </div>

              <a
                href="/shop"
                className="rounded-full border border-[#d8c7b4] px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest"
              >
                <T text="Shop More" />
              </a>
            </div>

            {orders.length === 0 ? (
              <div className="mt-10 rounded-[2rem] bg-[#faf7f3] p-10 text-center">
                <h3 className="text-2xl font-semibold"><T text="No orders yet" /></h3>

                <p className="mt-3 text-[#6f625b]">
                  <T text="Start exploring handmade products." />
                </p>

                <a
                  href="/shop"
                  className="mt-6 inline-block rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
                >
                  <T text="Explore Shop" />
                </a>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {orders.map((order) => {
                  const isOpen = openOrderId === order.id;
                  const shortId = order.id.slice(0, 8).toUpperCase();

                  return (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-[2rem] border border-[#eadccc] bg-[#faf7f3]"
                    >
                      <div className="grid gap-5 p-5 md:grid-cols-[1fr_160px_160px] md:items-center">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                            Order #{shortId}
                          </p>

                          <h3 className="mt-3 text-2xl font-semibold">
                            €{Number(order.total).toFixed(2)}
                          </h3>

                          <p className="mt-2 text-sm text-[#6f625b]">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${statusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <button
                          onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                          className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                        >
                          {isOpen ? "Hide Details" : "View Details"}
                        </button>
                      </div>

                      {isOpen && (
                        <div className="border-t border-[#eadccc] bg-white p-5">
                          <div className="grid gap-5 lg:grid-cols-2">
                            <div className="rounded-[1.5rem] bg-[#fbf7f1] p-5">
                              <h4 className="text-xl font-semibold">
                                <T text="Delivery Details" />
                              </h4>

                              <div className="mt-4 space-y-2 text-sm text-[#6f625b]">
                                <p><strong>Name:</strong> {order.customer_name}</p>
                                <p><strong>Email:</strong> {order.customer_email}</p>
                                <p><strong>Phone:</strong> {order.customer_phone}</p>
                                <p><strong>Country:</strong> {order.country}</p>
                                <p><strong>City:</strong> {order.city}</p>
                                <p><strong>Address:</strong> {order.address}</p>
                                {order.notes && (
                                  <p><strong>Notes:</strong> {order.notes}</p>
                                )}
                              </div>

                              <a
                                href="/messages"
                                className="mt-5 inline-block rounded-full border border-[#b08a5b] px-5 py-3 text-xs font-semibold uppercase tracking-widest"
                              >
                                <T text="Message Administrator" />
                              </a>
                            </div>

                            <div className="rounded-[1.5rem] bg-[#fbf7f1] p-5">
                              <h4 className="text-xl font-semibold">
                                <T text="Products" />
                              </h4>

                              <div className="mt-4 space-y-4">
                                {order.items?.map((item, index) => (
                                  <div
                                    key={`${item.name}-${index}`}
                                    className="rounded-2xl border border-[#eadccc] bg-white p-4"
                                  >
                                    <div className="flex gap-4">
                                      {item.image && (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="h-20 w-20 rounded-xl object-contain"
                                        />
                                      )}

                                      <div className="flex-1">
                                        <p className="font-semibold">
                                          {item.name}
                                        </p>

                                        <p className="mt-1 text-sm text-[#6f625b]">
                                          Qty: {item.quantity} × €
                                          {Number(item.price).toFixed(2)}
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
                                            Custom Details:{" "}
                                            {item.templateDescription}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}