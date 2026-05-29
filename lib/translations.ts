import { Language } from "@/lib/language";

export const translations = {
  en: {
    shop: "Shop",
    custom: "Custom",
    favorites: "Favorites",
    contact: "Contact",
    messages: "Messages",
    myOrders: "My Orders",
    searchPlaceholder: "Search by product, category, or gift idea",
    announcement:
      "Handmade luxury gifts • Custom orders available in Greece & Cyprus",
  },
  el: {
    shop: "Κατάστημα",
    custom: "Custom",
    favorites: "Αγαπημένα",
    contact: "Επικοινωνία",
    messages: "Μηνύματα",
    myOrders: "Οι παραγγελίες μου",
    searchPlaceholder: "Αναζήτηση προϊόντων, κατηγοριών ή ιδεών δώρου",
    announcement:
      "Χειροποίητα πολυτελή δώρα • Διαθέσιμες custom παραγγελίες σε Ελλάδα και Κύπρο",
  },
  sq: {
    shop: "Dyqani",
    custom: "Custom",
    favorites: "Të preferuarat",
    contact: "Kontakt",
    messages: "Mesazhet",
    myOrders: "Porositë e mia",
    searchPlaceholder: "Kërko produkt, kategori ose ide dhurate",
    announcement:
      "Dhurata luksoze të punuara me dorë • Porosi custom në Greqi dhe Qipro",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(language: Language, key: TranslationKey) {
  return translations[language]?.[key] || translations.en[key];
}