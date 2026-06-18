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

export const SITE = {
  name: "Pizza Express",
  tagline: "Not Fast Food — Great Food.",
  promise: "Everything we make is made-to-order, on dough we make fresh daily.",
  facebook: "https://www.facebook.com/pex5100/",
  instagram: "https://www.instagram.com/pizzaexpresspex/",
  // Generic ordering destination if no location is chosen yet
  orderAnchor: "#order",
};
