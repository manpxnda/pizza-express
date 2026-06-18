"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import logo from "../../public/logo.png";
import { LOCATIONS } from "../lib/data";
import { CATEGORIES, money, type MenuItem } from "../lib/menu";
import { lineTotal, useCart } from "./CartContext";
import ItemModal from "./ItemModal";

export default function OrderApp() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    state,
    setLocation,
    setOrderType,
    removeLine,
    setQty,
    itemCount,
    subtotal,
  } = useCart();

  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Preselect location from ?loc= (only if not already chosen).
  useEffect(() => {
    const loc = params.get("loc");
    if (loc && LOCATIONS.some((l) => l.slug === loc)) {
      setLocation(loc);
    } else if (!state.locationSlug) {
      setLocation(LOCATIONS[0].slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentLocation =
    LOCATIONS.find((l) => l.slug === state.locationSlug) ?? LOCATIONS[0];
  const category = CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0];

  return (
    <div className="min-h-screen bg-cream pb-28 md:pb-0">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Back to site">
            <Image src={logo} alt="Pizza Express" className="h-9 w-auto" sizes="160px" priority />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location selector */}
            <select
              value={currentLocation.slug}
              onChange={(e) => setLocation(e.target.value)}
              className="max-w-[8rem] truncate rounded-full border border-charcoal/15 bg-cream px-3 py-2 text-sm font-semibold text-charcoal outline-none focus:border-pizza-red sm:max-w-none"
              aria-label="Choose location"
            >
              {LOCATIONS.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              className="relative flex items-center gap-2 rounded-full bg-pizza-red px-4 py-2 font-bold text-white shadow-card hover:bg-pizza-red-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              <span className="hidden sm:inline">{money(subtotal)}</span>
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pizza-green px-1 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Order type + location line */}
        <div className="border-t border-charcoal/10 bg-cream">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
            <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-charcoal/10">
              {(["pickup", "delivery"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition-colors ${
                    state.orderType === t
                      ? "bg-pizza-red text-white"
                      : "text-charcoal/60 hover:text-pizza-red"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="truncate text-xs text-charcoal/55 sm:text-sm">
              {currentLocation.street}, {currentLocation.cityState}
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-t border-charcoal/10 bg-white">
          <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                  activeCat === c.id
                    ? "bg-charcoal text-white"
                    : "bg-cream text-charcoal/65 hover:text-pizza-red"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold text-charcoal">
          {category.name}
        </h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item) => {
            const customizable = item.modifierGroups.length > 0;
            return (
              <button
                key={item.id}
                onClick={() => setModalItem(item)}
                className="flex flex-col rounded-2xl border border-charcoal/10 bg-white p-4 text-left shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-base font-bold text-charcoal">
                    {item.name}
                  </h2>
                  <span className="shrink-0 font-display text-base font-extrabold text-pizza-green-dark">
                    {money(item.price)}
                  </span>
                </div>
                {item.desc && (
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal/55">
                    {item.desc}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pizza-red">
                  {customizable ? "Customize" : "Add"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Mobile cart bar */}
      {itemCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-charcoal/10 bg-pizza-red px-5 py-3.5 font-bold text-white md:hidden"
        >
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white/25 px-2 text-sm">
            {itemCount}
          </span>
          <span>View order</span>
          <span>{money(subtotal)}</span>
        </button>
      )}

      {/* Item modal */}
      {modalItem && (
        <ItemModal item={modalItem} onClose={() => setModalItem(null)} />
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-charcoal/50 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-cream shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 bg-white p-5">
              <h2 className="font-display text-xl font-extrabold text-charcoal">
                Your order
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/50 hover:bg-cream-deep"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {state.lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-charcoal/50">
                  <div className="text-5xl">🛒</div>
                  <p className="mt-3 font-semibold">Your cart is empty</p>
                  <p className="mt-1 text-sm">Add something tasty to get started.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {state.lines.map((line) => (
                    <li
                      key={line.uid}
                      className="rounded-2xl border border-charcoal/10 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display font-bold text-charcoal">
                            {line.name}
                          </p>
                          {line.modifiers.length > 0 && (
                            <p className="mt-0.5 text-xs text-charcoal/55">
                              {line.modifiers.map((m) => m.name).join(", ")}
                            </p>
                          )}
                          {line.notes && (
                            <p className="mt-0.5 text-xs italic text-charcoal/45">
                              “{line.notes}”
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 font-display font-extrabold text-charcoal">
                          {money(lineTotal(line))}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-charcoal/15">
                          <button
                            onClick={() => setQty(line.uid, line.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center font-bold text-charcoal/60 hover:text-pizza-red"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-bold">
                            {line.qty}
                          </span>
                          <button
                            onClick={() => setQty(line.uid, line.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center font-bold text-charcoal/60 hover:text-pizza-red"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeLine(line.uid)}
                          className="text-xs font-semibold text-charcoal/45 hover:text-pizza-red"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {state.lines.length > 0 && (
              <div className="border-t border-charcoal/10 bg-white p-5">
                <div className="flex items-center justify-between text-sm text-charcoal/65">
                  <span>Subtotal</span>
                  <span className="font-display text-lg font-extrabold text-charcoal">
                    {money(subtotal)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-charcoal/45">
                  Taxes{state.orderType === "delivery" ? " & delivery fee" : ""} calculated at checkout.
                </p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/order/checkout");
                  }}
                  className="mt-4 w-full rounded-full bg-pizza-red px-6 py-4 text-center font-bold text-white shadow-card hover:bg-pizza-red-dark"
                >
                  Checkout · {money(subtotal)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
