"use client";

import { FormEvent, useEffect, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  user_email: string;
  sender: "user" | "admin";
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  display_name?: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [displayName, setDisplayName] = useState("Customer");

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .single();

    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }

    setLoading(false);
  }

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user?.email) {
      window.location.href = "/login";
      return;
    }

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      user_id: userData.user.id,
      user_email: userData.user.email,
      sender: "user",
      subject: form.subject,
      message: form.message,
      is_read: false,
    });

    setSending(false);

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      subject: "",
      message: "",
    });

    await loadMessages();
    alert("Your message has been sent.");
  }

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSendMessage}
            className="h-fit rounded-[2rem] bg-white p-7 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
              Contact Support
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Send a message
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#6f625b]">
              Send a question about products, custom creations, delivery,
              payment, or your order.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Subject
                </label>

                <input
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Example: Question about custom order"
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>

                <textarea
                  required
                  rows={7}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Write your message..."
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>
            </div>

            <button
              disabled={sending}
              type="submit"
              className="mt-7 w-full rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
              Message Center
            </p>

            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              My Messages
            </h2>

            {loading && (
              <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
                Loading messages...
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
                <h3 className="text-2xl font-semibold">
                  No messages yet
                </h3>

                <p className="mt-3 text-[#6f625b]">
                  Send your first message to Ressential.
                </p>
              </div>
            )}

            <div className="mt-8 space-y-5">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[2rem] border p-6 shadow-sm ${
                    item.sender === "admin"
                      ? "border-[#d6b488] bg-[#fffaf3]"
                      : "border-[#eadccc] bg-white"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row">
                    <div>
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
                          item.sender === "admin"
                            ? "bg-[#2b211d] text-white"
                            : "bg-[#ead8cf] text-[#2b211d]"
                        }`}
                      >
                        {item.sender === "admin"
                          ? "Administrator" 
                          : displayName}
                      </span>

                      <h3 className="mt-4 text-xl font-semibold">
                        {item.subject || "No subject"}
                      </h3>
                    </div>

                    <p className="text-sm text-[#6f625b]">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-5 whitespace-pre-line leading-7 text-[#6f625b]">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}