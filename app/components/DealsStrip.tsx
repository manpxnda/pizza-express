import Link from "next/link";
import { DEALS, MIX_MATCH, dealSavings, money } from "../lib/menu";

export default function DealsStrip() {
  const featured = DEALS.slice(0, 3);

  return (
    <section id="deals" className="scroll-mt-20 bg-charcoal py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-pizza-red">
              🔥 Deals &amp; Combos
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-cream sm:text-4xl">
              Bundle up &amp; save
            </h2>
          </div>
          <Link
            href="/order"
            className="rounded-full bg-pizza-red px-6 py-3 font-bold text-white shadow-lift transition-transform hover:scale-105 hover:bg-pizza-red-dark"
          >
            See all deals
          </Link>
        </div>

        {/* Mix & Match banner */}
        <Link
          href="/order"
          className="mt-8 flex flex-col items-start justify-between gap-3 rounded-3xl bg-gradient-to-r from-pizza-red to-pizza-red-dark p-6 text-white transition-transform hover:scale-[1.01] sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-display text-2xl font-extrabold">
              Mix &amp; Match — {money(MIX_MATCH.price)} each
            </p>
            <p className="mt-1 text-white/85">
              Pick any 2 or more: pizzas, breadsticks, wings, subs &amp; calzones.
            </p>
          </div>
          <span className="rounded-full bg-white px-6 py-3 font-bold text-pizza-red">
            Start mixing →
          </span>
        </Link>

        {/* Featured combos */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {featured.map((d) => (
            <Link
              key={d.key}
              href="/order"
              className="flex flex-col rounded-3xl bg-cream p-5 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>{d.emoji}</span>
                {d.badge && (
                  <span className="rounded-full bg-pizza-green/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-pizza-green-dark">
                    {d.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-lg font-extrabold text-charcoal">{d.name}</h3>
              <p className="mt-1 flex-1 text-sm text-charcoal/60">{d.desc}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold text-charcoal">{money(d.price)}</span>
                <span className="text-sm text-charcoal/40 line-through">{money(d.regular)}</span>
                <span className="ml-auto rounded-full bg-pizza-red px-2.5 py-0.5 text-xs font-bold text-white">
                  Save {money(dealSavings(d))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
