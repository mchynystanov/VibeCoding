"use client";

import { useCartStore, useCartCount } from "@/lib/cart-store";

export function Header() {
  const open = useCartStore((state) => state.open);
  const count = useCartCount();

  return (
    <header className="sticky top-0 z-40 bg-paomma-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-paomma-primaryDark">Paomma</span>
        <button
          onClick={open}
          aria-label="Открыть корзину"
          className="relative rounded-full bg-white p-2 shadow-sm"
        >
          🛒
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-paomma-primary text-xs text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
