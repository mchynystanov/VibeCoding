import type { Product } from "@/data/products";

export function ProductModes({ modes }: { modes: NonNullable<Product["modes"]> }) {
  return (
    <section className="mt-16">
      <div className="section-eyebrow mb-3">
        <span>Режимы работы</span>
      </div>
      <h2 className="mb-8 text-2xl font-light tracking-tight">Обзор режимов</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {modes.map((mode) => (
          <div key={mode.title} className="border border-paomma-line bg-paomma-surface p-6">
            <h3 className="mb-2 font-medium">{mode.title}</h3>
            <p className="text-sm text-paomma-inkMuted">{mode.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
