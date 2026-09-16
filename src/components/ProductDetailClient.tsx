"use client";

import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ProductImage";
import { ProductModes } from "@/components/ProductModes";
import { ProductSpecsTable } from "@/components/ProductSpecsTable";
import { ProductPackage } from "@/components/ProductPackage";
import { ProductFaq } from "@/components/ProductFaq";
import { ProductVideo } from "@/components/ProductVideo";
import { useCartStore } from "@/lib/cart-store";

export function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  if (product.videoId) {
    return <ProductVideo videoId={product.videoId} instructionUrl={product.instructionUrl} />;
  }

  return (
    <div>
      <div
        className={
          product.detailImages?.length ? "grid grid-cols-1 gap-10 sm:grid-cols-2" : "max-w-2xl"
        }
      >
        {product.detailImages?.length ? (
          <ProductImage product={{ ...product, images: product.detailImages }} />
        ) : null}
        <div>
          <h1 className="mb-2 text-3xl font-light tracking-tight">{product.title}</h1>
          <p className="mb-6 text-paomma-inkMuted">{product.shortDescription}</p>
          {!product.fullSpecsTable && (
            <dl className="space-y-2 text-sm">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex gap-2">
                  <dt className="font-medium">{spec.label}:</dt>
                  <dd className="text-paomma-inkMuted">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {product.price.toLocaleString("ru-RU")} Сом
            </span>
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
          <button
            onClick={() => addItem(product.id)}
            disabled={product.inStock === false}
            className="mt-6 rounded-full bg-paomma-accent px-8 py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:bg-paomma-line disabled:text-paomma-inkMuted disabled:hover:bg-paomma-line"
          >
            В корзину
          </button>
        </div>
      </div>
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
