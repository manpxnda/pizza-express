import type { Metadata } from "next";
import { CartProvider } from "./CartContext";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order Pizza Express online for pickup or delivery — fresh dough daily, made-to-order.",
  robots: { index: false }, // ordering app, keep out of search index
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
