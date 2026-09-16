"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ProductImage";
import { useCartStore } from "@/lib/cart-store";

/**
 * Единый формат "один блок — один товар" (баннер с одной стороны, описание
 * с другой). Используется для каждого товара на странице; ссылка "Подробнее"
 * ведёт на отдельную страницу товара /products/[id].
 */
export function ProductDetailSection({
  product,
  eyebrow,
  eyebrowClassName,
  heading,
  imageSide = "left",
}: {
  product: Product;
  eyebrow?: string;
  eyebrowClassName?: string;
  heading: string;
  imageSide?: "left" | "right";
}) {
  const addItem = useCartStore((state) => state.addItem);

  const image = <ProductImage product={product} />;

  const info = (
    <div>
      {eyebrow && (
        <div className="section-eyebrow mb-3">
          <span className={eyebrowClassName}>{eyebrow}</span>
        </div>
      )}
      <h2 className="mb-2 text-3xl font-light tracking-tight">{heading}</h2>
      <p className="mb-4 text-paomma-inkMuted">{product.shortDescription}</p>
      <dl className="space-y-2 text-sm">
        {product.specs.map((spec) => (
          <div key={spec.label} className="flex gap-2">
            <dt className="font-medium">{spec.label}:</dt>
            <dd className="text-paomma-inkMuted">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 flex items-center gap-3">
        <span className="text-lg font-semibold">{product.price.toLocaleString("ru-RU")} Сом</span>
        {product.inStock === false ? (
          <span className="text-xs font-medium uppercase tracking-wide text-red-600">
            Нет в наличии
          </span>
        ) : (
          <span className="text-xs font-medium uppercase tracking-wide text-green-600">
            В наличии
          </span>
        )}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <button
          onClick={() => addItem(product.id)}
          disabled={product.inStock === false}
          className="rounded-full bg-paomma-accent px-6 py-2 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:bg-paomma-line disabled:text-paomma-inkMuted disabled:hover:bg-paomma-line"
        >
          В корзину
        </button>
        <Link
          href={`/products/${product.id}`}
          className="rounded-xl bg-paomma-rose px-6 py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-roseDark"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
        {imageSide === "left" ? (
          <>
            {image}
            {info}
          </>
        ) : (
          <>
            {info}
            {image}
          </>
        )}
      </div>
    </section>
  );
}
