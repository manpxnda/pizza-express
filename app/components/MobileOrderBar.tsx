// Always-visible "Order Now" bar on mobile so ordering is one tap from anywhere.
export default function MobileOrderBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-cream/95 p-3 backdrop-blur-md md:hidden">
      <a
        href="#order"
        className="block rounded-full bg-pizza-red px-6 py-3.5 text-center text-base font-bold text-white shadow-lift"
      >
        🍕 Start Your Order
      </a>
    </div>
  );
}
