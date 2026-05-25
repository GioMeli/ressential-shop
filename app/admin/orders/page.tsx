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
  notes: string | null;
  admin_notes: string | null;
  tracking_note: string | null;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

const statuses = ["all", "pending", "processing", "completed", "cancelled"];

function statusMessage(status: string, orderId: string, customMessage?: string) {
  const shortId = orderId.slice(0, 8).toUpperCase();

  if (customMessage && customMessage.trim()) {
    return customMessage.trim();
  }

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

function statusClass(status: string) {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "processing") return "bg-yellow-100 text-yellow-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-[#f3ebe3] text-[#2b211d]";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [trackingNotes, setTrackingNotes] = useState<Record<string, string>>({});
  const [customerMessages, setCustomerMessages] = useState<Record<string, string>>({});

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

      const notesMap: Record<string, string> = {};
      const trackingMap: Record<string, string> = {};
      const messageMap: Record<string, string> = {};

      data.forEach((order: Order) => {
        notesMap[order.id] = order.admin_notes || "";
        trackingMap[order.id] = order.tracking_note || "";
        messageMap[order.id] = "";
      });

      setAdminNotes(notesMap);
      setTrackingNotes(trackingMap);
      setCustomerMessages(messageMap);
    }

    setLoading(false);
  }

  async function saveOrderNotes(orderId: string) {
    setSavingNotesId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({
        admin_notes: adminNotes[orderId] || null,
        tracking_note: trackingNotes[orderId] || null,
      })
      .eq("id", orderId);

    setSavingNotesId(null);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Order notes saved.");
    await loadOrders();
  }

  async function updateStatus(order: Order, status: string) {
    setUpdatingId(order.id);

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        admin_notes: adminNotes[order.id] || order.admin_notes || null,
        tracking_note: trackingNotes[order.id] || order.tracking_note || null,
      })
      .eq("id", order.id);

    if (error) {
      setUpdatingId(null);
      alert(error.message);
      return;
    }

    const messageText = statusMessage(status, order.id, customerMessages[order.id]);

    if (order.user_id) {
      await supabase.from("messages").insert({
        user_id: order.user_id,
        user_email: order.customer_email,
        sender: "admin",
        subject: `Order #${order.id.slice(0, 8).toUpperCase()} status update`,
        message: messageText,
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
          customMessage: customerMessages[order.id] || "",
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
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <AdminNavbar />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          Admin Dashboard
        </p>

        <h1 className="text-4xl font-semibold md:text-6xl">Customer Orders</h1>

        <p className="mt-4 max-w-3xl text-[#6f625b]">
          Manage customer orders, review custom product details, update status,
          save internal notes and notify customers.
        </p>

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
            const shortId = order.id.slice(0, 8).toUpperCase();

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-[2rem] border border-[#e4d2bd] bg-white shadow-sm"
              >
                <div className="grid gap-6 p-6 md:grid-cols-[1fr_1fr_280px] md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                      Order #{shortId}
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      {order.customer_name || "Guest Customer"}
                    </h2>

                    <p className="mt-2 text-sm text-[#6f625b]">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="break-all text-sm text-[#6f625b]">
                      {order.customer_email}
                    </p>

                    <p className="mt-1 text-sm text-[#6f625b]">
                      {order.customer_phone}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="text-xl font-semibold">
                        €{Number(order.total).toFixed(2)}
                      </p>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
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
                              <strong>Customer Notes:</strong> {order.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">Ordered Products</h3>

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
                                    className="h-20 w-20 rounded-xl object-contain"
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
                                      <strong>Custom Details:</strong>{" "}
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

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">Admin Notes</h3>
                        <p className="mt-2 text-sm text-[#6f625b]">
                          Internal notes only. Customers cannot see this.
                        </p>

                        <textarea
                          rows={6}
                          value={adminNotes[order.id] || ""}
                          onChange={(e) =>
                            setAdminNotes({
                              ...adminNotes,
                              [order.id]: e.target.value,
                            })
                          }
                          placeholder="Example: Customer requested gold ribbon. Confirm courier price before payment."
                          className="mt-4 w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                        />
                      </div>

                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">
                          Tracking / Delivery Note
                        </h3>
                        <p className="mt-2 text-sm text-[#6f625b]">
                          Placeholder for courier, tracking number or delivery remarks.
                        </p>

                        <textarea
                          rows={6}
                          value={trackingNotes[order.id] || ""}
                          onChange={(e) =>
                            setTrackingNotes({
                              ...trackingNotes,
                              [order.id]: e.target.value,
                            })
                          }
                          placeholder="Example: ACS tracking CY123456789. Delivery expected Friday."
                          className="mt-4 w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                        />
                      </div>

                      <div className="rounded-[1.5rem] bg-white p-6">
                        <h3 className="text-xl font-semibold">
                          Customer Status Message
                        </h3>
                        <p className="mt-2 text-sm text-[#6f625b]">
                          Optional. This will be sent with the next status update.
                        </p>

                        <textarea
                          rows={6}
                          value={customerMessages[order.id] || ""}
                          onChange={(e) =>
                            setCustomerMessages({
                              ...customerMessages,
                              [order.id]: e.target.value,
                            })
                          }
                          placeholder="Example: Your handmade piece is being prepared and we will contact you soon for payment details."
                          className="mt-4 w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-end">
                      <button
                        onClick={() => saveOrderNotes(order.id)}
                        disabled={savingNotesId === order.id}
                        className="rounded-full border border-[#b08a5b] px-6 py-4 text-xs font-semibold uppercase tracking-widest"
                      >
                        {savingNotesId === order.id ? "Saving..." : "Save Notes"}
                      </button>

                      <a
                        href={`mailto:${order.customer_email}`}
                        className="rounded-full bg-[#2b211d] px-6 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white"
                      >
                        Email Customer
                      </a>
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
