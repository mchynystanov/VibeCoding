"use client";

import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
      {product.badge && (
        <span className="w-fit rounded-full bg-paomma-primary px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}
      <ProductImagePlaceholder title={product.title} />
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-paomma-text/70">{product.shortDescription}</p>
      <p className="text-lg font-bold">{product.price.toLocaleString("ru-RU")} ₽</p>
      <button
        onClick={() => addItem(product.id)}
        className="mt-auto rounded-full bg-paomma-primary py-2 font-semibold text-white transition hover:bg-paomma-primaryDark"
      >
        В корзину
      </button>
    </div>
  );
}
