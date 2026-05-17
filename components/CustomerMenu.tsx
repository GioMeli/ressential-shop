"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCart } from "@/lib/cart";

export default function CustomerNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    }

    loadUser();
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#eadccc] bg-[#f8f3ed]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-3xl md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

          <a href="/" className="text-2xl font-semibold tracking-wide md:text-3xl">
            Ressential ✨
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="/shop" className="text-sm font-medium">Shop</a>
            <a href="/#custom" className="text-sm font-medium">Custom</a>
            <a href="/#gallery" className="text-sm font-medium">Gallery</a>
            <a href="/#contact" className="text-sm font-medium">Contact</a>
          </nav>

          <div className="hidden items-center gap-5 text-2xl md:flex">
            <a href="/favorites" title="Favorites">♡</a>

            <a href="/cart" title="Basket" className="relative">
              🛍
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-[#e85d8f] px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </a>

            <a href={email ? "/account" : "/login"} title="Account">
              👤
            </a>

            {email && (
              <button
                onClick={logout}
                className="rounded-full bg-[#2b211d] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Logout
              </button>
            )}
          </div>

          <a href="/cart" className="relative text-2xl md:hidden">
            🛍
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 rounded-full bg-[#e85d8f] px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <aside className="h-full w-[82%] max-w-sm bg-[#f8f3ed] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Ressential ✨</h2>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-3xl"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-6 text-lg">
              <a href="/shop">Shop</a>
              <a href="/#custom">Custom</a>
              <a href="/#gallery">Gallery</a>
              <a href="/#contact">Contact</a>
              <a href="/favorites">♡ Favorites</a>
              <a href="/cart">🛍 Basket ({cartCount})</a>
              <a href={email ? "/account" : "/login"}>
                👤 {email ? "My Account" : "Login / Register"}
              </a>

              {email && (
                <button
                  onClick={logout}
                  className="mt-4 rounded-full bg-[#2b211d] px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}