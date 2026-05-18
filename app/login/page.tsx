"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerMenu from "@/components/CustomerMenu";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        alert(error.message);
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .single();

      if (adminData) {
        window.location.href = "/admin/orders";
      } else {
        window.location.href = "/";
      }

      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          full_name: fullName,
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

   setLoading(false);
   alert("Account created successfully.");
   window.location.href = "/";

    alert("Account created successfully.");

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Ressential Account
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="mt-4 text-[#6f625b]">
            {mode === "login"
              ? "Login to access your orders, favorites and messages."
              : "Create your account to place orders and communicate with the administrator."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("login")}
              className={`rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-widest transition ${
                mode === "login"
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#ddd0c0] bg-white"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("register")}
              className={`rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-widest transition ${
                mode === "register"
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#ddd0c0] bg-white"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === "register" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Display Name
                  </label>

                  <input
                    required
                    type="text"
                    value={displayName}
                    onChange={(e) =>
                      setDisplayName(e.target.value)
                    }
                    placeholder="Example: Giorgos"
                    className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Example: Alan Smith"
                    className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-[#2b211d] px-5 py-5 text-sm font-semibold uppercase tracking-widest text-white"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}