import T from "@/components/T";

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
                  <T text="Handmade Studio" />
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-8 text-[#6f625b]">
              <T text="Handmade resin art, soy candles and personalized gifts crafted with emotion, elegance and premium aesthetics." />
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {["Handmade", "Custom Gifts", "Greece & Cyprus"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                >
                  <T text={item} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              <T text="Shop" />
            </h4>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p><a href="/shop"><T text="All Products" /></a></p>
              <p><a href="/favorites"><T text="Favorites" /></a></p>
              <p><a href="/cart"><T text="Basket" /></a></p>
              <p><a href="/custom"><T text="Custom Designer" /></a></p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              <T text="Customer Care" />
            </h4>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p><a href="/account"><T text="My Orders" /></a></p>
              <p><a href="/messages"><T text="Messages" /></a></p>
              <p><a href="/contact"><T text="Contact" /></a></p>
              <p><a href="/shipping"><T text="Shipping Information" /></a></p>
              <p><a href="/returns"><T text="Returns Policy" /></a></p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b08a5b]">
              <T text="Stay Connected" />
            </h4>

            <p className="mt-5 leading-7 text-[#6f625b]">
              <T text="Follow Ressential for new handmade pieces, custom ideas and gift inspiration." />
            </p>

            <div className="mt-5 space-y-3 text-sm text-[#6f625b]">
              <p>
                <a
                  href="https://www.instagram.com/ressential_experience/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2b211d]"
                >
                  Instagram
                </a>
              </p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[#eadccc] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[#b08a5b]">
                <T text="Coming Soon" />
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6f625b]">
                <T text="Custom design experience, shipping options and online payment setup." />
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#eadccc] pt-6 text-center text-xs text-[#8a7b72]">
          © 2026 Ressential. <T text="All rights reserved." />
        </div>
      </div>
    </footer>
  );
}