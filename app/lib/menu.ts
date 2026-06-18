import menuData from "./menu.json";

export type ModifierOption = {
  id: number;
  name: string;
  price: number;
  halfPrice: number;
};

export type ModifierGroup = {
  id: number;
  name: string;
  min: number;
  max: number; // 0 = unlimited
  isToppings: boolean;
  options: ModifierOption[];
};

export type MenuItem = {
  id: number;
  name: string;
  rawName?: string;
  desc: string;
  price: number;
  modifierGroups: ModifierGroup[];
  /** Option IDs (from the priced-topping group) included free on a specialty pizza. */
  presets?: number[];
};

/** True for round/square pizzas that support per-topping placement + amount. */
export const PIZZA_CATEGORY_KEYS = ["pizzas", "specialty"];

/** The single priced-topping group on a pizza (excludes the redundant $0 list). */
export function canonicalToppingGroup(item: MenuItem): ModifierGroup | undefined {
  return item.modifierGroups.find(
    (g) => g.isToppings && g.name.toLowerCase().startsWith("priced")
  );
}

export type Category = {
  id: number;
  name: string;
  items: MenuItem[];
};

export type MenuData = { source: string; categories: Category[] };

export const MENU_DATA = menuData as MenuData;
export const CATEGORIES = MENU_DATA.categories;

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Friendly label for a POS modifier group. */
export function groupLabel(g: ModifierGroup): string {
  const n = g.name.toLowerCase();
  if (n.includes("topping")) return "Add Toppings";
  if (n.includes("cooking")) return "Cooking Instructions";
  if (n.includes("sauce")) return g.name.includes("WING") ? "Choose a Sauce" : g.name;
  if (n.includes("dressing")) return "Dressing";
  return g.name;
}

export function findItem(id: number): { item: MenuItem; category: Category } | null {
  for (const c of CATEGORIES) {
    const item = c.items.find((i) => i.id === id);
    if (item) return { item, category: c };
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Ordering model — products grouped by size for an easier flow.
 * Each "Product" is one menu card. A product can have multiple sizes
 * (e.g. Small / Medium / Large, or Half / Whole); picking a size swaps
 * the underlying POS item (its own price + its own toppings/prices).
 * ------------------------------------------------------------------ */

export type SizeOption = { label: string; sublabel?: string; item: MenuItem };

export type Product = {
  key: string;
  name: string;
  desc: string;
  sizes: SizeOption[]; // length 1 = no size choice
  fromPrice: number;
  defaultSizeIndex: number;
  badge?: string;
};

export type OrderCategory = {
  key: string;
  name: string;
  emoji: string;
  blurb?: string;
  products: Product[];
};

function rawItems(catName: string): MenuItem[] {
  return CATEGORIES.find((c) => c.name === catName)?.items ?? [];
}
function exact(items: MenuItem[], name: string): MenuItem | undefined {
  return items.find((i) => i.name.toLowerCase() === name.toLowerCase());
}
function incl(items: MenuItem[], frag: string): MenuItem | undefined {
  return items.find((i) => i.name.toLowerCase().includes(frag.toLowerCase()));
}
const isProduct = (p: Product | null): p is Product => p !== null;

function single(
  item: MenuItem | undefined,
  opts?: { name?: string; desc?: string; badge?: string }
): Product | null {
  if (!item) return null;
  return {
    key: `i${item.id}`,
    name: opts?.name ?? item.name,
    desc: opts?.desc ?? item.desc,
    sizes: [{ label: "", item }],
    fromPrice: item.price,
    defaultSizeIndex: 0,
    badge: opts?.badge,
  };
}

function sized(
  name: string,
  desc: string,
  rawSizes: { label: string; sublabel?: string; item: MenuItem | undefined }[],
  opts?: { key?: string; defaultIndex?: number; badge?: string }
): Product | null {
  const sizes = rawSizes.filter((s) => s.item) as SizeOption[];
  if (sizes.length === 0) return null;
  const fromPrice = Math.min(...sizes.map((s) => s.item.price));
  const def = Math.min(opts?.defaultIndex ?? 0, sizes.length - 1);
  return {
    key: opts?.key ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    desc,
    sizes,
    fromPrice,
    defaultSizeIndex: def,
    badge: opts?.badge,
  };
}

export function priceLabel(p: Product): string {
  return p.sizes.length > 1 ? `from ${money(p.fromPrice)}` : money(p.fromPrice);
}

/**
 * TEMPORARY competitive-pricing preview (owner review). Suggested starting
 * price per product, benchmarked June 2026 vs Domino's, Pizza Hut & DiCarlo's.
 * Remove this map (and the homepage banner) to turn the preview off.
 */
export const SUGGESTED_FROM: Record<string, number> = {
  "byo-pizza": 6.95, // build-your-own (from Personal)
  "belly-buster": 12.95,
  i199: 13.95, // Cauliflower Crust
  deluxe: 19.95,
  everything: 24.95,
  veggie: 19.95,
  "supreme-cheese": 14.95,
  "white-pizza": 12.95,
  hawaiian: 14.95,
  "all-meat": 15.95,
  i168: 12.95, // Traditional Wings
  i169: 10.95, // Boneless Wings
};

export function suggestedFrom(p: Product): number | null {
  const s = SUGGESTED_FROM[p.key];
  return s && Math.abs(s - p.fromPrice) > 0.001 ? s : null;
}

/* ------------------------------------------------------------------ *
 * Deals & combos — Domino's-inspired AOV levers.
 * ------------------------------------------------------------------ */

export type Deal = {
  key: string;
  emoji: string;
  name: string;
  desc: string;
  items: string[]; // what's included (display)
  price: number;
  regular: number; // sum of components, for the savings callout
  badge?: string;
};

export const DEALS: Deal[] = [
  {
    key: "family",
    emoji: "👨‍👩‍👧",
    name: "Family Deal",
    desc: "Large 1-topping pizza, large breadsticks & a 2-liter.",
    items: ["Large 1-Topping Pizza", "Large Breadsticks", "2-Liter"],
    price: 23.99,
    regular: 26.8,
    badge: "Best value",
  },
  {
    key: "gameday",
    emoji: "🏈",
    name: "Game Day Bundle",
    desc: "Two large 1-topping pizzas, 10 wings & a 2-liter.",
    items: ["2× Large 1-Topping Pizza", "10 Wings", "2-Liter"],
    price: 39.99,
    regular: 45.15,
    badge: "Feeds 4–6",
  },
  {
    key: "date",
    emoji: "🍕",
    name: "Date Night",
    desc: "Medium 2-topping pizza + small breadsticks.",
    items: ["Medium 2-Topping Pizza", "Small Breadsticks"],
    price: 18.99,
    regular: 19.75,
  },
  {
    key: "lunch",
    emoji: "🥤",
    name: "Lunch Combo",
    desc: "Small 1-topping pizza + a 20 oz drink.",
    items: ["Small 1-Topping Pizza", "20 oz Drink"],
    price: 11.99,
    regular: 13.1,
    badge: "Weekday fave",
  },
  {
    key: "party",
    emoji: "🎉",
    name: "Party Pack",
    desc: "Full Belly Buster, 20 wings & two 2-liters.",
    items: ["Belly Buster (40 pc)", "20 Wings", "2× 2-Liter"],
    price: 54.99,
    regular: 64.85,
    badge: "Feeds a crowd",
  },
];

export const dealSavings = (d: Deal): number =>
  Math.max(0, Math.round((d.regular - d.price) * 100) / 100);

/** Mix & Match — pick any 2+ for one flat price each (Domino's "Best Deal Ever"). */
export type MixMatch = { price: number; items: { name: string; reg: number }[] };
export const MIX_MATCH: MixMatch = {
  price: 7.99,
  items: [
    { name: "Medium 1-Topping Pizza", reg: 12.6 },
    { name: "Large Breadsticks", reg: 8.75 },
    { name: "10 Boneless Wings", reg: 10.5 },
    { name: "Any Whole Sub", reg: 11.5 },
    { name: "Chicken Calzone", reg: 8.95 },
    { name: "Steak Calzone", reg: 8.95 },
  ],
};

/** Order $25+ for free delivery (a nudge to grow the basket). */
export const FREE_DELIVERY_MIN = 25;

/** One-tap cross-sell add-ons shown in the cart ("Complete your order"). */
function findByFrag(frag: string): MenuItem | undefined {
  for (const c of CATEGORIES)
    for (const i of c.items)
      if (i.name.toLowerCase().includes(frag.toLowerCase())) return i;
  return undefined;
}
export const CROSS_SELL: MenuItem[] = [
  "2 Liter Pepsi",
  "Cinnamon Sticks",
  "Mozzarella Sticks",
  "Choc Chip Cookie",
  "Jalapeno Poppers",
  "20 oz Pepsi",
]
  .map((f) => findByFrag(f))
  .filter((x): x is MenuItem => !!x);

export function productHasOptions(p: Product): boolean {
  return p.sizes.length > 1 || p.sizes.some((s) => s.item.modifierGroups.length > 0);
}

function buildOrderCategories(): OrderCategory[] {
  const P = rawItems("Pizzas");
  const S = rawItems("Specialty Pizzas");
  const W = rawItems("Wings");
  const SB = rawItems("Subs");
  const B = rawItems("Burgers & Sandwiches");
  const SL = rawItems("Salads");
  const SI = rawItems("Sides");
  const BR = rawItems("Breadsticks");
  const CH = rawItems("Chicken");
  const PA = rawItems("Pasta");
  const DE = rawItems("Desserts");
  const D20 = rawItems("Twenty oz Bottle");
  const D2L = rawItems("Two Liter");

  // Specialty helper: matches "Small X" / "X Small" etc.
  const spz = (name: string, desc: string, frag: string) =>
    sized(
      name,
      desc,
      [
        { label: "Small", item: incl(S, "small " + frag) ?? incl(S, frag + " small") },
        { label: "Medium", item: incl(S, "medium " + frag) ?? incl(S, frag + " medium") },
        { label: "Large", item: incl(S, "large " + frag) ?? incl(S, frag + " large") },
      ],
      { key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), defaultIndex: 2 }
    );

  // Sub helper: pairs an exact whole + exact half.
  const sub = (name: string, whole: string, half: string | null, desc: string) =>
    sized(
      name,
      desc,
      [
        { label: "Whole", item: exact(SB, whole) },
        { label: "Half", item: half ? exact(SB, half) : undefined },
      ],
      { key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), defaultIndex: 0 }
    );

  const cats: OrderCategory[] = [
    {
      key: "pizzas",
      name: "Pizzas",
      emoji: "🍕",
      blurb: "Hand-tossed on dough we make fresh daily — add any toppings.",
      products: [
        sized(
          "Build Your Own Pizza",
          "Our signature sauce & cheese on fresh dough. Add any toppings.",
          [
            { label: "Personal", sublabel: "4 pieces", item: incl(P, "teaser") },
            { label: "Small", sublabel: "8 pieces", item: exact(P, "Small Pizza") },
            { label: "Medium", sublabel: "10 pieces", item: exact(P, "Medium Pizza") },
            { label: "Large", sublabel: "12 pieces", item: exact(P, "Large Pizza") },
            { label: "XXL", sublabel: "NY style · 10 slices", item: incl(P, "xxl") },
          ],
          { key: "byo-pizza", defaultIndex: 3, badge: "Most popular" }
        ),
        sized(
          "Belly Buster",
          "Our Sicilian-style square pizza, sold by the tray — feeds a crowd.",
          [
            { label: "Baby", sublabel: "8 sq pieces", item: incl(P, "baby buster") },
            { label: "Jr.", sublabel: "20 sq pieces", item: incl(P, "jr. belly buster") },
            { label: "Full", sublabel: "40 sq pieces", item: exact(P, "Belly Buster") },
          ],
          { key: "belly-buster", defaultIndex: 1, badge: "Party size" }
        ),
        single(incl(P, "cauliflower"), {
          name: "Cauliflower Crust Pizza",
          desc: "Cauliflower crust with cheese — add any toppings.",
        }),
      ].filter(isProduct),
    },
    {
      key: "specialty",
      name: "Specialty Pizzas",
      emoji: "⭐",
      blurb: "Our chef's favorites, built and ready to top.",
      products: [
        spz("Deluxe", "Pepperoni, sausage, mushrooms, onions, green & banana peppers.", "deluxe"),
        spz("Everything", "The Deluxe plus ham, black & green olives & extra cheese.", "everything"),
        spz("Veggie", "Mushrooms, green & banana peppers, onions, black & green olives.", "veggie"),
        spz("Supreme Cheese", "Our special blend of provolone, cheddar & romano.", "sup"),
        spz("White Pizza", "Garlic-oil crust, cheese, tomatoes, onions & seasonings.", "white"),
        spz("Hawaiian", "Pineapple, ham & cheese.", "hawaiian"),
        spz("All Meat", "Pepperoni, sausage, bacon & ham.", "all meat"),
      ].filter(isProduct),
    },
    {
      key: "calzones",
      name: "Calzones",
      emoji: "🥟",
      blurb: "Fresh dough folded around cheese & your fillings.",
      products: [
        sized(
          "Build Your Own Calzone",
          "Stuffed with cheese & up to 3 toppings.",
          [
            { label: "Mini", item: incl(P, "mini calzone") },
            { label: "Regular", item: exact(P, "Calzones") },
          ],
          { key: "byo-calzone", defaultIndex: 1 }
        ),
        single(incl(P, "meatball calzone"), { name: "Meatball Calzone", desc: "Meatballs, cheese & special sauce." }),
        single(incl(P, "steak calzone"), { name: "Steak Calzone", desc: "Ribeye steak & cheese." }),
        single(incl(P, "chicken calzone"), { name: "Chicken Calzone", desc: "Chicken & cheese." }),
        single(incl(P, "french bread"), {
          name: "French Bread Pizza",
          desc: "French bread, sauce, cheese & your choice of toppings.",
        }),
      ].filter(isProduct),
    },
    {
      key: "wings",
      name: "Wings",
      emoji: "🍗",
      blurb: "Oven-baked, tossed in any of 11 sauces.",
      products: [
        single(incl(W, "regular wings"), { name: "Traditional Wings (10)", desc: "Bone-in, oven-baked. Choose your sauce." }),
        single(incl(W, "boneless wings"), { name: "Boneless Wings (10)", desc: "Oven-baked. Choose your sauce." }),
      ].filter(isProduct),
    },
    {
      key: "subs",
      name: "Subs",
      emoji: "🥖",
      blurb: "Toasted & made to order — pick half or whole.",
      products: [
        sub("Italian Sub", "Italian", "½ Italian", "Ham, salami, pepperoni, cheese, lettuce, tomato, onion & mayo."),
        sub("Steak Sub", "Steak", "½ Steak", "Tender ribeye, cheese, lettuce, tomato & mayo."),
        sub("Steak Supreme Sub", "Steak Supreme", "½ Steak Supreme", "Ribeye steak, cheese & mushrooms."),
        sub("Steak & Swiss Sub", "Steak & Swiss", "½ Steak Swiss", "Ribeye, swiss & sautéed peppers, mushrooms & onions."),
        sub("Italian Chicken Sub", "Italian Chicken", "½ Ital Chicken", "All-white chicken in our special sauce & cheese."),
        sub("Chicken Breast Sub", "Chicken Breast", "½ Chicken Breast", "All-white chicken breast, lettuce, tomato & mayo."),
        sub("Italian Sausage Sub", "Italian Sausage", "½ Italian Sausage", "Sausage link, special sauce, peppers, onions & cheese."),
        sub("Meatball Splash Sub", "Meatball Splash", "½ MB Splash", "Meatballs in our special sauce & cheese."),
        sub("Turkey Sub", "Turkey", "½ Turkey Sub", "Turkey, cheese, lettuce, tomato & mayo."),
        sub("Ham & Cheese Sub", "Ham & Cheese", "½ Ham & Cheese", "Ham, cheese & mayo."),
        sub("Pizza Sub", "Pizza Sub", "½ Pizza Sub", "Italian bread, sauce, pepperoni & cheese."),
        sub("Veggie Sub", "Veggie", "½ Veggie Sub", "Sauce, cheese, mushrooms, peppers, onions & olives."),
        sub("BLT Sub", "Whole BLT", "½ BLT", "Bacon, lettuce, tomato & mayo on italian bread."),
        single(exact(SB, "Gyro"), { desc: "Seasoned meat, tzatziki, lettuce & tomato on pita." }),
      ].filter(isProduct),
    },
    {
      key: "burgers",
      name: "Burgers",
      emoji: "🍔",
      blurb: "Quarter-pound burgers & hot sandwiches.",
      products: B.map((i) => single(i)).filter(isProduct),
    },
    {
      key: "salads",
      name: "Salads",
      emoji: "🥗",
      blurb: "Fresh & crisp, dressed how you like.",
      products: [
        single(incl(SL, "chef")),
        single(incl(SL, "grilled")),
        single(incl(SL, "breaded")),
        single(incl(SL, "steak salad")),
        single(incl(SL, "side salad")),
        single(incl(SL, "extra dressing")),
      ].filter(isProduct),
    },
    {
      key: "sides",
      name: "Sides",
      emoji: "🍟",
      blurb: "The perfect sidekicks.",
      products: [
        sized(
          "Breadsticks",
          "Blend of cheeses on our fresh dough, served with sauce.",
          [
            { label: "Small", item: incl(BR, "small") },
            { label: "Medium", item: incl(BR, "medium") },
            { label: "Large", item: incl(BR, "large") },
          ],
          { key: "breadsticks", defaultIndex: 2 }
        ),
        single(incl(CH, "chicken fingers")),
        ...SI.map((i) => single(i)),
      ].filter(isProduct),
    },
    {
      key: "pasta",
      name: "Pasta",
      emoji: "🍝",
      products: PA.map((i) => single(i)).filter(isProduct),
    },
    {
      key: "desserts",
      name: "Desserts",
      emoji: "🍰",
      products: DE.map((i) => single(i)).filter(isProduct),
    },
    {
      key: "drinks",
      name: "Drinks",
      emoji: "🥤",
      products: [...D20.map((i) => single(i)), ...D2L.map((i) => single(i))].filter(isProduct),
    },
  ];

  return cats.filter((c) => c.products.length > 0);
}

export const ORDER_CATEGORIES: OrderCategory[] = buildOrderCategories();
