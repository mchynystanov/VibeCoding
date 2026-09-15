"use client";

import { useCartStore, useCartCount } from "@/lib/cart-store";

export function Header() {
  const open = useCartStore((state) => state.open);
  const count = useCartCount();

  return (
    <header className="sticky top-0 z-40 border-b border-paomma-line bg-paomma-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex flex-col leading-none">
          <span className="font-[family-name:var(--font-comfortaa)] text-2xl text-paomma-ink">
            paomma
          </span>
          <span className="mt-1 text-[10px] tracking-[0.2em] text-paomma-inkMuted">
            care so rare
          </span>
        </div>
        <button
          onClick={open}
          className="flex items-center gap-2 border border-paomma-ink px-4 py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
        >
          Корзина{count > 0 ? ` (${count})` : ""}
        </button>
      </div>
    </header>
  );
}
