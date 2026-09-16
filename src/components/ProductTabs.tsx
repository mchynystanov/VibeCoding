"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

type TabKey = "about" | "specs" | "instructions" | "reviews";

const TAB_LABELS: Record<TabKey, string> = {
  about: "О товаре",
  specs: "Характеристики и состав",
  instructions: "Инструкция",
  reviews: "Отзывы",
};

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabKey>("about");

  return (
    <div className="mt-12">
      <div className="flex gap-6 overflow-x-auto border-b border-paomma-line">
        {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm transition ${
              active === key
                ? "border-paomma-ink font-medium text-paomma-ink"
                : "border-transparent text-paomma-inkMuted hover:text-paomma-ink"
            }`}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "about" &&
          (product.aboutText ? (
            <p className="max-w-2xl text-sm text-paomma-inkMuted">{product.aboutText}</p>
          ) : (
            <p className="text-sm text-paomma-inkMuted">{product.shortDescription}</p>
          ))}

        {active === "specs" && (
          <dl className="divide-y divide-paomma-line border-y border-paomma-line text-sm">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex gap-2 px-2 py-3 ${i % 2 === 1 ? "bg-paomma-surface" : ""}`}
              >
                <dt className="w-1/2 font-medium sm:w-1/3">{spec.label}</dt>
                <dd className="text-paomma-inkMuted">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "instructions" &&
          (product.usageInstructions ? (
            <ul className="max-w-2xl space-y-3 text-sm text-paomma-inkMuted">
              {product.usageInstructions.map((step) => (
                <li key={step} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-paomma-inkMuted">
              Инструкция уточняется — свяжитесь с нами, если нужна помощь с использованием.
            </p>
          ))}

        {active === "reviews" && (
          <p className="text-sm text-paomma-inkMuted">
            Отзывов пока нет — станьте первым, кто оставит отзыв после покупки.
          </p>
        )}
      </div>
    </div>
  );
}
