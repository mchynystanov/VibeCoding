"use client";

import { useCartStore, useCartCount } from "@/lib/cart-store";

// Единственный постоянный способ увидеть/открыть корзину после того, как её
// закрыли — раньше это делал только Header, но он больше не рендерится на
// страницах (см. коммит про удаление шапки сайта).
export function FloatingCartButton() {
  const open = useCartStore((state) => state.open);
  const count = useCartCount();

  if (count === 0) return null;

  return (
    <button
      onClick={open}
      className="fixed bottom-4 left-4 z-30 flex items-center gap-2 border border-paomma-ink bg-paomma-bg px-4 py-2 text-xs uppercase tracking-wide text-paomma-ink shadow-sm transition hover:bg-paomma-ink hover:text-paomma-bg"
    >
      Корзина ({count})
    </button>
  );
}
