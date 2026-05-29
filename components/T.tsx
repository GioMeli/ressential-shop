"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateHash } from "@/lib/hash";
import { useLanguage } from "@/hooks/useLanguage";

export default function T({ text }: { text: string }) {
  const language = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let cancelled = false;

    async function translate() {
      if (language === "en") {
        setTranslated(text);
        return;
      }

      const hash = await generateHash(text);

      const { data: cached } = await supabase
        .from("translations_cache")
        .select("translated_text")
        .eq("source_hash", hash)
        .eq("language", language)
        .maybeSingle();

      if (cancelled) return;

      if (cached?.translated_text) {
        setTranslated(cached.translated_text);
        return;
      }

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      const result = await response.json();

      if (cancelled) return;

      if (!result.translated) {
        setTranslated(text);
        return;
      }

      setTranslated(result.translated);

      await supabase.from("translations_cache").upsert(
        {
          source_text: text,
          source_hash: hash,
          language,
          translated_text: result.translated,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "source_hash,language",
        }
      );
    }

    translate();

    return () => {
      cancelled = true;
    };
  }, [text, language]);

  return <>{translated}</>;
}