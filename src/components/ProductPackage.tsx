import type { Product } from "@/data/products";

export function ProductPackage({
  dimensions,
  contents,
}: {
  dimensions: NonNullable<Product["packageDimensions"]>;
  contents: NonNullable<Product["packageContents"]>;
}) {
  return (
    <section className="mt-16">
      <div className="section-eyebrow mb-3">
        <span>Комплектация</span>
      </div>
      <h2 className="mb-8 text-2xl font-light tracking-tight">Габариты и комплектация</h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <dl className="space-y-2 text-sm">
          {dimensions.map((dim) => (
            <div key={dim.label} className="flex gap-2">
              <dt className="font-medium">{dim.label}:</dt>
              <dd className="text-paomma-inkMuted">{dim.value}</dd>
            </div>
          ))}
        </dl>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-paomma-inkMuted">
          {contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
