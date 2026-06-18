import Image from "next/image";
import logo from "../../public/logo.png";
import { LOCATIONS, SITE } from "../lib/data";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="inline-flex rounded-2xl bg-white p-3">
              <Image src={logo} alt="Pizza Express" className="h-12 w-auto" sizes="200px" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              {SITE.tagline} {SITE.promise}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pizza Express on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-pizza-red"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
                </svg>
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pizza Express on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-pizza-red"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-cream">
              Locations
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              {LOCATIONS.map((loc) => (
                <li key={loc.slug}>
                  <span className="font-semibold text-cream">{loc.name}</span>
                  <br />
                  {loc.street}, {loc.cityState} {loc.zip}
                  <br />
                  <a href={loc.phoneHref} className="text-cream/70 hover:text-pizza-red">
                    {loc.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-cream">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="/order" className="hover:text-pizza-red">Order Online</a></li>
              <li><a href="#menu" className="hover:text-pizza-red">Menu</a></li>
              <li><a href="#locations" className="hover:text-pizza-red">Locations & Hours</a></li>
              <li><a href="#about" className="hover:text-pizza-red">About Us</a></li>
            </ul>
            <p className="mt-6 text-sm text-cream/60">
              Now hiring delivery drivers &amp; staff — ask any location for
              details.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Pizza Express. All rights reserved.</p>
          <p>Locally owned &amp; operated · Made-to-order, fresh daily.</p>
        </div>
      </div>
    </footer>
  );
}
