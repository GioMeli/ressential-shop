import { supabase } from "@/lib/supabase";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import T from "@/components/T";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", id)
    .single();

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f3ed] px-6 py-24 text-[#2b211d]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-semibold"><T text="Product not found" /></h1>
          <a href="/shop" className="mt-8 inline-block underline">
            <T text="Back to shop" />
          </a>
        </div>
      </main>
    );
  }

  return <ProductDetailsClient product={product} />;
}