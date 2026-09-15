import type { Product } from "@/data/products";

export function ProductModes({
  modes,
  intensityLevels,
}: {
  modes: NonNullable<Product["modes"]>;
  intensityLevels?: Product["intensityLevels"];
}) {
  return (
    <section className="mt-16">
      <div className="section-eyebrow mb-3">
        <span>Режимы работы</span>
      </div>
      <h2 className="mb-8 text-2xl font-light tracking-tight">Обзор режимов</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-paomma-rose p-6">
          <h3 className="mb-4 font-medium text-paomma-ink">3 режима работы:</h3>
          <ul className="space-y-2 text-sm text-paomma-ink">
            {modes.map((mode) => (
              <li key={mode.title} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-paomma-ink"
                />
                {mode.title}
              </li>
            ))}
          </ul>
        </div>
        {intensityLevels && (
          <div className="bg-paomma-rose p-6">
            <h3 className="mb-2 font-medium text-paomma-ink">{intensityLevels.title}</h3>
            <p className="text-sm text-paomma-ink">{intensityLevels.note}</p>
          </div>
        )}
      </div>
    </section>
  );
}
