"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCart } from "@/lib/cart";
import { getFavorites } from "@/lib/favorites";
import SmartSearch from "@/components/SmartSearch";
import MegaCategoryMenu from "@/components/MegaCategoryMenu";
import MobileCategoryAccordion from "@/components/MobileCategoryAccordion";
import MobileBottomNav from "@/components/MobileBottomNav";
import LanguageSelector from "@/components/LanguageSelector";
import T from "@/components/T";

export default function CustomerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [email, setEmail] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);


  useEffect(() => {
    async function loadUserAndCounts() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      setEmail(user?.email ?? null);
      setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
      setFavoritesCount(getFavorites().length);

      if (!user) {
        setMessageCount(0);
        return;
      }

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("sender", "admin")
        .eq("is_read", false);

      setMessageCount(count || 0);
    }

    loadUserAndCounts();

    function updateFavoritesCount() {
      setFavoritesCount(getFavorites().length);
    }

    function updateCartCount() {
      setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    }

    window.addEventListener("favorites-updated", updateFavoritesCount);
    window.addEventListener("cart-updated", updateCartCount);

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUserAndCounts();
    });

    const messagesChannel = supabase
      .channel("customer-messages-badge")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => loadUserAndCounts()
      )
      .subscribe();

    return () => {
      listener.subscription.unsubscribe();
      supabase.removeChannel(messagesChannel);
      window.removeEventListener("favorites-updated", updateFavoritesCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#fbf7f1] text-[#2b211d] shadow-sm">
        <div className="bg-[#ead8cf] px-4 py-2 text-center text-xs tracking-wide text-[#5b4a42] md:text-sm">
          <T text="Handmade luxury gifts • Custom orders available in Greece & Cyprus" />
        </div>

        <div className="border-b border-[#eadccc]">
          <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 md:flex md:justify-between md:gap-4 md:px-6">
            <button
              onClick={() => setMenuOpen(true)}
              className="justify-self-start text-3xl md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

            <a
              href="/"
              className="flex items-center justify-center gap-3 justify-self-center text-2xl font-semibold tracking-wide md:justify-start md:text-4xl"
            >
              <img
                src="/images/logo.jpeg"
                alt="Ressential logo"
                className="h-10 w-10 rounded-full object-cover md:h-14 md:w-14"
              />
              <span>Ressential</span>
            </a>

            <div className="hidden md:block">
            <LanguageSelector />
          </div>

            <button
              onClick={() => setMobileSearchOpen(true)}
              className="justify-self-end md:hidden"
              aria-label="Open search"
            >
              <img
                src="/icons/search.svg"
                alt="Search"
                className="h-6 w-6 object-contain"
              />
            </button>

            <div className="hidden w-full max-w-xl md:block">
              <SmartSearch />
            </div>

            <div className="hidden items-center gap-6 text-3xl md:flex">
              <a href="/favorites" title="Favorites" className="relative leading-none">
                ♡
                {favoritesCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs font-semibold text-white">
                    {favoritesCount}
                  </span>
                )}
              </a>

              <a href="/cart" title="Basket" className="relative leading-none">
                🛍
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </a>

              <div className="group relative">
                <button className="leading-none" title="Account">
                  👤
                </button>

                <div className="invisible absolute right-0 top-10 w-72 rounded-2xl border border-[#eadccc] bg-white p-5 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                  <h3 className="text-center text-2xl font-semibold">
                    Ressential
                  </h3>

                  {!email ? (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <a
                        href="/login"
                        className="rounded-xl bg-[#2b211d] px-4 py-3 text-center text-sm font-semibold text-white"
                      >
                        <T text="Login" />
                      </a>

                      <a
                        href="/login"
                        className="rounded-xl border border-[#d8c7b4] px-4 py-3 text-center text-sm font-semibold"
                      >
                        <T text="Register" />
                      </a>
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3 text-center">
                      <p className="break-all text-sm text-[#6f625b]">
                        {email}
                      </p>

                      <a
                        href="/account"
                        className="block rounded-xl border border-[#d8c7b4] px-4 py-3 text-sm font-semibold"
                      >
                        <T text="My Account" />
                      </a>

                      <button
                        onClick={logout}
                        className="w-full rounded-xl bg-[#2b211d] px-4 py-3 text-sm font-semibold text-white"
                      >
                        <T text="Logout" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="hidden border-b border-[#eadccc] md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-6 py-3 text-sm font-medium">
            <MegaCategoryMenu />

            <a href="/custom" className="hover:text-[#b08a5b]">
              <T text="Custom" />
            </a>

            <a href="/favorites" className="hover:text-[#b08a5b]">
              <T text="Favorites" />
            </a>

            <a href="/contact" className="hover:text-[#b08a5b]">
              <T text="Contact" />
            </a>

            <a href="/messages" className="relative hover:text-[#b08a5b]">
              <T text="Messages" />
              {messageCount > 0 && (
                <span className="ml-2 rounded-full bg-[#d56c8c] px-2 py-0.5 text-xs text-white">
                  {messageCount}
                </span>
              )}
            </a>

            <a href={email ? "/account" : "/login"} className="hover:text-[#b08a5b]">
              <T text="My Orders" />
            </a>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[999] bg-black/45 md:hidden"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStartX === null) return;

              const touchEndX = e.changedTouches[0].clientX;
              const distance = touchEndX - touchStartX;

              if (distance < -70) {
                setMenuOpen(false);
              }

              setTouchStartX(null);
            }}
            className="h-full w-[84%] max-w-sm overflow-y-auto bg-[#fbf7f1] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#eadccc] pb-5">
              <a href="/" className="flex items-center gap-3">
                <img
                  src="/images/logo.jpeg"
                  alt="Ressential logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="text-2xl font-semibold">Ressential</span>
              </a>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-3xl"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <SmartSearch mobile />
            </div>

            <MobileCategoryAccordion />

            <nav className="mt-8 flex flex-col gap-5 text-lg">
              <a href="/custom">
                <T text="Create Your Own" />
              </a>

              <a href="/contact">
                <T text="Contact" />
              </a>
            </nav>

            <div className="mt-5">
              <LanguageSelector />
            </div>

            <a
              href="https://www.instagram.com/ressential_experience/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-[#eadccc] bg-white px-5 py-3 text-sm font-semibold text-[#2b211d]"
            >
              <span className="text-xl">📷</span>
              Instagram
            </a>
          </aside>
        </div>
      )}

      {mobileSearchOpen && (
        <div
          onClick={() => setMobileSearchOpen(false)}
          className="fixed inset-0 z-[999] bg-black/45 md:hidden"
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-[#fbf7f1] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#eadccc] pb-5">
              <h2 className="text-xl font-semibold">
                <T text="Search" />
              </h2>

              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-3xl"
                aria-label="Close search"
              >
                ×
              </button>
            </div>

            <SmartSearch mobile />
          </aside>
        </div>
      )}

      <MobileBottomNav />
    </>
  );
}