"use client";

import { useEffect, useRef, useState } from "react";
import { languages, Language } from "@/lib/language";

export default function LanguageSelector() {
  const [language, setLanguage] = useState<Language>("en");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ressential_language") as Language | null;
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    function closeDropdown(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  function changeLanguage(value: Language) {
    setLanguage(value);
    localStorage.setItem("ressential_language", value);
    window.dispatchEvent(new Event("language-changed"));
    setOpen(false);
  }

  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  return (
    <div ref={wrapperRef} className="relative z-[999]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[#d8c7b4] bg-white px-3 py-2 text-xs font-semibold text-[#2b211d] shadow-sm"
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <span className="text-[10px]">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-[#eadccc] bg-white shadow-xl">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => changeLanguage(item.code)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#f8f3ed] ${
                language === item.code ? "bg-[#f8f3ed] font-semibold" : ""
              }`}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}