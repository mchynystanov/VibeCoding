import type { Product } from "@/data/products";

export function ProductFaq({ faq }: { faq: NonNullable<Product["faq"]> }) {
  return (
    <section className="mt-16">
      <div className="section-eyebrow mb-3">
        <span>Вопросы</span>
      </div>
      <h2 className="mb-8 text-2xl font-light tracking-tight">Частые вопросы о товаре</h2>
      <div className="divide-y divide-paomma-line border-t border-paomma-line">
        {faq.map((item) => (
          <details key={item.q} className="py-4">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 text-sm text-paomma-inkMuted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
