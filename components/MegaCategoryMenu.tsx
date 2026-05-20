"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  title: string;
  slug: string;
};

type Subcategory = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
};

export default function MegaCategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("title");

    const { data: subcategoriesData } = await supabase
      .from("subcategories")
      .select("*")
      .eq("is_active", true)
      .order("title");

    if (categoriesData) {
      setCategories(categoriesData);

      if (categoriesData.length > 0) {
        setActiveCategory(categoriesData[0].id);
      }
    }

    if (subcategoriesData) {
      setSubcategories(subcategoriesData);
    }
  }

  function getSubcategories(categoryId: string) {
    return subcategories.filter(
      (item) => item.category_id === categoryId
    );
  }

  return (
    <div className="group relative">
      <button className="hover:text-[#b08a5b]">
        Categories
      </button>

      <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[920px] -translate-x-1/2 rounded-[2rem] border border-[#eadccc] bg-white p-8 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="grid grid-cols-[260px_1fr] gap-10">
          <div className="border-r border-[#eadccc] pr-6">
            <h3 className="mb-5 text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
              Collections
            </h3>

            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() =>
                    setActiveCategory(category.id)
                  }
                  className={`w-full rounded-2xl px-4 py-4 text-left transition ${
                    activeCategory === category.id
                      ? "bg-[#f8f3ed] font-semibold text-[#2b211d]"
                      : "hover:bg-[#faf7f3]"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
                  Explore
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  {
                    categories.find(
                      (c) => c.id === activeCategory
                    )?.title
                  }
                </h2>
              </div>

              <a
                href={`/shop?category=${activeCategory}`}
                className="rounded-full border border-[#d8c7b4] px-5 py-3 text-xs font-semibold uppercase tracking-widest"
              >
                View All
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {getSubcategories(activeCategory || "").map(
                (subcategory) => (
                  <a
                    key={subcategory.id}
                    href={`/shop?subcategory=${subcategory.id}`}
                    className="rounded-[1.5rem] border border-[#eadccc] bg-[#faf7f3] p-6 transition hover:scale-[1.02] hover:bg-[#f4ede6]"
                  >
                    <p className="text-lg font-semibold">
                      {subcategory.title}
                    </p>

                    <p className="mt-2 text-sm text-[#6f625b]">
                      Explore handmade creations
                    </p>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}