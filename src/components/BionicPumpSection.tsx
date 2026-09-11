"use client";

import { getProductById } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { useCartStore } from "@/lib/cart-store";

export function BionicPumpSection() {
  const product = getProductById("bionic-pump");
  const addItem = useCartStore((state) => state.addItem);
  if (!product) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
        <ProductImagePlaceholder title={product.title} />
        <div>
          <h2 className="mb-2 text-2xl font-bold">Свободные руки</h2>
          <p className="mb-4 text-paomma-text/70">{product.shortDescription}</p>
          <dl className="space-y-2 text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex gap-2">
                <dt className="font-semibold">{spec.label}:</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-lg font-bold">{product.price.toLocaleString("ru-RU")} ₽</p>
          <button
            onClick={() => addItem(product.id)}
            className="mt-4 rounded-full bg-paomma-primary px-6 py-2 font-semibold text-white transition hover:bg-paomma-primaryDark"
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
