"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user?.email) {
      setEmail(null);
      setMessageCount(0);
      return;
    }

    setEmail(user.email);

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", user.email)
      .single();

    if (!adminData) {
      window.location.href = "/";
      return;
    }

    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender", "user")
      .eq("is_read", false);

    setMessageCount(count || 0);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#fbf7f1] text-[#2b211d] shadow-sm">
        <div className="bg-[#ead8cf] px-4 py-2 text-center text-xs tracking-wide text-[#5b4a42] md:text-sm">
          Ressential Admin Dashboard
        </div>

        <div className="border-b border-[#eadccc]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-3xl md:hidden"
              aria-label="Open admin menu"
            >
              ☰
            </button>

            <a
              href="/admin/orders"
              className="flex items-center gap-3 text-2xl font-semibold tracking-wide md:text-4xl"
            >
              <img
                src="/images/logo.jpeg"
                alt="Ressential logo"
                className="h-10 w-10 rounded-full object-cover md:h-14 md:w-14"
              />
              <span>Ressential</span>
            </a>

            <div className="hidden w-full max-w-xl items-center border-b border-[#d8c7b4] px-2 py-2 md:flex">
              <span className="mr-3 text-xl text-[#8a7b72]">⌕</span>
              <input
                type="text"
                placeholder="Search orders, products, or customers"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#b8aca5]"
              />
            </div>

            <div className="hidden items-center gap-6 text-3xl md:flex">
              <a
                href="/admin/messages"
                title="Messages"
                className="relative leading-none"
              >
                💬
                {messageCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs font-semibold text-white">
                    {messageCount}
                  </span>
                )}
              </a>

              <div className="relative group">
                <button className="leading-none" title="Admin Account">
                  👤
                </button>

                <div className="invisible absolute right-0 top-10 w-72 rounded-2xl border border-[#eadccc] bg-white p-5 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  <h3 className="text-center text-2xl font-semibold">
                    Administrator
                  </h3>

                  <div className="mt-5 space-y-3 text-center">
                    <p className="break-all text-sm text-[#6f625b]">
                      {email}
                    </p>

                    <a
                      href="/admin/orders"
                      className="block rounded-xl border border-[#d8c7b4] px-4 py-3 text-sm font-semibold"
                    >
                      Admin Dashboard
                    </a>

                    <button
                      onClick={logout}
                      className="w-full rounded-xl bg-[#2b211d] px-4 py-3 text-sm font-semibold text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <a href="/admin/messages" className="relative text-2xl md:hidden">
              💬
              {messageCount > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs font-semibold text-white">
                  {messageCount}
                </span>
              )}
            </a>
          </div>
        </div>

        <nav className="hidden border-b border-[#eadccc] md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-6 py-3 text-sm font-medium">
            <a href="/admin/orders" className="hover:text-[#b08a5b]">
              Orders
            </a>

            <a
              href="/admin/messages"
              className="relative hover:text-[#b08a5b]"
            >
              Messages
              {messageCount > 0 && (
                <span className="ml-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs text-white">
                  {messageCount}
                </span>
              )}
            </a>

            <a href="/shop" className="hover:text-[#b08a5b]">
              View Shop
            </a>

            <a href="/" className="hover:text-[#b08a5b]">
              Home
            </a>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/45 md:hidden">
          <aside className="h-full w-[84%] max-w-sm overflow-y-auto bg-[#fbf7f1] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadccc] pb-5">
              <a href="/admin/orders" className="flex items-center gap-3">
                <img
                  src="/images/logo.jpeg"
                  alt="Ressential logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="text-2xl font-semibold">Admin</span>
              </a>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-3xl"
                aria-label="Close admin menu"
              >
                ×
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-5 text-lg">
              <a href="/admin/orders">Orders</a>
              <a href="/admin/messages">Messages ({messageCount})</a>
              <a href="/shop">View Shop</a>
              <a href="/">Home</a>
            </nav>

            {email && (
              <button
                onClick={logout}
                className="mt-8 w-full rounded-full bg-[#2b211d] px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                Logout
              </button>
            )}
          </aside>
        </div>
      )}
    </>
  );
}