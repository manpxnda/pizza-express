"use client";

import { useState } from "react";
import { MENU } from "../lib/data";

export default function Menu() {
  const [active, setActive] = useState(MENU[0].id);
  const category = MENU.find((c) => c.id === active) ?? MENU[0];

  return (
    <section id="menu" className="scroll-mt-20 bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pizza-red">
            Our Menu
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Made fresh, priced friendly
          </h2>
        </div>

        {/* Pricing-update preview banner (for owner review) */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border-2 border-dashed border-pizza-red/40 bg-pizza-red/5 p-4 text-center">
          <p className="font-display text-sm font-bold text-pizza-red">
            📊 Pricing update preview — for review
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            Current prices are <span className="line-through decoration-pizza-red/60 decoration-2">crossed out</span>{" "}
            with suggested <span className="font-semibold text-pizza-red">market-competitive prices</span> beside
            them, benchmarked against Domino&apos;s, Pizza Hut &amp; DiCarlo&apos;s.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {MENU.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active === c.id
                  ? "bg-pizza-red text-white shadow-card"
                  : "bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:text-pizza-red"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {category.blurb && (
          <p className="mt-6 text-center text-charcoal/65">{category.blurb}</p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {category.items.map((item) => (
            <div
              key={item.name}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-charcoal">
                  {item.name}
                </h3>
                {item.desc && (
                  <p className="mt-1 text-sm text-charcoal/60">{item.desc}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                {item.from && (
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">
                    from
                  </span>
                )}
                {item.newPrice ? (
                  <span className="flex items-baseline justify-end gap-1.5">
                    <span className="text-sm font-semibold text-charcoal/40 line-through decoration-pizza-red/60 decoration-2">
                      ${item.price}
                    </span>
                    <span className="font-display text-lg font-extrabold text-pizza-red">
                      ${item.newPrice}
                    </span>
                  </span>
                ) : (
                  <span className="font-display text-lg font-extrabold text-pizza-green-dark">
                    ${item.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {category.footnote && (
          <p className="mt-5 rounded-2xl bg-cream-deep p-4 text-center text-sm text-charcoal/65">
            {category.footnote}
          </p>
        )}

        <div className="mt-10 text-center">
          <a
            href="#order"
            className="inline-block rounded-full bg-pizza-red px-8 py-4 text-lg font-bold text-white shadow-lift transition-transform hover:scale-[1.03] hover:bg-pizza-red-dark"
          >
            Order Now
          </a>
          <p className="mt-3 text-sm text-charcoal/55">
            Prices may vary slightly by location.
          </p>
        </div>
      </div>
    </section>
  );
}
