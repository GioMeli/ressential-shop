"use client";

import { FormEvent, useState } from "react";
import CustomerMenu from "@/components/CustomerMenu";
import { supabase } from "@/lib/supabase";
import T from "@/components/T";

type NoticeType = "success" | "error" | "verify" | null;

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [noticeType, setNoticeType] = useState<NoticeType>(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  function showNotice(type: NoticeType, title: string, message: string) {
    setNoticeType(type);
    setNoticeTitle(title);
    setNoticeMessage(message);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setNoticeType(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        showNotice(
          "error",
          "Login failed",
          error.message || "Please check your email and password and try again."
        );
        return;
      }

      const { data: adminData } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      showNotice(
        "success",
        "Login successful",
        "Welcome back. We are redirecting you now."
      );

      if (adminData) {
        window.location.href = "/admin/orders";
      } else {
        window.location.href = "/";
      }

      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
        data: {
          display_name: displayName,
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      showNotice(
        "error",
        "Account could not be created",
        error.message || "Please check your details and try again."
      );
      return;
    }

    showNotice(
      "verify",
      "Check your email",
      `We created your account. Please open ${email}, confirm your email address, and then return here to login.`
    );

    setMode("login");
    setPassword("");
  }

  async function resendVerificationEmail() {
    if (!email) {
      showNotice(
        "error",
        "Email required",
        "Please enter your email address first."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
      },
    });

    setLoading(false);

    if (error) {
      showNotice("error", "Email not sent", error.message);
      return;
    }

    showNotice(
      "verify",
      "Verification email sent",
      `Please check ${email} and confirm your account.`
    );
  }

  function openMailProvider() {
    const domain = email.split("@")[1]?.toLowerCase();

    if (domain?.includes("gmail")) {
      window.open("https://mail.google.com", "_blank");
      return;
    }

    if (domain?.includes("outlook") || domain?.includes("hotmail") || domain?.includes("live")) {
      window.open("https://outlook.live.com/mail", "_blank");
      return;
    }

    if (domain?.includes("yahoo")) {
      window.open("https://mail.yahoo.com", "_blank");
      return;
    }

    window.open("https://mail.google.com", "_blank");
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-16">
        <div className="hidden md:block">
          <p className="text-xs uppercase tracking-[0.4em] text-[#b08a5b]">
            Ressential <T text="Account" />
          </p>

          <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-tight xl:text-7xl">
            <T text="Handmade orders, messages and favorites in one place." />
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6f625b]">
            <T text="Login or create an account to track orders, manage your details and
            communicate with Ressential support." />
          </p>

          <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="font-semibold"><T text="Orders" /></p>
              <p className="mt-2 text-sm text-[#6f625b]"><T text="Track your handmade requests." /></p>
            </div>

            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="font-semibold"><T text="Messages" /></p>
              <p className="mt-2 text-sm text-[#6f625b]"><T text="Chat for Support." /></p>
            </div>

            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
              <p className="font-semibold"><T text="Favorites" /></p>
              <p className="mt-2 text-sm text-[#6f625b]"><T text="Save products you love" /></p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
          <div className="text-center">
            <img
              src="/images/logo.jpeg"
              alt="Ressential logo"
              className="mx-auto h-20 w-20 rounded-full object-cover shadow-sm"
            />

            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>

            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              {mode === "login" ? "Login to Ressential" : "Join Ressential"}
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6f625b]">
              {mode === "login"
                ? "Access your orders, messages and saved handmade pieces."
                : "Create your account and confirm your email before logging in."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setNoticeType(null);
              }}
              className={`rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-widest transition ${
                mode === "login"
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#ddd0c0] bg-white"
              }`}
            >
              <T text="Login" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setNoticeType(null);
              }}
              className={`rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-widest transition ${
                mode === "register"
                  ? "bg-[#2b211d] text-white"
                  : "border border-[#ddd0c0] bg-white"
              }`}
            >
              <T text="Register" />
            </button>
          </div>

          {noticeType && (
            <div
              className={`mt-6 rounded-[1.5rem] border p-5 ${
                noticeType === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : noticeType === "verify"
                  ? "border-[#eadccc] bg-[#fbf7f1] text-[#2b211d]"
                  : "border-green-200 bg-green-50 text-green-800"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
                    noticeType === "error"
                      ? "bg-red-100"
                      : noticeType === "verify"
                      ? "bg-white"
                      : "bg-green-100"
                  }`}
                >
                  {noticeType === "error" ? "!" : noticeType === "verify" ? "✉" : "✓"}
                </div>

                <div>
                  <h3 className="font-semibold">{noticeTitle}</h3>
                  <p className="mt-1 text-sm leading-6">{noticeMessage}</p>

                  {noticeType === "verify" && (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={openMailProvider}
                        className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                      >
                        <T text="Open" /> Email
                      </button>

                      <button
                        type="button"
                        onClick={resendVerificationEmail}
                        className="rounded-full border border-[#b08a5b] px-5 py-3 text-xs font-semibold uppercase tracking-widest"
                      >
                        <T text="Resend" /> Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {mode === "register" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    <T text="Dispplay Name" />
                  </label>

                  <input
                    required
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Example: Giorgos"
                    className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    <T text="Full Name" />
                  </label>

                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Example: Giorgos Meli"
                    className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                <T text="Email" />
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                <T text="Password" />
              </label>

              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#ddd0c0] bg-[#faf7f3] px-5 py-4 outline-none"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6f625b]">
            {mode === "login"
              ? "New to Ressential?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setNoticeType(null);
              }}
              className="font-semibold text-[#2b211d] underline"
            >
              {mode === "login" ? "Create an account" : "Login instead"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
