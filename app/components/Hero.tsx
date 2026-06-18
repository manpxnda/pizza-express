import Image from "next/image";
import mascot from "../../public/pizza-man.png";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-cream bg-dots">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pizza-red/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pizza-green/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-pizza-green/30 bg-pizza-green/10 px-4 py-1.5 text-sm font-semibold text-pizza-green-dark">
            🍕 Fresh dough made every day
          </span>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-6xl text-balance">
            Not Fast Food.
            <span className="block text-pizza-red">Great Food.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-charcoal/70 md:mx-0 text-balance">
            Locally owned and made-to-order. From hand-tossed pizzas to subs,
            wings and salads — order in just a couple taps for pickup, delivery
            or drive-thru.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#order"
              className="w-full rounded-full bg-pizza-red px-8 py-4 text-center text-lg font-bold text-white shadow-lift transition-transform hover:scale-[1.03] hover:bg-pizza-red-dark sm:w-auto"
            >
              Start Your Order
            </a>
            <a
              href="#menu"
              className="w-full rounded-full border-2 border-charcoal/15 bg-white px-8 py-4 text-center text-lg font-bold text-charcoal transition-colors hover:border-pizza-green hover:text-pizza-green-dark sm:w-auto"
            >
              View Menu
            </a>
          </div>

          <p className="mt-5 text-sm font-medium text-charcoal/55">
            3 locations · Warwood (Wheeling, WV) · Bridgeport & Yorkville, OH
          </p>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute inset-0 -z-10 m-auto h-64 w-64 rounded-full bg-gradient-to-br from-pizza-red/15 to-pizza-green/15 blur-2xl sm:h-80 sm:w-80" />
            <Image
              src={mascot}
              alt="The Pizza Express chef delivering a fresh pizza"
              priority
              className="animate-float w-56 drop-shadow-xl sm:w-72 lg:w-80"
              sizes="(max-width: 768px) 224px, 320px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
