"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

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
  user_id?: string | null;
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

const statuses = ["all", "pending", "processing", "completed", "cancelled"];

function statusMessage(status: string, orderId: string) {
  const shortId = orderId.slice(0, 8).toUpperCase();

  if (status === "processing") {
    return `Your order #${shortId} is now being processed. Ressential is preparing your handmade items.`;
  }

  if (status === "completed") {
    return `Your order #${shortId} has been completed. Thank you for choosing Ressential.`;
  }

  if (status === "cancelled") {
    return `Your order #${shortId} has been cancelled. Please contact Ressential if you need more information.`;
  }

  return `Your order #${shortId} status has been updated to ${status}.`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  async function updateStatus(order: Order, status: string) {
    setUpdatingId(order.id);

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);

    if (error) {
      setUpdatingId(null);
      alert(error.message);
      return;
    }

    if (order.user_id) {
      await supabase.from("messages").insert({
        user_id: order.user_id,
        user_email: order.customer_email,
        sender: "admin",
        subject: `Order #${order.id.slice(0, 8).toUpperCase()} status update`,
        message: statusMessage(status, order.id),
        is_read: false,
      });
    }

    try {
      const response = await fetch("/api/send-status-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderId: order.id,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Status email API error:", result);
        alert("Status changed, but email was not sent. Check console.");
      } else {
        console.log("Status email sent:", result);
      }
    } catch (emailError) {
      console.error("Status email failed:", emailError);
      alert("Status changed, but email request failed.");
    }

    setUpdatingId(null);
    await loadOrders();
  }

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <AdminNavbar />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          Admin Dashboard
        </p>

        <h1 className="text-4xl font-semibold md:text-6xl">
          Customer Orders
        </h1>

        <div className="mt-8 flex flex-wrap gap-3">
          {statuses.map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                filter === value
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#d8c7b4] bg-white text-[#2b211d]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-10 rounded-[2rem] bg-white p-10 text-center">
            Loading orders...
          </div>
        )}

        {!loading && filteredOrders.length === 0 && (
          <div className="mt-10 rounded-[2rem] bg-white p-10 text-center">
            No orders found.
          </div>
        )}

        <div className="mt-10 space-y-6">
          {filteredOrders.map((order) => {
            const isOpen = openOrderId === order.id;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-[2rem] border border-[#e4d2bd] bg-white shadow-sm"
              >
                <div className="grid gap-6 p-6 md:grid-cols-[1fr_1fr_260px] md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {order.customer_name || "Guest Customer"}
                    </h2>

                    <p className="mt-2 text-sm text-[#6f625b]">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#6f625b]">
                      {order.customer_email}
                    </p>

                    <p className="mt-1 text-sm text-[#6f625b]">
                      {order.customer_phone}
                    </p>

                    <p className="mt-3 text-xl font-semibold">
                      €{Number(order.total).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => updateStatus(order, e.target.value)}
                      className="rounded-full border border-[#ddd0c0] bg-white px-5 py-3 text-sm font-semibold outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => setOpenOrderId(isOpen ? null : order.id)}
                      className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                    >
                      {isOpen ? "Hide Details" : "Order Details"}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-[#eadccc] bg-[#fbf7f1] p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">
                          Customer & Delivery Details
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
                          <p>
                            <strong>Name:</strong> {order.customer_name}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.customer_email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {order.customer_phone}
                          </p>
                          <p>
                            <strong>Country:</strong> {order.country}
                          </p>
                          <p>
                            <strong>City:</strong> {order.city}
                          </p>
                          <p>
                            <strong>Address:</strong> {order.address}
                          </p>
                          {order.notes && (
                            <p>
                              <strong>Notes:</strong> {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">
                          Ordered Products
                        </h3>

                        <div className="mt-5 space-y-4">
                          {order.items?.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="rounded-2xl border border-[#eadccc] p-4"
                            >
                              <div className="flex gap-4">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-20 w-20 rounded-xl object-cover"
                                  />
                                )}

                                <div className="flex-1">
                                  <p className="font-semibold">{item.name}</p>

                                  <p className="mt-1 text-sm text-[#6f625b]">
                                    Qty: {item.quantity} × €
                                    {Number(item.price).toFixed(2)}
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
                                    <p className="mt-2 whitespace-pre-line rounded-xl bg-[#f8f3ed] p-3 text-sm text-[#6f625b]">
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
      </section>
    </main>
  );
}