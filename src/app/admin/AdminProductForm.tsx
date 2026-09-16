"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { getSalePrice } from "@/lib/pricing";

export function AdminProductForm({ product }: { product: Product }) {
  const [price, setPrice] = useState(product.price);
  const [inStock, setInStock] = useState(product.inStock !== false);
  const [salePercent, setSalePercent] = useState(product.salePercent ?? 0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const salePrice = getSalePrice(price, salePercent);

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, price, inStock, salePercent }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="border border-paomma-line p-6">
      <h3 className="mb-4 font-medium">{product.title}</h3>
      <label className="mb-4 block text-sm">
        Цена (Сом)
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 block w-full border border-paomma-line px-3 py-2"
        />
      </label>

      <label className="mb-4 block text-sm">
        Скидка на распродажу (%, 0 — без скидки)
        <input
          type="number"
          min={0}
          max={90}
          value={salePercent}
          onChange={(e) => setSalePercent(Number(e.target.value))}
          className="mt-1 block w-full border border-paomma-line px-3 py-2"
        />
      </label>
      {salePrice !== null && (
        <p className="mb-4 text-sm text-paomma-inkMuted">
          Покажется как: <span className="line-through">{price.toLocaleString("ru-RU")} Сом</span>{" "}
          <span className="font-semibold text-paomma-accent">
            {salePrice.toLocaleString("ru-RU")} Сом
          </span>
        </p>
      )}

      <div className="mb-4 flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`stock-${product.id}`}
            checked={inStock}
            onChange={() => setInStock(true)}
          />
          В наличии
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={`stock-${product.id}`}
            checked={!inStock}
            onChange={() => setInStock(false)}
          />
          Нет в наличии
        </label>
      </div>
      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="rounded-full bg-paomma-accent px-6 py-2 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Сохраняем…" : "Сохранить"}
      </button>
      {status === "saved" && <span className="ml-3 text-sm text-green-600">Сохранено</span>}
      {status === "error" && <span className="ml-3 text-sm text-red-600">Ошибка сохранения</span>}
    </div>
  );
}
