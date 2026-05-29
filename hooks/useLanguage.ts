"use client";

import { useEffect, useState } from "react";
import { Language } from "@/lib/language";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    function loadLanguage() {
      const saved = localStorage.getItem("ressential_language") as Language | null;
      setLanguage(saved || "en");
    }

    loadLanguage();

    window.addEventListener("language-changed", loadLanguage);

    return () => {
      window.removeEventListener("language-changed", loadLanguage);
    };
  }, []);

  return language;
}