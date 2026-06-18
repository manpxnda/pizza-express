const ITEMS = [
  {
    emoji: "🌾",
    title: "Fresh Dough Daily",
    text: "We make our dough from scratch every morning — never frozen, never shortcut.",
  },
  {
    emoji: "👨‍🍳",
    title: "Made-To-Order",
    text: "Every pizza, sub and salad is built just for you, exactly how you like it.",
  },
  {
    emoji: "🏠",
    title: "Locally Owned",
    text: "A family-run Ohio Valley staple serving the neighborhood for years.",
  },
  {
    emoji: "🚗",
    title: "Pickup · Delivery · Drive-Thru",
    text: "Grab it your way. Drive-thru available at Bridgeport & Yorkville.",
  },
];

export default function Highlights() {
  return (
    <section id="about" className="scroll-mt-20 bg-pizza-green py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Why everyone keeps coming back
          </h2>
          <p className="mt-3 text-white/80">
            Everything we do is made-to-order on dough we make fresh daily.
            That&apos;s the Pizza Express difference.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white/10 p-6 text-center ring-1 ring-white/15 backdrop-blur-sm"
            >
              <div className="text-4xl">{item.emoji}</div>
              <h3 className="mt-3 font-display text-lg font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
