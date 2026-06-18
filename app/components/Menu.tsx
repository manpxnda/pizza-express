"use client";

import Link from "next/link";
import { useState } from "react";
import { DISPLAY_GROUPS, itemsForDisplayGroup, money } from "../lib/menu";

const TOPPING_NOTE: Record<string, string> = {
  Pizzas: "Build your own — add any toppings when you order online.",
  Wings: "Choose from 11 sauces: Hot, Mild, BBQ, Garlic Butter, Sassy Ranch & more.",
};

export default function Menu() {
  const [active, setActive] = useState(DISPLAY_GROUPS[0].label);
  const items = itemsForDisplayGroup(active);
  const note = TOPPING_NOTE[active];

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
            A taste of what we make daily — see the full menu and build your
            order online.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {DISPLAY_GROUPS.map((g) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setActive(g.label)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active === g.label
                  ? "bg-pizza-red text-white shadow-card"
                  : "bg-white text-charcoal/70 ring-1 ring-charcoal/10 hover:text-pizza-red"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {note && (
          <p className="mt-6 text-center text-sm font-medium text-charcoal/60">
            {note}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
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
              <span className="shrink-0 font-display text-lg font-extrabold text-pizza-green-dark">
                {money(item.price)}
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
