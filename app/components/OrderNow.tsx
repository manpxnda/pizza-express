import { LOCATIONS } from "../lib/data";
import OpenStatus from "./OpenStatus";

function ServiceBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-semibold text-charcoal/70">
      {label}
    </span>
  );
}

export default function OrderNow() {
  return (
    <section id="order" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pizza-red">
            Order in 2 taps
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Pick your location & get rolling
          </h2>
          <p className="mt-3 text-charcoal/65">
            Order online for pickup or delivery, or call the shop directly. We
            stop out-of-town deliveries 1 hour before close and in-town 30
            minutes before close.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.slug}
              className="flex flex-col rounded-3xl border border-charcoal/10 bg-cream p-6 shadow-card transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl font-extrabold text-charcoal">
                  {loc.name}
                </h3>
                <OpenStatus loc={loc} />
              </div>

              <p className="mt-2 text-sm text-charcoal/70">
                {loc.street}
                <br />
                {loc.cityState} {loc.zip}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {loc.services.map((s) => (
                  <ServiceBadge key={s} label={s} />
                ))}
              </div>

              <dl className="mt-4 space-y-1 text-sm text-charcoal/65">
                <div>{loc.hoursText.weekday}</div>
                <div>{loc.hoursText.weekend}</div>
              </dl>

              <div className="mt-6 flex flex-col gap-2.5 pt-2">
                <a
                  href={`/order?loc=${loc.slug}`}
                  className="rounded-full bg-pizza-red px-5 py-3.5 text-center text-base font-bold text-white shadow-card transition-transform hover:scale-[1.02] hover:bg-pizza-red-dark"
                >
                  Order Online
                </a>
                <a
                  href={loc.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-pizza-green/30 bg-white px-5 py-3 text-center text-base font-bold text-pizza-green-dark transition-colors hover:bg-pizza-green/10"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1z" />
                  </svg>
                  {loc.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-charcoal/55">
          Online orders are paid in advance with Visa, Mastercard or American
          Express. Prefer cash? Just give us a call.
        </p>
      </div>
    </section>
  );
}
