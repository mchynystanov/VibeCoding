"use client";

import type { Product } from "@/data/products";
import type { Review } from "@/lib/reviews";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductModes } from "@/components/ProductModes";
import { ProductSpecsTable } from "@/components/ProductSpecsTable";
import { ProductPackage } from "@/components/ProductPackage";
import { ProductFaq } from "@/components/ProductFaq";
import { ProductVideo } from "@/components/ProductVideo";
import { useCartStore } from "@/lib/cart-store";
import { getSalePrice } from "@/lib/pricing";
import { SaleCountdown } from "@/components/SaleCountdown";
import { RandomSaleCountdown } from "@/components/RandomSaleCountdown";

export function ProductDetailClient({ product, reviews }: { product: Product; reviews: Review[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const effectiveEndsAt = product.randomCountdown ? undefined : product.saleEndsAt;
  const salePrice = getSalePrice(product.price, product.salePercent, effectiveEndsAt);
  const effectivePrice = salePrice ?? product.price;

  if (product.videoId) {
    return <ProductVideo videoId={product.videoId} instructionUrl={product.instructionUrl} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <ProductGallery product={product} />
        <div>
          <h1 className="mb-2 text-3xl font-light tracking-tight">{product.title}</h1>
          <p className="mb-4 text-paomma-inkMuted">{product.shortDescription}</p>
          {product.color && (
            <p className="mb-4 text-sm">
              <span className="font-medium">Цвет:</span>{" "}
              <span className="text-paomma-inkMuted">{product.color}</span>
            </p>
          )}
          <p className="flex flex-wrap items-center gap-3">
            {salePrice !== null ? (
              <>
                <span className="text-base text-paomma-inkMuted line-through">
                  {product.price.toLocaleString("ru-RU")} Сом
                </span>
                <span className="text-3xl font-bold text-paomma-accent">
                  {salePrice.toLocaleString("ru-RU")} Сом
                </span>
                <span className="rounded-full bg-paomma-accent px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-white">
                  −{product.salePercent}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold">
                {product.price.toLocaleString("ru-RU")} Сом
              </span>
            )}
            {product.inStock === false ? (
              <span className="text-xs font-medium uppercase tracking-wide text-red-600">
                Нет в наличии
              </span>
            ) : (
              <span className="text-xs font-medium uppercase tracking-wide text-green-600">
                Есть в наличии
              </span>
            )}
          </p>
          {salePrice !== null && product.randomCountdown && (
            <p className="mt-1">
              <RandomSaleCountdown productId={product.id} />
            </p>
          )}
          {salePrice !== null && !product.randomCountdown && effectiveEndsAt && (
            <p className="mt-1">
              <SaleCountdown endsAt={effectiveEndsAt} />
            </p>
          )}
          <button
            onClick={() => addItem({ id: product.id, title: product.title, price: effectivePrice })}
            disabled={product.inStock === false}
            className="mt-6 rounded-full bg-paomma-accent px-8 py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:bg-paomma-line disabled:text-paomma-inkMuted disabled:hover:bg-paomma-line"
          >
            В корзину
          </button>
        </div>
      </div>
      <ProductTabs product={product} reviews={reviews} />
      {product.modes && (
        <ProductModes modes={product.modes} intensityLevels={product.intensityLevels} />
      )}
      {product.fullSpecsTable && <ProductSpecsTable specs={product.fullSpecsTable} />}
      {product.packageDimensions && product.packageContents && (
        <ProductPackage dimensions={product.packageDimensions} contents={product.packageContents} />
      )}
      {product.faq && <ProductFaq faq={product.faq} />}
    </div>
  );
}
