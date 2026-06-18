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
};

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

/** Title-friendly modifier-group label (the source names are POS-internal). */
export function groupLabel(g: ModifierGroup): string {
  const n = g.name.toLowerCase();
  if (n.startsWith("priced toppings") || g.isToppings === true && n.includes("topping"))
    return "Add Toppings";
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

/**
 * Curated groupings for the marketing menu on the home page so 13 POS
 * categories collapse into a handful of friendly tabs.
 */
export const DISPLAY_GROUPS: { label: string; categoryNames: string[] }[] = [
  { label: "Pizzas", categoryNames: ["Pizzas", "Specialty Pizzas"] },
  { label: "Subs", categoryNames: ["Subs"] },
  { label: "Burgers", categoryNames: ["Burgers & Sandwiches"] },
  { label: "Wings", categoryNames: ["Wings"] },
  { label: "Salads", categoryNames: ["Salads"] },
  {
    label: "Sides",
    categoryNames: ["Breadsticks", "Chicken", "Sides", "Pasta"],
  },
  { label: "Desserts", categoryNames: ["Desserts"] },
  { label: "Drinks", categoryNames: ["Twenty oz Bottle", "Two Liter"] },
];

export function itemsForDisplayGroup(label: string): MenuItem[] {
  const group = DISPLAY_GROUPS.find((g) => g.label === label);
  if (!group) return [];
  const out: MenuItem[] = [];
  for (const name of group.categoryNames) {
    const cat = CATEGORIES.find((c) => c.name === name);
    if (cat) out.push(...cat.items);
  }
  return out;
}
