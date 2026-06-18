// Central content for Pizza Express — scraped from yourpizzaexpress.com,
// allmenus.com and verified against Yelp / Google listings (June 2026).

export type Hours = {
  /** 24h decimal, e.g. 15.5 = 3:30pm */
  open: number;
  close: number;
};

export type Location = {
  slug: string;
  name: string;
  street: string;
  cityState: string;
  zip: string;
  phone: string; // display
  phoneHref: string; // tel:
  orderUrl: string;
  services: string[];
  mapUrl: string;
  hours: {
    weekday: Hours; // Sun–Thu
    weekend: Hours; // Fri–Sat
  };
  hoursText: {
    weekday: string;
    weekend: string;
  };
};

export const LOCATIONS: Location[] = [
  {
    slug: "warwood",
    name: "Warwood",
    street: "707 Warwood Avenue",
    cityState: "Wheeling, WV",
    zip: "26003",
    phone: "(304) 277-1040",
    phoneHref: "tel:+13042771040",
    orderUrl: "https://pizzaexpresswa.eatontheweb.com",
    services: ["Pickup", "Delivery"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pizza+Express+707+Warwood+Avenue+Wheeling+WV+26003",
    hours: {
      weekday: { open: 15, close: 22 },
      weekend: { open: 15, close: 23 },
    },
    hoursText: {
      weekday: "Sun–Thu · 3:00pm – 10:00pm",
      weekend: "Fri–Sat · 3:00pm – 11:00pm",
    },
  },
  {
    slug: "bridgeport",
    name: "Bridgeport",
    street: "55800 National Road",
    cityState: "Bridgeport, OH",
    zip: "43912",
    phone: "(740) 633-1661",
    phoneHref: "tel:+17406331661",
    orderUrl: "https://pizzaexpressna.eatontheweb.com",
    services: ["Pickup", "Delivery", "Drive-Thru"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pizza+Express+55800+National+Road+Bridgeport+OH+43912",
    hours: {
      weekday: { open: 14, close: 22 },
      weekend: { open: 14, close: 23 },
    },
    hoursText: {
      weekday: "Sun–Thu · 2:00pm – 10:00pm",
      weekend: "Fri–Sat · 2:00pm – 11:00pm",
    },
  },
  {
    slug: "yorkville",
    name: "Yorkville",
    street: "520 Public Road",
    cityState: "Yorkville, OH",
    zip: "43971",
    phone: "(740) 859-5100",
    phoneHref: "tel:+17408595100",
    orderUrl: "https://pizzaexpressyv.eatontheweb.com",
    services: ["Pickup", "Delivery", "Drive-Thru"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Pizza+Express+520+Public+Road+Yorkville+OH+43971",
    hours: {
      weekday: { open: 15.5, close: 22 },
      weekend: { open: 15.5, close: 22.5 },
    },
    hoursText: {
      weekday: "Sun–Thu · 3:30pm – 10:00pm",
      weekend: "Fri–Sat · 3:30pm – 10:30pm",
    },
  },
];

export type MenuItem = {
  name: string;
  price: string;
  desc?: string;
  /** show a "from" prefix when extra toppings raise the price */
  from?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  blurb?: string;
  items: MenuItem[];
  footnote?: string;
};

export const MENU: MenuCategory[] = [
  {
    id: "pizza",
    name: "Pizza",
    blurb: "Hand-tossed on dough we make fresh every single day.",
    items: [
      {
        name: "Supreme Cheese",
        price: "9.95",
        from: true,
        desc: "Our signature blend of Provolone, Cheddar & Romano.",
      },
      {
        name: "All Meat",
        price: "9.95",
        from: true,
        desc: "Pepperoni, sausage, bacon & ham.",
      },
      {
        name: "Deluxe",
        price: "12.95",
        from: true,
        desc: "Pepperoni, mushrooms, onions, sausage & peppers.",
      },
      {
        name: "Garden Veggie",
        price: "12.95",
        from: true,
        desc: "Mushrooms, peppers, onions & olives.",
      },
      {
        name: "Hawaiian",
        price: "9.95",
        from: true,
        desc: "Pineapple, ham & cheese.",
      },
      {
        name: "Mexican",
        price: "9.55",
        from: true,
        desc: "Sausage, cheeses, olives, onions & Mexican seasoning.",
      },
      {
        name: "White Pizza",
        price: "9.35",
        from: true,
        desc: "Garlic-oil crust, cheese, tomatoes & onions.",
      },
      {
        name: "Everything",
        price: "16.95",
        from: true,
        desc: "The Deluxe plus olives, ham & extra cheese.",
      },
      {
        name: "Belly Buster",
        price: "25.95",
        desc: "40 square pieces — feeds the whole crew.",
      },
      {
        name: "Jr. Belly Buster",
        price: "16.45",
        desc: "20 square pieces.",
      },
      {
        name: "French Bread Pizza",
        price: "1.85",
      },
    ],
    footnote:
      "Add any toppings: Pepperoni · Sausage · Bacon · Ham · Mushrooms · Onions · Green Peppers · Mild Peppers · Pineapple · Black Olives · Green Olives · Jalapeños · Anchovies · Extra Cheese.",
  },
  {
    id: "subs",
    name: "Subs & Sandwiches",
    blurb: "Toasted, stuffed and made to order.",
    items: [
      { name: "Steak Sub", price: "4.95", from: true },
      { name: "Steak Supreme Sub", price: "4.95", from: true },
      { name: "Italian Chicken Sub", price: "4.85", from: true },
      { name: "Grilled Chicken Breast", price: "4.85", from: true },
      { name: "Chicken Breast Fillet", price: "4.85", from: true },
      { name: "Turkey Sub", price: "4.85", from: true },
      { name: "Italian Sub", price: "4.75", from: true },
      { name: "Meatball Splash", price: "4.75", from: true },
      { name: "Ham & Cheese", price: "4.75", from: true },
      { name: "Pizza Sub", price: "4.75", from: true },
      { name: "Veggie Sub", price: "4.75", from: true },
      { name: "Italian Sausage Link", price: "4.75", from: true },
      { name: "Gyro", price: "4.75", from: true },
    ],
  },
  {
    id: "sides",
    name: "Sides & Wings",
    blurb: "The perfect sidekicks.",
    items: [
      {
        name: "Wings (10)",
        price: "6.95",
        desc: "Sassy Ranch · Teriyaki · Hot · Mild · BBQ · Garlic Butter · Plain.",
      },
      { name: "Calzone", price: "6.25", desc: "Up to 3 toppings." },
      { name: "Mozzarella Sticks (5)", price: "4.95" },
      { name: "Jalapeño Poppers (6)", price: "4.65" },
      { name: "Chicken Fingers (5)", price: "4.50" },
      { name: "Cinnamon Sticks", price: "4.50" },
      { name: "Chicken Strips", price: "3.10" },
      { name: "Seasoned Potato Wedges", price: "2.10" },
      { name: "Pepperoni Roll", price: "2.10" },
      { name: "French Fries", price: "1.85" },
      { name: "Bag of Cheese (4 oz.)", price: "1.50" },
    ],
  },
  {
    id: "salads",
    name: "Salads",
    blurb: "Fresh and crisp, dressed how you like.",
    items: [
      {
        name: "Chicken Salad",
        price: "6.25",
        desc: "Grilled or breaded.",
      },
      { name: "Steak Salad", price: "6.30" },
      {
        name: "Chef Salad",
        price: "4.95",
        desc: "Pepperoni, ham & salami.",
      },
      { name: "Side Salad", price: "2.75" },
    ],
    footnote:
      "Dressings: Ranch · Honey French · Golden Italian · Light Italian · Blue Cheese. Extra dressing $0.40.",
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      { name: "2-Liter (Pepsi products)", price: "2.25" },
      { name: "20 oz. (Pepsi products)", price: "1.25" },
    ],
  },
];

export const SITE = {
  name: "Pizza Express",
  tagline: "Not Fast Food — Great Food.",
  promise: "Everything we make is made-to-order, on dough we make fresh daily.",
  facebook: "https://www.facebook.com/pex5100/",
  instagram: "https://www.instagram.com/pizzaexpresspex/",
  // Generic ordering destination if no location is chosen yet
  orderAnchor: "#order",
};
