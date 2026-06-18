import { LOCATIONS } from "../lib/data";
import OpenStatus from "./OpenStatus";

export default function Locations() {
  return (
    <section id="locations" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-pizza-red">
            Find Us
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Three neighborhood locations
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.slug}
              className="flex flex-col rounded-3xl border border-charcoal/10 bg-cream p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl font-extrabold text-charcoal">
                  {loc.name}
                </h3>
                <OpenStatus loc={loc} />
              </div>

              <address className="mt-3 not-italic text-charcoal/75">
                {loc.street}
                <br />
                {loc.cityState} {loc.zip}
              </address>

              <a
                href={loc.phoneHref}
                className="mt-3 inline-block font-bold text-pizza-red hover:text-pizza-red-dark"
              >
                {loc.phone}
              </a>

              <dl className="mt-4 space-y-1 border-t border-charcoal/10 pt-4 text-sm text-charcoal/65">
                <div>{loc.hoursText.weekday}</div>
                <div>{loc.hoursText.weekend}</div>
              </dl>

              <div className="mt-5 flex gap-2.5">
                <a
                  href={loc.orderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-pizza-red px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-pizza-red-dark"
                >
                  Order
                </a>
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border-2 border-charcoal/15 px-4 py-2.5 text-center text-sm font-bold text-charcoal transition-colors hover:border-pizza-green hover:text-pizza-green-dark"
                >
                  Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
