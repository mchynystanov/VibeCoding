import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductById } from "@/lib/productOverrides";
import { getReviews } from "@/lib/reviews";
import { getSalePrice } from "@/lib/pricing";
import { SITE_URL } from "@/lib/siteConfig";

// SEO: заголовки/описания под конкретные поисковые запросы для двух
// приоритетных товаров (запрос владельца). Остальные товары используют
// заголовок по умолчанию — `${product.title} — Paomma`.
const SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  "bionic-pump": {
    title: "Молокоотсос купить в Бишкеке — бионический «Свободные руки» | Paomma",
    description:
      "Бионический молокоотсос Paomma «Свободные руки» — купить в Бишкеке с доставкой. Оплата при получении, гарантия 12 месяцев.",
  },
  sterilizer: {
    title: "Стерилизатор купить в Бишкеке — Paomma 5 в 1",
    description:
      "Стерилизатор-подогреватель Paomma 5 в 1 — купить в Бишкеке с доставкой. Оплата при получении, гарантия 12 месяцев.",
  },
};

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
  const seo = SEO_OVERRIDES[id];
  const title = seo?.title ?? `${product.title} — Paomma`;
  const description = seo?.description ?? product.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${id}`,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(id);

  const effectiveEndsAt = product.randomCountdown ? undefined : product.saleEndsAt;
  const salePrice = getSalePrice(product.price, product.salePercent, effectiveEndsAt);
  const effectivePrice = salePrice ?? product.price;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images.map((src) => `${SITE_URL}${src}`),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${id}`,
      priceCurrency: product.currency,
      price: effectivePrice,
      availability:
        product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    };
  }

  return (
    <>
      {/* JSON собран сервером из собственных данных каталога, не из пользовательского ввода. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
