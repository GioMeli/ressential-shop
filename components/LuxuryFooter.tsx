export default function LuxuryFooter() {
  return (
    <footer className="border-t border-[#eadccc] bg-[#fffaf5] text-[#2b211d]">
      <div className="mx-auto max-w-[1700px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <img
                src="/images/logo.jpeg"
                alt="Ressential logo"
                className="h-20 w-20 rounded-full border border-[#eadccc] object-cover shadow-sm"
              />

              <div>
                <h3 className="text-3xl font-semibold">Ressential</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#b08a5b]">
                  Handmade Studio
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-8 text-[#6f625b]">
              Handmade resin art, soy candles and personalized gifts crafted
              with emotion, elegance and premium aesthetics.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                Handmade
              </span>
              <span className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                Custom Gifts
              </span>
              <span className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                Greece & Cyprus
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              Shop
            </h4>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p>
                <a href="/shop" className="hover:text-[#2b211d]">
                  All Products
                </a>
              </p>
              <p>
                <a href="/favorites" className="hover:text-[#2b211d]">
                  Favorites
                </a>
              </p>
              <p>
                <a href="/cart" className="hover:text-[#2b211d]">
                  Basket
                </a>
              </p>
              <p>
                <a href="/custom" className="hover:text-[#2b211d]">
                  Custom Designer
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              Customer Care
            </h4>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p>
                <a href="/account" className="hover:text-[#2b211d]">
                  My Orders
                </a>
              </p>
              <p>
                <a href="/messages" className="hover:text-[#2b211d]">
                  Messages
                </a>
              </p>
              <p>
                <a href="/contact" className="hover:text-[#2b211d]">
                  Contact
                </a>
              </p>
              <p>
                <a href="/shipping" className="hover:text-[#2b211d]">
                  Shipping Information
                </a>
              </p>
              <p>
                <a href="/returns" className="hover:text-[#2b211d]">
                  Returns Policy
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              Stay Connected
            </h4>

            <p className="mt-5 leading-7 text-[#6f625b]">
              Follow Ressential for new handmade pieces, custom ideas and gift
              inspiration.
            </p>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p>
                <a
                  href="https://www.instagram.com/ressential_experience/"
                  target="_blank"
                  className="hover:text-[#2b211d]"
                >
                  Instagram
                </a>
              </p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#eadccc] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                Coming Soon
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6f625b]">
                Custom design experience, shipping options and online payment
                setup.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#eadccc] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-[#8a7b72] md:flex-row">
            <p>© 2026 Ressential. All rights reserved.</p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="/privacy" className="hover:text-[#2b211d]">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-[#2b211d]">
                Terms
              </a>
              <a href="/faq" className="hover:text-[#2b211d]">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}