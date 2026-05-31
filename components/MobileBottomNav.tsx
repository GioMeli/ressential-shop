"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCart } from "@/lib/cart";
import LanguageSelector from "@/components/LanguageSelector";
import T from "@/components/T";

type Profile = {
  display_name: string | null;
  full_name: string | null;
};

function NavIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-[23px] w-[23px] object-contain"
    />
  );
}

export default function MobileBottomNav() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadUser();
    setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setEmail(user.email ?? null);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("display_name, full_name")
      .eq("id", user.id)
      .single();

    if (profileData) setProfile(profileData);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const displayName = profile?.display_name || profile?.full_name || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[900] border-t border-[#eadccc] bg-white md:hidden">
      <div className="grid grid-cols-6 items-center">
        <a href="/" className="flex h-16 items-center justify-center">
          <NavIcon src="/icons/home.svg" alt="Home" />
        </a>

        <a href="/shop" className="flex h-16 items-center justify-center">
          <NavIcon src="/icons/shop.svg" alt="Shop" />
        </a>

        <a href="/favorites" className="flex h-16 items-center justify-center">
          <NavIcon src="/icons/favorites.svg" alt="Favorites" />
        </a>

        <a
          href="/cart"
          className="relative flex h-16 items-center justify-center"
        >
          <NavIcon src="/icons/cart.svg" alt="Cart" />

          {cartCount > 0 && (
            <span className="absolute right-5 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#d56c8c] text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </a>

        <button
          onClick={() => setAccountOpen(!accountOpen)}
          className="relative flex h-16 items-center justify-center"
          aria-label="Account menu"
        >
          {email ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b211d] text-sm font-bold text-white">
              {initial}
            </span>
          ) : (
            <NavIcon src="/icons/account.svg" alt="Account" />
          )}
        </button>

        <a href="/messages" className="flex h-16 items-center justify-center">
          <NavIcon src="/icons/messages.svg" alt="Messages" />
        </a>
      </div>

      {accountOpen && (
        <div className="absolute bottom-20 right-3 w-64 rounded-2xl border border-[#eadccc] bg-white p-4 shadow-2xl">
          {email ? (
            <>
              <p className="mb-3 text-sm font-semibold text-[#2b211d]">
                {displayName}
              </p>

              <a
                href="/account"
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f8f3ed]"
              >
                <T text="My Orders" />
              </a>

              <a
                href="/account"
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f8f3ed]"
              >
                <T text="Manage Account" />
              </a>

              <button
                onClick={logout}
                className="mt-2 w-full rounded-full bg-[#2b211d] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white"
              >
                <T text="Log Out" />
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f8f3ed]"
              >
                <T text="Login / Register" />
              </a>

              <a
                href="/login"
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#f8f3ed]"
              >
                <T text="My Orders" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}