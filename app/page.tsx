export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f3ed] text-[#2b211d]">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#e7d8c6] bg-[#f8f3ed]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-2xl font-semibold tracking-wide">
            Ressential ✨
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#6f625b] md:flex">
            <a href="#shop">Shop</a>
            <a href="#custom">Custom</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>

          <a
            href="#custom"
            className="rounded-full bg-[#2b211d] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Start Design
          </a>
        </div>
      </nav>

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 pb-20 pt-32 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#b08a5b]">
            Handmade Resin Art & Soy Candles
          </p>

          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
            Custom luxury creations made with emotion, detail and elegance.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f625b]">
            Discover ready-made gifts or design your own unique resin art piece
            from scratch with colors, flowers, glitter, engraving and premium
            packaging.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#shop"
              className="rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:scale-105"
            >
              Shop Collection
            </a>

            <a
              href="#custom"
              className="rounded-full border border-[#b08a5b] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#2b211d] transition hover:bg-[#b08a5b] hover:text-white"
            >
              Create Your Own
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-full w-full rounded-[3rem] bg-[#d8c2aa]" />

          <img
            src="/images/hero.jpeg"
            alt="Luxury Resin Art"
            className="relative z-10 h-[650px] w-full rounded-[3rem] object-cover shadow-2xl"
          />

          <div className="absolute bottom-8 left-8 z-20 rounded-[2rem] border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
              Custom Made
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#2b211d]">
              Your idea, handcrafted.
            </h3>
            <p className="mt-2 max-w-xs text-sm text-[#6f625b]">
              Choose colors, flowers, glitter, names and premium details.
            </p>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
            Curated Collection
          </p>
          <h2 className="text-4xl font-semibold md:text-5xl">
            Ready-made creations
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Luxury Soy Candles",
              image: "/images/candle1.jpeg",
            },
            {
              title: "Personalized Resin Gifts",
              image: "/images/resin1.jpeg",
            },
            {
              title: "Wedding & Baptism Keepsakes",
              image: "/images/gift1.jpeg",
            },
            ].map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#e4d2bd] bg-white/70 p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="mb-6 h-56 w-full rounded-[1.5rem] object-cover"
              />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-[#6f625b]">
                Elegant handmade pieces designed for meaningful gifting and
                timeless decoration.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="custom" className="bg-[#2b211d] px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#d7b98f]">
              Create From Scratch
            </p>
            <h2 className="text-4xl font-semibold md:text-6xl">
              Design a piece that exists only for you.
            </h2>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-8 backdrop-blur">
            <ul className="space-y-5 text-lg text-[#f4e7d8]">
              <li>✓ Choose product type, size and shape</li>
              <li>✓ Select colors, glitter, flowers and gold flakes</li>
              <li>✓ Add names, dates, quotes or symbols</li>
              <li>✓ Get estimated price and production time</li>
            </ul>

            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-[#f8f3ed] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[#2b211d]"
            >
              Request Custom Order
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b08a5b]">
            Gallery
          </p>
          <h2 className="text-4xl font-semibold md:text-5xl">
            Handmade moments, captured beautifully.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[#6f625b]">
            A luxury visual showcase of custom resin art, soy candles and unique gifts.
          </p>
        </div>

        <div className="overflow-hidden rounded-[3rem] border border-[#e4d2bd] bg-white/60 p-4 shadow-xl">
          <div className="flex w-max animate-[slide_35s_linear_infinite] gap-5">
            {[
              "/images/gallery1.jpeg",
              "/images/gallery2.jpeg",
              "/images/gallery3.jpeg",
              "/images/gallery4.jpeg",
              "/images/gallery5.jpeg",
              "/images/gallery6.jpeg",
              "/images/gallery7.jpeg",
              "/images/gallery8.jpeg",
              "/images/gallery9.jpeg",
              "/images/gallery10.jpeg",
              "/images/gallery11.jpeg",
              "/images/gallery12.jpeg",
              "/images/gallery1.jpeg",
              "/images/gallery2.jpeg",
              "/images/gallery3.jpeg",
              "/images/gallery4.jpeg",
            ].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Ressential gallery ${index + 1}`}
                className="h-[420px] w-[330px] flex-none rounded-[2.5rem] object-cover shadow-md transition duration-500 hover:scale-105"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-7xl px-6 py-24"
>
        <div className="grid gap-16 rounded-[3rem] bg-[#2b211d] p-10 text-white md:grid-cols-2 md:p-16">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#d7b98f]">
              Custom Orders
            </p>

            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              Let’s create something unique together.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#f1e5d7]">
              Send your idea, preferred colors, occasion and customization details.
              We will contact you with a personalized proposal and estimated price.
            </p>

            <div className="mt-10 space-y-4 text-[#f1e5d7]">
              <p>✓ Handmade luxury creations</p>
              <p>✓ Personalized gifts & keepsakes</p>
              <p>✓ Wedding & baptism creations</p>
              <p>✓ Premium packaging available</p>
            </div>
          </div>

          <form className="space-y-6 rounded-[2rem] bg-white p-8 text-[#2b211d] shadow-2xl">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-[#ddd] px-5 py-4 outline-none transition focus:border-[#b08a5b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-[#ddd] px-5 py-4 outline-none transition focus:border-[#b08a5b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Describe Your Idea
              </label>

              <textarea
                rows={5}
                placeholder="Describe your custom creation..."
                className="w-full rounded-2xl border border-[#ddd] px-5 py-4 outline-none transition focus:border-[#b08a5b]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#2b211d] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:scale-[1.02]"
            >
              Send Request
            </button>
          </form>
        </div>
      </section>

      <footer className="mt-24 border-t border-[#d8c8b6] bg-[#f6f0e8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
    
          <div>
            <h3 className="text-3xl font-semibold text-[#2b211d]">
              Ressential ✨
            </h3>

            <p className="mt-5 leading-7 text-[#6f625b]">
              Handmade resin art and luxury soy candle creations crafted
              with elegance, emotion and premium detail.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-[#2b211d]">
              Navigation
            </h4>

            <ul className="space-y-3 text-[#6f625b]">
              <li>
                <a href="#shop" className="hover:text-black">
                  Shop
                </a>
              </li>

              <li>
                <a href="#gallery" className="hover:text-black">
                  Gallery
                </a>
              </li>

              <li>
                <a href="#contact" className="hover:text-black">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-[#2b211d]">
              Social
            </h4>

            <ul className="space-y-3 text-[#6f625b]">
              <li>
                <a
                  href="https://instagram.com/ressential_experience"
                  target="_blank"
                  className="hover:text-black"
                >
                  Instagram
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-black">
                  TikTok
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-black">
                  Facebook
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold text-[#2b211d]">
              Contact
            </h4>

            <div className="space-y-3 text-[#6f625b]">
              <p>Athens, Greece</p>
              <p>Custom orders available</p>
              <p>Luxury handmade gifts</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d8c8b6] px-6 py-6 text-center text-sm text-[#8c7c70]">
          © 2026 Ressential. All rights reserved.
        </div>
      </footer>
    </main>
  );
}