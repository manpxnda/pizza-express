"use client";

import Link from "next/link";
import { useState } from "react";
import { ORDER_CATEGORIES, money, suggestedFrom } from "../lib/menu";

export default function Menu() {
  const [active, setActive] = useState(ORDER_CATEGORIES[0].key);
  const category =
    ORDER_CATEGORIES.find((c) => c.key === active) ?? ORDER_CATEGORIES[0];

  return (
    <section id="menu" className="scroll-mt-20 bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pizza-red">
            Our Menu
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Made fresh, made-to-order
          </h2>
          <p className="mt-3 text-charcoal/65">
            A taste of what we make daily — pick a category, then build your
            order online in a couple taps.
          </p>
        </div>

        {/* Temporary competitive-pricing preview (for owner review) */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-dashed border-pizza-red/40 bg-pizza-red/5 p-4 text-center">
          <p className="font-display text-sm font-bold text-pizza-red">
            📊 Pricing preview — for review
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            Where shown, the current price is{" "}
            <span className="line-through decoration-pizza-red/60 decoration-2">crossed out</span>{" "}
            next to a suggested{" "}
            <span className="font-semibold text-pizza-red">market-competitive price</span>,
            benchmarked vs Domino&apos;s, Pizza Hut &amp; DiCarlo&apos;s. Temporary &amp; easy to change.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {ORDER_CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                active === c.key
                  ? "bg-pizza-red text-white shadow-card"
                  : "bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:text-pizza-red"
              }`}
            >
              <span aria-hidden>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </div>

        {category.blurb && (
          <p className="mt-6 text-center text-sm font-medium text-charcoal/60">
            {category.blurb}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {category.products.map((product) => (
            <div
              key={product.key}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-charcoal">
                    {product.name}
                  </h3>
                  {product.badge && (
                    <span className="rounded-full bg-pizza-green/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pizza-green-dark">
                      {product.badge}
                    </span>
                  )}
                </div>
                {product.desc && (
                  <p className="mt-1 text-sm text-charcoal/60">{product.desc}</p>
                )}
              </div>
              <span className="shrink-0 text-right">
                {product.sizes.length > 1 && (
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-charcoal/40">
                    from
                  </span>
                )}
                {(() => {
                  const sug = suggestedFrom(product);
                  return sug ? (
                    <span className="flex items-baseline justify-end gap-1.5">
                      <span className="text-sm font-semibold text-charcoal/40 line-through decoration-pizza-red/60 decoration-2">
                        {money(product.fromPrice)}
                      </span>
                      <span className="font-display text-base font-extrabold text-pizza-red">
                        {money(sug)}
                      </span>
                    </span>
                  ) : (
                    <span className="font-display text-base font-extrabold text-pizza-green-dark">
                      {money(product.fromPrice)}
                    </span>
                  );
                })()}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/order"
            className="inline-block rounded-full bg-pizza-red px-8 py-4 text-lg font-bold text-white shadow-lift transition-transform hover:scale-[1.03] hover:bg-pizza-red-dark"
          >
            See Full Menu & Order
          </Link>
        </div>
      </div>
    </section>
  );
}
