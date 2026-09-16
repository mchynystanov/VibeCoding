"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

/**
 * Галерея фото товара: если фото несколько — колонка миниатюр слева +
 * большой кадр, клик по миниатюре меняет большой кадр. При одном фото
 * (или без фото) — просто большой кадр/плейсхолдер, без миниатюр.
 */
export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = product.images;

  if (images.length === 0) {
    return <ProductImagePlaceholder title={product.title} />;
  }

  const activeSrc = images[activeIndex] ?? images[0];

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="flex max-h-[560px] w-16 flex-col gap-2 overflow-y-auto sm:w-20">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              aria-label={`Фото ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-paomma-surface ${
                i === activeIndex ? "ring-2 ring-paomma-ink" : ""
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-paomma-surface">
        <Image
          src={activeSrc}
          alt={product.title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
