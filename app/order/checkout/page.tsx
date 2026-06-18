"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "../../../public/logo.png";
import { LOCATIONS } from "../../lib/data";
import { money } from "../../lib/menu";
import { lineTotal, useCart } from "../CartContext";

const TAX_RATE = 0.07; // estimated; finalized by the store at checkout
const DELIVERY_FEE = 3.0; // placeholder until delivery pricing is wired up

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal } = useCart();
  const location =
    LOCATIONS.find((l) => l.slug === state.locationSlug) ?? LOCATIONS[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showReveal, setShowReveal] = useState(false);

  const isDelivery = state.orderType === "delivery";
  const tax = subtotal * TAX_RATE;
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    if (isDelivery) {
      if (!form.address.trim()) e.address = true;
      if (!form.zip.trim()) e.zip = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setShowReveal(true);
  };

  if (state.lines.length === 0 && !showReveal) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-6 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-charcoal">
          Your cart is empty
        </h1>
        <p className="mt-2 text-charcoal/60">Add a few items to get started.</p>
        <Link
          href="/order"
          className="mt-6 rounded-full bg-pizza-red px-7 py-3.5 font-bold text-white shadow-card hover:bg-pizza-red-dark"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  const inputCls = (k: string) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-pizza-red ${
      errors[k] ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/15"
    }`;

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/order" className="flex items-center gap-2 text-sm font-semibold text-charcoal/70 hover:text-pizza-red">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to menu
          </Link>
          <Image src={logo} alt="Pizza Express" className="h-9 w-auto" sizes="160px" priority />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: details */}
        <div>
          <h1 className="font-display text-2xl font-extrabold text-charcoal">
            Checkout
          </h1>

          {/* Order type + location */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-charcoal/10 bg-white p-4">
            <span className="rounded-full bg-pizza-green/12 px-3 py-1 text-sm font-bold capitalize text-pizza-green-dark">
              {state.orderType}
            </span>
            <span className="text-sm text-charcoal/70">
              {location.name} — {location.street}, {location.cityState}
            </span>
            <Link href="/order" className="ml-auto text-xs font-semibold text-pizza-red hover:underline">
              Change
            </Link>
          </div>

          {/* Contact */}
          <section className="mt-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal/70">
              Your info
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <input
                  className={inputCls("name")}
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <input
                className={inputCls("phone")}
                placeholder="Phone *"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <input
                className={inputCls("email")}
                placeholder="Email (optional)"
                inputMode="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </section>

          {/* Delivery address */}
          {isDelivery && (
            <section className="mt-5">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal/70">
                Delivery address
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <input
                    className={inputCls("address")}
                    placeholder="Street address *"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>
                <input
                  className={inputCls("city")}
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
                <input
                  className={inputCls("zip")}
                  placeholder="ZIP *"
                  inputMode="numeric"
                  value={form.zip}
                  onChange={(e) => set("zip", e.target.value)}
                />
              </div>
            </section>
          )}

          {/* Notes */}
          <section className="mt-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal/70">
              Order notes
            </h2>
            <textarea
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-sm outline-none focus:border-pizza-red"
              placeholder={
                isDelivery
                  ? "Gate code, apartment #, leave at door…"
                  : "Pickup time, name for the order…"
              }
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </section>
        </div>

        {/* Right: summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <h2 className="font-display text-lg font-extrabold text-charcoal">
              Order summary
            </h2>
            <ul className="mt-3 divide-y divide-charcoal/8">
              {state.lines.map((line) => (
                <li key={line.uid} className="flex justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold text-charcoal">
                      {line.qty}× {line.name}
                    </span>
                    {line.modifiers.length > 0 && (
                      <span className="block text-xs text-charcoal/50">
                        {line.modifiers.map((m) => m.name).join(", ")}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-semibold text-charcoal">
                    {money(lineTotal(line))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 space-y-1.5 border-t border-charcoal/10 pt-3 text-sm">
              <div className="flex justify-between text-charcoal/65">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal/65">
                <span>Estimated tax</span>
                <span>{money(tax)}</span>
              </div>
              {isDelivery && (
                <div className="flex justify-between text-charcoal/65">
                  <span>Delivery fee</span>
                  <span>{money(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-charcoal/10 pt-2 font-display text-lg font-extrabold text-charcoal">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-pizza-red px-6 py-4 font-bold text-white shadow-card hover:bg-pizza-red-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay with Card · {money(total)}
            </button>
            <p className="mt-2 text-center text-xs text-charcoal/45">
              You won&apos;t be charged until you confirm.
            </p>
          </div>
        </div>
      </main>

      {/* Pay reveal — preview only */}
      {showReveal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-lift">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pizza-red/10 text-3xl">
              🚧
            </div>
            <h2 className="mt-4 font-display text-2xl font-extrabold text-charcoal">
              Online payment is coming soon
            </h2>
            <p className="mt-3 text-charcoal/70">
              This is a preview of our new ordering system. Your order has{" "}
              <span className="font-bold">not</span> been placed and your card
              was <span className="font-bold">not</span> charged.
            </p>
            <p className="mt-3 text-charcoal/70">
              To order right now, give{" "}
              <span className="font-bold">{location.name}</span> a call:
            </p>
            <a
              href={location.phoneHref}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-pizza-green px-6 py-3.5 font-bold text-white hover:bg-pizza-green-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1z" />
              </svg>
              Call {location.phone}
            </a>
            <button
              onClick={() => setShowReveal(false)}
              className="mt-3 w-full rounded-full border-2 border-charcoal/15 px-6 py-3 font-bold text-charcoal hover:border-charcoal/30"
            >
              Back to my order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
