import type { Product } from "@/data/products";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";

export function ProductCard({ product }: { product: Product }) {
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
      {/* TODO(этап 4): кнопки "Подробнее" / "В корзину" — подключить cart-store */}
    </div>
  );
}
