"use client";

import { CROSS_SELL, money } from "../lib/menu";
import { useCart } from "./CartContext";

export default function CrossSell({
  title = "Complete your order",
}: {
  title?: string;
}) {
  const { state, addLine } = useCart();
  const inCart = new Set(state.lines.map((l) => l.itemId));
  const items = CROSS_SELL.filter((i) => !inCart.has(i.id)).slice(0, 6);
  if (items.length === 0) return null;

  const add = (it: (typeof CROSS_SELL)[number]) =>
    addLine({
      uid: `${it.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      itemId: it.id,
      name: it.name,
      basePrice: it.price,
      qty: 1,
      modifiers: [],
    });

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 font-display text-sm font-bold text-charcoal">
        <span aria-hidden>➕</span> {title}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => add(it)}
            className="flex w-28 shrink-0 flex-col justify-between rounded-xl border border-charcoal/12 bg-white p-2.5 text-left transition-colors hover:border-pizza-red"
          >
            <span className="text-xs font-semibold leading-snug text-charcoal">{it.name}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-pizza-red">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {money(it.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
