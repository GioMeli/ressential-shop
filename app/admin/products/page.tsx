"use client";

import { FormEvent, useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { supabase } from "@/lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  category_id: string;
  price: number;
  image: string;
  images: string[] | null;
  description: string | null;
  badge: string | null;
  is_best_seller: boolean;
  is_active: boolean;
  size: string | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: "soy-candles",
    price: "",
    description: "",
    badge: "",
    is_best_seller: false,
    is_active: true,
    size: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

    loadProducts();
  }

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (data) {
      setProducts(data);
    }

    setLoading(false);
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
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

    const categoryTitle =
      categories.find((c) => c.id === form.category_id)?.title || "";

    const { error } = await supabase.from("products").insert({
      slug: generateSlug(form.name),
      name: form.name,
      category_id: form.category_id,
      category: categoryTitle,
      price: Number(form.price),
      size: form.size,
      image: uploadedImages[0],
      images: uploadedImages,
      description: form.description,
      badge: form.badge || null,
      is_best_seller: form.is_best_seller,
      is_active: form.is_active,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product added successfully.");

    setForm({
      name: "",
      category_id: "soy-candles",
      price: "",
      size: "",
      description: "",
      badge: "",
      is_best_seller: false,
      is_active: true,
    });

    setImageFiles([]);

    loadProducts();
  }

  async function updateProduct(id: string, updates: Partial<Product>) {
    await supabase.from("products").update(updates).eq("id", id);

    loadProducts();
  }

  async function deleteProduct(id: string) {
    const confirmed = confirm("Delete this product?");

    if (!confirmed) return;

    await supabase.from("products").delete().eq("id", id);

    loadProducts();
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[430px_1fr]">
          <form
            onSubmit={handleCreateProduct}
            className="rounded-[2.5rem] bg-white p-8 shadow-sm"
          >
            <h2 className="text-3xl font-semibold">
              Add New Product
            </h2>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  required
                  placeholder="Luxury Soy Candle"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />

                <p className="mt-2 text-xs text-[#7a6d65]">
                  Enter the product title customers will see.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category_id: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price (€)
                </label>

                <input
                  required
                  type="number"
                  placeholder="35"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                    Size / Product Details
                </label>

                <input
                    placeholder="Example: 10cm x 15cm, 250ml candle, A5 diary"
                    value={form.size}
                    onChange={(e) =>
                        setForm({ ...form, size: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />

                <p className="mt-2 text-xs text-[#7a6d65]">
                    Write the product size, capacity, dimensions or format.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                    Product Images
                </label>

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

                <p className="mt-2 text-xs text-[#7a6d65]">
                    Upload 1 to 3 high quality product images.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Describe the product..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Badge
                </label>

                <select
                  value={form.badge}
                  onChange={(e) =>
                    setForm({ ...form, badge: e.target.value })
                  }
                  className="w-full rounded-2xl border border-[#ddd0c0] px-5 py-4 outline-none"
                >
                  <option value="">No Badge</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Premium">Premium</option>
                  <option value="Customizable">Customizable</option>
                  <option value="Limited Edition">
                    Limited Edition
                  </option>
                </select>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_best_seller}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_best_seller: e.target.checked,
                    })
                  }
                />

                Mark as Best Seller
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_active: e.target.checked,
                    })
                  }
                />

                Visible in shop
              </label>
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

                        <p className="mt-2 text-sm text-[#6f625b]">
                          /products/{product.slug}
                        </p>
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
                          {product.is_active
                            ? "Active"
                            : "Inactive"}
                        </button>

                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              is_best_seller:
                                !product.is_best_seller,
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
                          onClick={() =>
                            deleteProduct(product.id)
                          }
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