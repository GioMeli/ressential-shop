"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthButtons() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    }

    loadUser();

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

  if (!email) {
    return (
      <a
        href="/login"
        className="rounded-full border border-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
      >
        Login
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href="/account"
        className="hidden text-sm font-medium text-[#6f625b] md:block"
      >
        {email}
      </a>

      <button
        onClick={logout}
        className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
      >
        Logout
      </button>
    </div>
  );
}