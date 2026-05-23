import CustomerNavbar from "@/components/CustomerMenu";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f4f0eb] text-[#2b211d]">
      <CustomerNavbar />

      <section className="mx-auto flex max-w-4xl items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full bg-white p-8 text-center shadow-sm md:p-14">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1fbf4] text-4xl text-[#166534]">
            ✓
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.35em] text-[#b08a5b]">
            Order Request Received
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6f625b]">
            Your handmade order request has been submitted successfully.
            Ressential will review the details, confirm delivery and payment
            information, and update you about the next steps.
          </p>

          <div className="mt-8 grid gap-4 rounded-[2rem] bg-[#fbf7f1] p-6 text-left text-sm text-[#6f625b] md:grid-cols-3">
            <div>
              <p className="font-semibold text-[#2b211d]">1. Review</p>
              <p className="mt-2">Your order details are checked carefully.</p>
            </div>

            <div>
              <p className="font-semibold text-[#2b211d]">2. Confirmation</p>
              <p className="mt-2">Delivery and payment details are confirmed.</p>
            </div>

            <div>
              <p className="font-semibold text-[#2b211d]">3. Preparation</p>
              <p className="mt-2">Your handmade item is prepared with care.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <a
              href="/shop"
              className="rounded-full bg-[#2b211d] px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Continue Shopping
            </a>

            <a
              href="/messages"
              className="rounded-full border border-[#b08a5b] px-6 py-4 text-xs font-semibold uppercase tracking-widest"
            >
              Messages
            </a>

            <a
              href="/account"
              className="rounded-full border border-[#b08a5b] px-6 py-4 text-xs font-semibold uppercase tracking-widest"
            >
              My Orders
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}