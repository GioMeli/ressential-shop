"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      alert(result.error.message);
      return;
    }

    alert(mode === "login" ? "Logged in successfully." : "Account created successfully.");
    window.location.href = "/shop";
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="border-b border-[#e7d8c6] bg-[#f8f3ed]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold">
            Ressential ✨
          </a>

          <a
            href="/shop"
            className="rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Back to Shop
          </a>
        </div>
      </nav>

      <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-sm"
        >
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </p>

          <h1 className="text-4xl font-semibold">
            {mode === "login" ? "Login to your account" : "Register"}
          </h1>

          <div className="mt-8 space-y-5">
            <input
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
            />

            <input
              required
              type="password"
              placeholder="Password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-6 w-full text-sm font-semibold text-[#6f625b]"
          >
            {mode === "login"
              ? "Do not have an account? Create one"
              : "Already have an account? Login"}
          </button>
        </form>
      </section>
    </main>
  );
}