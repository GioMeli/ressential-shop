import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f8f3ed] px-6 py-24 text-[#2b211d]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-semibold">Product not found</h1>
          <a href="/shop" className="mt-8 inline-block underline">
            Back to shop
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="border-b border-[#e7d8c6] bg-[#f8f3ed]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-semibold tracking-wide">
            Ressential ✨
          </a>

          <a
            href="/shop"
            className="rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Back to Shop
          </a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-2 md:items-start">
        <div className="overflow-hidden rounded-[3rem] border border-[#e4d2bd] bg-white p-4 shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="h-[620px] w-full rounded-[2.5rem] object-cover"
          />
        </div>

        <div className="pt-4">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
            {product.category}
          </p>

          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold">€{product.price}</p>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#6f625b]">
            {product.description}
          </p>

          <div className="mt-10 rounded-[2rem] border border-[#e4d2bd] bg-white p-7">
            <h2 className="text-2xl font-semibold">Customization options</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-[#f8f3ed] p-5">
                Choose colors, flowers, glitter and gold details.
              </div>
              <div className="rounded-2xl bg-[#f8f3ed] p-5">
                Add names, dates, quotes or meaningful symbols.
              </div>
              <div className="rounded-2xl bg-[#f8f3ed] p-5">
                Premium gift packaging available on request.
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/#contact"
              className="rounded-full bg-[#2b211d] px-8 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition hover:scale-105"
            >
              Request Order
            </a>

            <a
              href="/shop"
              className="rounded-full border border-[#b08a5b] px-8 py-4 text-center text-sm font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}