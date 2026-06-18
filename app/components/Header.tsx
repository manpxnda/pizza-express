"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "../../public/logo.png";

const NAV = [
  { href: "#order", label: "Order" },
  { href: "#menu", label: "Menu" },
  { href: "#locations", label: "Locations" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2" aria-label="Pizza Express home">
          <Image
            src={logo}
            alt="Pizza Express"
            priority
            className="h-10 w-auto"
            sizes="160px"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-charcoal/75 transition-colors hover:text-pizza-red"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/order"
            className="rounded-full bg-pizza-red px-5 py-2.5 text-sm font-bold text-white shadow-card transition-transform hover:scale-105 hover:bg-pizza-red-dark"
          >
            Order Online
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-charcoal md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-charcoal/10 bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-semibold text-charcoal/80 hover:bg-cream-deep"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/order"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-pizza-red px-5 py-3 text-center text-base font-bold text-white"
            >
              Order Online
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
