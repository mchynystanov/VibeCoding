import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function ProductsGrid() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Хиты продаж</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
