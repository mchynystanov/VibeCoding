import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductById, products } from "@/data/products";

// TODO(owner): владелец пришлёт ссылку на образец страницы товара —
// текущая вёрстка временная (переиспользует стиль остального сайта),
// нужно будет привести к присланному образцу.

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.title} — Paomma`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-xs uppercase tracking-wide text-paomma-inkMuted underline"
        >
          ← На главную
        </Link>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
