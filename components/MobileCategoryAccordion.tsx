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

export default function MobileCategoryAccordion() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("id, title, slug")
        .eq("is_active", true)
        .order("title");

      const { data: subcategoriesData } = await supabase
        .from("subcategories")
        .select("id, category_id, title, slug")
        .eq("is_active", true)
        .order("title");

      if (categoriesData) setCategories(categoriesData);
      if (subcategoriesData) setSubcategories(subcategoriesData);
    }

    loadData();
  }, []);

  function getSubcategories(categoryId: string) {
    return subcategories.filter((item) => item.category_id === categoryId);
  }

  return (
    <div className="mt-8 border-t border-[#eadccc] pt-6">
      <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
        Categories
      </p>

      <div className="space-y-1">
        {categories.map((category) => {
          const categorySubcategories = getSubcategories(category.id);
          const hasSubcategories = categorySubcategories.length > 0;
          const isOpen = openCategory === category.id;

          return (
            <div key={category.id} className="border-b border-[#eadccc]">
              <div className="flex items-center justify-between">
                <a
                  href={`/shop?category=${category.id}`}
                  className={`py-4 text-base ${
                    isOpen ? "text-[#d56c8c]" : "text-[#2b211d]"
                  }`}
                >
                  {category.title}
                </a>

                {hasSubcategories && (
                  <button
                    type="button"
                    onClick={() => setOpenCategory(isOpen ? null : category.id)}
                    className={`px-3 py-4 text-xl ${
                      isOpen ? "text-[#d56c8c]" : "text-[#2b211d]"
                    }`}
                    aria-label="Toggle category"
                  >
                    {isOpen ? "−" : "+"}
                  </button>
                )}
              </div>

              {isOpen && hasSubcategories && (
                <div className="pb-4">
                  {categorySubcategories.map((subcategory, index) => (
                    <a
                      key={subcategory.id}
                      href={`/shop?subcategory=${subcategory.id}`}
                      className={`block px-6 py-4 text-sm font-semibold text-[#2b211d] ${
                        index % 2 === 1 ? "bg-[#f1f1f1]" : "bg-white"
                      }`}
                    >
                      {subcategory.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}