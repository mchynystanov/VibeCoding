"use client";

import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { useCartStore } from "@/lib/cart-store";

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      <ProductImagePlaceholder title={product.title} />
      <div>
        <h1 className="mb-2 text-3xl font-light tracking-tight">{product.title}</h1>
        <p className="mb-6 text-paomma-inkMuted">{product.shortDescription}</p>
        <dl className="space-y-2 text-sm">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex gap-2">
              <dt className="font-medium">{spec.label}:</dt>
              <dd className="text-paomma-inkMuted">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-2xl font-semibold">{product.price.toLocaleString("ru-RU")} Сом</p>
        <button
          onClick={() => addItem(product.id)}
          className="mt-6 bg-paomma-accent px-8 py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
