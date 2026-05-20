"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

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

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  subcategory_id: string | null;
  price: number;
  image: string;
  images: string[] | null;
  description: string | null;
  short_description: string | null;
  details: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
  is_customizable: boolean;
  allow_custom_text: boolean;
  allow_color_choice: boolean;
  custom_note_label: string | null;
  size: string | null;
};

const emptyForm = {
  name: "",
  category_id: "",
  subcategory_id: "",
  price: "",
  size: "",
  description: "",
  short_description: "",
  details: "",
  ingredients: "",
  how_to_use: "",
  badge: "",
  is_best_seller: false,
  is_active: true,
  is_customizable: false,
  allow_custom_text: false,
  allow_color_choice: false,
  custom_note_label: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((item) => item.category_id === form.category_id);
  }, [subcategories, form.category_id]);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user?.email) {
      window.location.href = "/login";
      return;
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", userData.user.email)
      .single();

    if (!adminData) {
      window.location.href = "/";
      return;
    }

    await Promise.all([loadCategories(), loadSubcategories(), loadProducts()]);
    setLoading(false);
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, title, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (data) {
      setCategories(data);

      if (!form.category_id && data.length > 0) {
        setForm((prev) => ({ ...prev, category_id: data[0].id }));
      }
    }
  }

  async function loadSubcategories() {
    const { data } = await supabase
      .from("subcategories")
      .select("id, category_id, title, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (data) setSubcategories(data);
  }

  async function loadProducts() {
    const { data } = await supabase.from("products").select("*").order("name");

    if (data) setProducts(data);
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function createCategory() {
    if (!newCategory.trim()) return;

    const title = newCategory.trim();

    const { error } = await supabase.from("categories").insert({
      title,
      slug: generateSlug(title),
      is_active: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setNewCategory("");
    await loadCategories();
  }

  async function createSubcategory() {
    if (!newSubcategory.trim() || !form.category_id) return;

    const title = newSubcategory.trim();

    const { error } = await supabase.from("subcategories").insert({
      title,
      slug: generateSlug(title),
      category_id: form.category_id,
      is_active: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setNewSubcategory("");
    await loadSubcategories();
  }

  async function uploadImages() {
    if (imageFiles.length === 0) return [];

    setUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) {
        alert(error.message);
        setUploading(false);
        return [];
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    setUploading(false);
    return uploadedUrls;
  }

  async function handleCreateProduct(event: FormEvent) {
    event.preventDefault();

    if (!form.category_id) {
      alert("Please select or create a category first.");
      return;
    }

    if (imageFiles.length === 0) {
      alert("Please upload at least 1 product image.");
      return;
    }

    if (imageFiles.length > 3) {
      alert("You can upload up to 3 product images.");
      return;
    }

    const uploadedImages = await uploadImages();
    if (uploadedImages.length === 0) return;

    const selectedCategory = categories.find((c) => c.id === form.category_id);

    const { error } = await supabase.from("products").insert({
      slug: generateSlug(form.name),
      name: form.name,
      category_id: form.category_id,
      category: selectedCategory?.title || "",
      subcategory_id: form.subcategory_id || null,
      price: Number(form.price),
      size: form.size || null,
      image: uploadedImages[0],
      images: uploadedImages,
      description: form.description || null,
      short_description: form.short_description || null,
      details: form.details || null,
      ingredients: form.ingredients || null,
      how_to_use: form.how_to_use || null,
      badge: form.badge || null,
      is_best_seller: form.is_best_seller,
      is_active: form.is_active,
      is_customizable: form.is_customizable,
      allow_custom_text: form.is_customizable ? form.allow_custom_text : false,
      allow_color_choice: form.is_customizable ? form.allow_color_choice : false,
      custom_note_label: form.is_customizable
        ? form.custom_note_label || "Add your name, phrase or custom request"
        : null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product added successfully.");

    setForm({
      ...emptyForm,
      category_id: categories[0]?.id || "",
    });

    setImageFiles([]);
    await loadProducts();
  }

  async function updateProduct(id: string, updates: Partial<Product>) {
    await supabase.from("products").update(updates).eq("id", id);
    await loadProducts();
  }

  async function deleteProduct(id: string) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    await supabase.from("products").delete().eq("id", id);
    await loadProducts();
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <AdminNavbar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
          Admin Dashboard
        </p>

        <h1 className="text-5xl font-semibold md:text-7xl">
          Product Management
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[460px_1fr]">
          <form
            onSubmit={handleCreateProduct}
            className="rounded-[2.5rem] bg-white p-8 shadow-sm"
          >
            <h2 className="text-3xl font-semibold">Add New Product</h2>

            <div className="mt-8 space-y-5">
              <input
                required
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <div className="rounded-2xl border border-[#eadccc] bg-[#faf7f3] p-4">
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  required
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category_id: e.target.value,
                      subcategory_id: "",
                    })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category e.g. Easter Gifts"
                    className="min-w-0 flex-1 rounded-2xl border border-[#ddd0c0] px-4 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={createCategory}
                    className="rounded-full bg-[#2b211d] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eadccc] bg-[#faf7f3] p-4">
                <label className="mb-2 block text-sm font-medium">
                  Subcategory Optional
                </label>

                <select
                  value={form.subcategory_id}
                  onChange={(e) =>
                    setForm({ ...form, subcategory_id: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                >
                  <option value="">No Subcategory</option>
                  {filteredSubcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.title}
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex gap-2">
                  <input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="New subcategory for selected category"
                    className="min-w-0 flex-1 rounded-2xl border border-[#ddd0c0] px-4 py-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={createSubcategory}
                    className="rounded-full bg-[#2b211d] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <input
                required
                type="number"
                placeholder="Price €"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <input
                placeholder="Size / Capacity / Dimensions"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);

                  if (files.length > 3) {
                    alert("You can upload up to 3 images only.");
                    return;
                  }

                  setImageFiles(files);
                }}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4"
              />

              <textarea
                rows={3}
                placeholder="Short Description - shown near product title"
                value={form.short_description}
                onChange={(e) =>
                  setForm({ ...form, short_description: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <textarea
                rows={4}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <textarea
                rows={4}
                placeholder="Details"
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <textarea
                rows={4}
                placeholder="Ingredients / Materials"
                value={form.ingredients}
                onChange={(e) =>
                  setForm({ ...form, ingredients: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <textarea
                rows={4}
                placeholder="How To Use / Care Instructions"
                value={form.how_to_use}
                onChange={(e) =>
                  setForm({ ...form, how_to_use: e.target.value })
                }
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              />

              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
              >
                <option value="">No Badge</option>
                <option value="New">New</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Premium">Premium</option>
                <option value="Customizable">Customizable</option>
                <option value="Limited Edition">Limited Edition</option>
              </select>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_best_seller}
                  onChange={(e) =>
                    setForm({ ...form, is_best_seller: e.target.checked })
                  }
                />
                Mark as Best Seller
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Visible in shop
              </label>

              <div className="rounded-2xl border border-[#eadccc] bg-[#faf7f3] p-4">
                <label className="flex items-center gap-3 font-medium">
                  <input
                    type="checkbox"
                    checked={form.is_customizable}
                    onChange={(e) =>
                      setForm({ ...form, is_customizable: e.target.checked })
                    }
                  />
                  Product is Customizable
                </label>

                {form.is_customizable && (
                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.allow_custom_text}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            allow_custom_text: e.target.checked,
                          })
                        }
                      />
                      Allow name / phrase
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.allow_color_choice}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            allow_color_choice: e.target.checked,
                          })
                        }
                      />
                      Allow color choice
                    </label>

                    <input
                      placeholder="Custom note label"
                      value={form.custom_note_label}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          custom_note_label: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="mt-8 w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white"
            >
              {uploading ? "Uploading..." : "Add Product"}
            </button>
          </form>

          <div>
            {loading ? (
              <div className="rounded-[2rem] bg-white p-10 text-center">
                Loading products...
              </div>
            ) : (
              <div className="space-y-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[2rem] border border-[#e4d2bd] bg-white p-6 shadow-sm"
                  >
                    <div className="grid gap-6 md:grid-cols-[180px_1fr_220px] md:items-center">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        className="h-40 w-full rounded-[1.5rem] object-cover"
                      />

                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-[#b08a5b]">
                          {product.category}
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold">
                          {product.name}
                        </h2>

                        <p className="mt-2 text-[#6f625b]">
                          €{product.price}
                        </p>

                        {product.size && (
                          <p className="mt-2 text-sm text-[#6f625b]">
                            {product.size}
                          </p>
                        )}

                        <p className="mt-2 text-sm text-[#6f625b]">
                          /products/{product.slug}
                        </p>

                        {product.is_customizable && (
                          <p className="mt-3 inline-block rounded-full bg-[#ead8cf] px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                            Customizable
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              is_active: !product.is_active,
                            })
                          }
                          className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                            product.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </button>

                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              is_best_seller: !product.is_best_seller,
                            })
                          }
                          className={`rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-widest ${
                            product.is_best_seller
                              ? "bg-yellow-100 text-yellow-800"
                              : "border border-[#ddd0c0] text-[#2b211d]"
                          }`}
                        >
                          {product.is_best_seller
                            ? "Best Seller"
                            : "Not Best Seller"}
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-full bg-red-700 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}