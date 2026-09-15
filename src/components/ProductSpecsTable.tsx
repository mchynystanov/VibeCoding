import type { Product } from "@/data/products";

export function ProductSpecsTable({ specs }: { specs: NonNullable<Product["fullSpecsTable"]> }) {
  return (
    <section className="mt-16">
      <div className="section-eyebrow mb-3">
        <span>Характеристики</span>
      </div>
      <h2 className="mb-8 text-2xl font-light tracking-tight">Полные характеристики</h2>
      <dl className="divide-y divide-paomma-line border-y border-paomma-line text-sm">
        {specs.map((spec, i) => (
          <div
            key={spec.label}
            className={`flex gap-2 px-2 py-3 ${i % 2 === 1 ? "bg-paomma-surface" : ""}`}
          >
            <dt className="w-1/2 font-medium sm:w-1/3">{spec.label}</dt>
            <dd className="text-paomma-inkMuted">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
