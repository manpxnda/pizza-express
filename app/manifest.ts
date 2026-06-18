import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pizza Express — Order Online",
    short_name: "Pizza Express",
    description:
      "Order Pizza Express for pickup or delivery. Fresh dough daily, made-to-order.",
    id: "/",
    start_url: "/order?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff7ee",
    theme_color: "#e11b22",
    categories: ["food", "shopping"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Start an order",
        short_name: "Order",
        url: "/order?source=pwa",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "View the menu",
        short_name: "Menu",
        url: "/#menu",
      },
    ],
  };
}
