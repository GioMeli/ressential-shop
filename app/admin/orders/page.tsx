"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  customer_phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadOrders();
  }, []);

  async function checkAdminAndLoadOrders() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user?.email) {
      window.location.href = "/login";
      return;
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", userData.user.email)
      .single();

    if (!adminData) {
      window.location.href = "/";
      return;
    }

    await loadOrders();
  }

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (!error) {
      loadOrders();
    }
  }

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="border-b border-[#e7d8c6] bg-[#f8f3ed]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold">
            Ressential ✨
          </a>

          <a
            href="/admin/products"
            className="rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Products
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          Admin Dashboard
        </p>

        <h1 className="text-5xl font-semibold md:text-7xl">
          Customer Orders
        </h1>

        <div className="mt-10 flex flex-wrap gap-3">
          {["all", "pending", "processing", "completed"].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                filter === value
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#d8c7b4] text-[#2b211d]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-12 rounded-[2rem] bg-white p-10 text-center">
            Loading orders...
          </div>
        )}

        <div className="mt-12 space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[2rem] border border-[#e4d2bd] bg-white p-7 shadow-sm"
            >
              <div className="grid gap-6 md:grid-cols-[1.2fr_1.2fr_260px] md:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[#b08a5b]">
                    Order #{order.id.slice(0, 8)}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {order.customer_name}
                  </h2>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#6f625b]">
                    Ordered Products
                  </p>

                  <div className="mt-2 space-y-2 text-[#6f625b]">
                    {order.items.map((item, index) => (
                      <div key={`${item.name}-${index}`}>
                        <p>
                          {item.name} × {item.quantity}
                        </p>

                        {item.size && (
                          <p className="text-sm">Size: {item.size}</p>
                        )}

                        {item.color && (
                          <p className="text-sm">Color: {item.color}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span
                    className={`rounded-full px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-2xl border border-[#ddd0c0] px-4 py-3 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() =>
                      setOpenOrderId(openOrderId === order.id ? null : order.id)
                    }
                    className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    Order Details
                  </button>
                </div>
              </div>

              {openOrderId === order.id && (
                <div className="mt-8 rounded-[1.5rem] bg-[#faf6f1] p-6">
                  <h3 className="text-2xl font-semibold">Order Details</h3>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>

                    <p>
                      <strong>Total:</strong> €{Number(order.total)}
                    </p>

                    <p>
                      <strong>Name:</strong> {order.customer_name}
                    </p>

                    <p>
                      <strong>Email:</strong> {order.customer_email}
                    </p>

                    <p>
                      <strong>Phone:</strong> {order.customer_phone || "-"}
                    </p>

                    <p>
                      <strong>Country:</strong> {order.country}
                    </p>

                    <p>
                      <strong>City:</strong> {order.city || "-"}
                    </p>

                    <p>
                      <strong>Address:</strong> {order.address || "-"}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>

                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>

                  {order.notes && (
                    <div className="mt-6 rounded-2xl bg-white p-5">
                      <strong>Customer Notes / General Request:</strong>

                      <p className="mt-2 text-[#6f625b]">{order.notes}</p>
                    </div>
                  )}

                  <div className="mt-6 rounded-2xl bg-white p-5">
                    <strong>Products:</strong>

                    <div className="mt-4 space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.name}-${index}`}
                          className="rounded-2xl border border-[#eee] p-4"
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
                                  Template / Custom Details:{" "}
                                  {item.templateDescription}
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
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}