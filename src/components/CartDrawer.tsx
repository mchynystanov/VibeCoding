"use client";

import { useCartStore, useCartTotals } from "@/lib/cart-store";

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const close = useCartStore((state) => state.close);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQty = useCartStore((state) => state.setQty);
  const openOrderForm = useCartStore((state) => state.openOrderForm);
  const totals = useCartTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-paomma-ink/30" onClick={close}>
      <div
        className="flex h-full w-full max-w-sm flex-col gap-4 border-l border-paomma-line bg-paomma-bg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-light tracking-tight">Корзина</h2>
          <button
            onClick={close}
            aria-label="Закрыть корзину"
            className="text-xl text-paomma-inkMuted"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-paomma-inkMuted">Корзина пуста</p>
        ) : (
          <ul className="flex flex-1 flex-col divide-y divide-paomma-line overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-paomma-inkMuted">{item.price.toLocaleString("ru-RU")} ₽</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Уменьшить количество"
                    className="h-7 w-7 border border-paomma-line"
                    onClick={() => setQty(item.id, item.qty - 1)}
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    aria-label="Увеличить количество"
                    className="h-7 w-7 border border-paomma-line"
                    onClick={() => setQty(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  aria-label="Удалить товар"
                  className="text-xs uppercase tracking-wide text-paomma-inkMuted underline"
                  onClick={() => removeItem(item.id)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="border-t border-paomma-line pt-4 text-sm">
            <div className="flex justify-between">
              <span>Сумма</span>
              <span>{totals.subtotal.toLocaleString("ru-RU")} ₽</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-paomma-inkMuted">
                <span>Скидка за комплект</span>
                <span>−{totals.discount.toLocaleString("ru-RU")} ₽</span>
              </div>
            )}
            <div className="mt-1 flex justify-between font-medium">
              <span>Итого</span>
              <span>{totals.total.toLocaleString("ru-RU")} ₽</span>
            </div>
            <button
              onClick={openOrderForm}
              className="mt-4 w-full border border-paomma-ink py-3 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
