import { Suspense } from "react";
import OrderApp from "./OrderApp";

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <OrderApp />
    </Suspense>
  );
}
