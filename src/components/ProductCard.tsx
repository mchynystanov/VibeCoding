"use client";

import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col gap-3 border border-paomma-line p-5">
      {product.badge && (
        <span className="w-fit border border-paomma-ink px-2 py-0.5 text-[10px] uppercase tracking-wide text-paomma-ink">
          {product.badge}
        </span>
      )}
      <ProductImagePlaceholder title={product.title} />
      <h3 className="font-medium">{product.title}</h3>
      <p className="text-sm text-paomma-inkMuted">{product.shortDescription}</p>
      <p className="text-lg font-semibold">{product.price.toLocaleString("ru-RU")} ₽</p>
      <button
        onClick={() => addItem(product.id)}
        className="mt-auto border border-paomma-ink py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
      >
        В корзину
      </button>
    </div>
  );
}
