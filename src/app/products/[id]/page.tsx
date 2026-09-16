import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductById } from "@/lib/productOverrides";
import { getReviews } from "@/lib/reviews";

// TODO(owner): владелец пришлёт ссылку на образец страницы товара —
// текущая вёрстка временная (переиспользует стиль остального сайта),
// нужно будет привести к присланному образцу.

// force-dynamic (и без generateStaticParams — иначе Next всё равно
// пререндерит эти 3 id статически при сборке): цена/наличие можно менять
// из /admin без пересборки сайта, см. src/lib/productOverrides.ts.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.title} — Paomma`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(id);

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-block text-xs uppercase tracking-wide text-paomma-inkMuted underline"
        >
          ← На главную
        </Link>
        <ProductDetailClient product={product} reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}
