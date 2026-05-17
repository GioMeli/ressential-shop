import CustomerMenu from "@/components/CustomerMenu";
import FeaturedProductsSlider from "@/components/FeaturedProductsSlider";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbf7f1] text-[#2b211d]">
      <CustomerMenu />

      <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className="rounded-[1.5rem] border border-[#eadccc] bg-white px-6 py-7 shadow-sm md:px-10 md:py-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_280px] md:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#b08a5b] md:text-xs">
                Handmade Resin Art & Soy Candles
              </p>

              <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight md:text-5xl">
                Elegant handmade gifts made for meaningful moments.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#6f625b] md:text-base">
                Premium resin art, soy candles and personalized creations for gifts,
                weddings, baptisms and custom memories.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/shop"
                  className="rounded-full bg-[#2b211d] px-7 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white"
                >
                  Shop Collection
                </a>

                <a
                  href="/custom"
                  className="rounded-full border border-[#b08a5b] px-7 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
                >
                  Create Your Own
                </a>
              </div>
            </div>

            <img
              src="/images/logo.jpeg"
              alt="Ressential logo"
              className="mx-auto h-24 w-24 rounded-full border border-[#eadccc] object-cover shadow-md md:h-28 md:w-28"
            />

            <div className="rounded-2xl bg-[#fbf7f1] px-6 py-5 text-sm text-[#6f625b]">
              <p className="font-semibold text-[#2b211d]">Premium handmade</p>
              <p className="mt-1">Custom orders in Greece & Cyprus</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProductsSlider />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
              Shop by category
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Explore Ressential
            </h2>
          </div>

          <a href="/shop" className="hidden text-sm font-semibold underline md:block">
            View all products
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Soy Candles", "/images/candle1.jpeg"],
            ["Resin Art", "/images/resin1.jpeg"],
            ["Personalized Gifts", "/images/gift1.jpeg"],
            ["Custom Creations", "/images/gallery7.jpeg"],
          ].map(([title, image]) => (
            <a
              key={title}
              href="/shop"
              className="group overflow-hidden rounded-[1.5rem] bg-white shadow-sm"
            >
              <img
                src={image}
                alt={title}
                className="h-40 w-full object-cover transition group-hover:scale-105 md:h-56"
              />

              <div className="p-4 text-center">
                <h3 className="text-sm font-semibold md:text-base">{title}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="rounded-[2rem] bg-[#ead8cf] p-6 text-center md:p-10">
          <img
            src="/images/logo.jpeg"
            alt="Ressential logo"
            className="mx-auto h-24 w-24 rounded-full object-cover"
          />

          <h2 className="mt-5 text-3xl font-semibold md:text-4xl">
            Design something personal
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5b4a42] md:text-base">
            Choose a custom handmade creation, describe your idea, preferred
            colors, names, dates and details, and Ressential will prepare a
            unique piece for you.
          </p>

          <a
            href="/custom"
            className="mt-7 inline-block rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Start Custom Design
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-7 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Featured pieces
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Handmade inspiration
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            "/images/gallery3.jpeg",
            "/images/gallery4.jpeg",
            "/images/gallery5.jpeg",
            "/images/gallery8.jpeg",
            "/images/gallery11.jpeg",
          ].map((image) => (
            <img
              key={image}
              src={image}
              alt="Ressential handmade product"
              className="h-44 w-full rounded-[1.4rem] object-cover md:h-64"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Custom Orders", "Personalized creations for gifts, weddings and baptisms."],
            ["Greece & Cyprus", "Focused delivery and service for Greece and Cyprus customers."],
            ["Handmade Quality", "Each piece is crafted with care, detail and premium finishing."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f625b]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-[#eadccc] bg-white px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-[#6f625b] md:grid-cols-4">
          <div>
            <img
              src="/images/logo.jpeg"
              alt="Ressential logo"
              className="h-16 w-16 rounded-full object-cover"
            />
            <p className="mt-4 leading-7">
              Handmade resin art and soy candle creations with luxury detail.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Shop</h4>
            <div className="mt-4 space-y-2">
              <p><a href="/shop">All Products</a></p>
              <p><a href="/custom">Custom Design</a></p>
              <p><a href="/favorites">Favorites</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Support</h4>
            <div className="mt-4 space-y-2">
              <p><a href="/contact">Contact</a></p>
              <p><a href="/messages">Messages</a></p>
              <p><a href="/account">My Account</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-[#2b211d]">Social</h4>
            <div className="mt-4 space-y-2">
              <p>
                <a
                  href="https://www.instagram.com/ressential_experience/"
                  target="_blank"
                >
                  Instagram
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-[#8a7b72]">
          © 2026 Ressential. All rights reserved.
        </p>
      </footer>
    </main>
  );
}