"use client";

import { getProductById } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { useCartStore } from "@/lib/cart-store";

export function BionicPumpSection() {
  const product = getProductById("bionic-pump");
  const addItem = useCartStore((state) => state.addItem);
  if (!product) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
        <ProductImagePlaceholder title={product.title} />
        <div>
          <div className="section-eyebrow mb-3">
            <span>Хит продаж</span>
          </div>
          <h2 className="mb-2 text-3xl font-light tracking-tight">Свободные руки</h2>
          <p className="mb-4 text-paomma-inkMuted">{product.shortDescription}</p>
          <dl className="space-y-2 text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex gap-2">
                <dt className="font-medium">{spec.label}:</dt>
                <dd className="text-paomma-inkMuted">{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-lg font-semibold">{product.price.toLocaleString("ru-RU")} ₽</p>
          <button
            onClick={() => addItem(product.id)}
            className="mt-4 border border-paomma-ink px-6 py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
