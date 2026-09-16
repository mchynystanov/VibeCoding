import Image from "next/image";
import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

/**
 * Показывает реальное фото товара (next/image), если оно есть в
 * product.images, иначе — цветной плейсхолдер с названием.
 */
export function ProductImage({ product }: { product: Product }) {
  const src = product.images[0];

  if (!src) {
    return <ProductImagePlaceholder title={product.title} />;
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-paomma-surface">
      <Image
        src={src}
        alt={product.title}
        fill
        sizes="(min-width: 640px) 50vw, 100vw"
        className="object-contain"
      />
    </div>
  );
}
