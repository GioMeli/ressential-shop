import CustomerNavbar from "@/components/CustomerMenu";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:items-center md:px-6 md:py-20">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b] md:text-sm">
            Handmade Resin Art & Soy Candles
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-7xl">
            Luxury handmade creations with emotion and elegance.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#6f625b] md:text-lg">
            Discover premium handmade gifts, soy candles, resin art and custom
            creations designed for weddings, baptisms and meaningful moments.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/shop"
              className="rounded-full bg-[#2b211d] px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white"
            >
              Shop Collection
            </a>

            <a
              href="#custom"
              className="rounded-full border border-[#b08a5b] px-8 py-4 text-center text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Create Your Own
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2.5rem] bg-[#dcc5ad] p-3 shadow-2xl md:rounded-[4rem]">
            <img
              src="/images/hero.jpeg"
              alt="Ressential handmade resin creation"
              className="h-[420px] w-full rounded-[2rem] object-cover md:h-[620px] md:rounded-[3.5rem]"
            />
          </div>

          <div className="absolute bottom-6 left-6 rounded-[1.5rem] bg-white/90 p-5 shadow-xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
              Custom Made
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              Your idea, handcrafted.
            </h3>
            <p className="mt-1 text-sm text-[#6f625b]">
              Colors, names, flowers and premium details.
            </p>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 py-14 md:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Curated Collection
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Explore our handmade categories
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Soy Candles",
              text: "Luxury handmade soy candles with elegant scents and premium details.",
              image: "/images/candle1.jpeg",
            },
            {
              title: "Resin Art",
              text: "Unique resin art pieces crafted with flowers, glitter and gold details.",
              image: "/images/resin1.jpeg",
            },
            {
              title: "Wedding & Baptism",
              text: "Personalized keepsakes for weddings, baptisms and special occasions.",
              image: "/images/gift1.jpeg",
            },
          ].map((item) => (
            <a
              key={item.title}
              href="/shop"
              className="overflow-hidden rounded-[2rem] border border-[#e4d2bd] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#6f625b]">{item.text}</p>

                <span className="mt-6 inline-block rounded-full bg-[#2b211d] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white">
                  Explore Collection
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        id="custom"
        className="mx-auto max-w-7xl px-5 py-14 md:px-6"
      >
        <div className="grid overflow-hidden rounded-[2.5rem] bg-[#2b211d] text-white md:grid-cols-2">
          <div className="p-8 md:p-14">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d6b488]">
              Custom Orders
            </p>

            <h2 className="mt-5 text-3xl font-semibold md:text-5xl">
              Design a piece that exists only for you.
            </h2>

            <p className="mt-6 leading-8 text-white/80">
              Send your idea, preferred colors, names, occasion and details.
              Ressential will prepare a personalized proposal for your creation.
            </p>

            <div className="mt-8 space-y-4 text-white/90">
              <p>✓ Choose product type, size and shape</p>
              <p>✓ Select colors, glitter, flowers and gold flakes</p>
              <p>✓ Add names, dates, quotes or symbols</p>
              <p>✓ Receive estimated price and production time</p>
            </div>

            <a
              href="#contact"
              className="mt-10 inline-block rounded-full bg-white px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Request Custom Order
            </a>
          </div>

          <img
            src="/images/gallery7.jpeg"
            alt="Custom Ressential handmade creation"
            className="h-full min-h-[420px] w-full object-cover"
          />
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-5 py-14 md:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Gallery
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            Handmade moments, captured beautifully.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            "/images/gallery1.jpeg",
            "/images/gallery2.jpeg",
            "/images/gallery4.jpeg",
            "/images/gallery6.jpeg",
            "/images/gallery7.jpeg",
            "/images/gallery8.jpeg",
            "/images/gallery10.jpeg",
            "/images/gallery11.jpeg",
          ].map((image) => (
            <img
              key={image}
              src={image}
              alt="Ressential gallery"
              className="h-48 w-full rounded-[1.5rem] object-cover md:h-72"
            />
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-14 md:px-6">
        <div className="rounded-[2.5rem] border border-[#e4d2bd] bg-white p-8 text-center shadow-sm md:p-14">
          <img
            src="/images/logo.jpeg"
            alt="Ressential logo"
            className="mx-auto h-28 w-28 rounded-full object-cover"
          />

          <h2 className="mt-6 text-3xl font-semibold md:text-5xl">
            Start your handmade order
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#6f625b]">
            For custom creations, gifts, weddings, baptisms and premium handmade
            pieces, contact Ressential directly.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://www.instagram.com/ressential_experience/"
              target="_blank"
              className="rounded-full bg-[#2b211d] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Instagram
            </a>

            <a
              href="/shop"
              className="rounded-full border border-[#b08a5b] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Visit Shop
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e4d2bd] px-5 py-10 text-center text-sm text-[#6f625b]">
        © 2026 Ressential. All rights reserved.
      </footer>
    </main>
  );
}