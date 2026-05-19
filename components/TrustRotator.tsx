"use client";

import { useEffect, useState } from "react";

const messages = [
  "✦ Handmade in small batches",
  "✦ Custom orders available",
  "✦ Greece & Cyprus focused service",
];

export default function TrustRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full border-b border-[#eadccc] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 text-center text-xs text-[#5b4a42] md:hidden">
        {messages[index]}
      </div>

      <div className="mx-auto hidden max-w-7xl items-center justify-center gap-10 px-4 py-3 text-center text-sm text-[#5b4a42] md:flex">
        {messages.map((message) => (
          <span key={message}>{message}</span>
        ))}
      </div>
    </section>
  );
}