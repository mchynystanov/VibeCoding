import { Hero } from "@/components/Hero";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { WhyPaomma } from "@/components/WhyPaomma";
import { BundleOffer } from "@/components/BundleOffer";
import { HowToChoose } from "@/components/HowToChoose";
import { Quiz } from "@/components/Quiz";
import { Faq } from "@/components/Faq";
import { DeliveryAndOrder } from "@/components/DeliveryAndOrder";
import { Footer } from "@/components/Footer";
import { getProductById } from "@/lib/productOverrides";

// Порядок блоков фиксирован разделом 4 ТЗ, но формат каталога изменён по
// запросу владельца: вместо сетки "Хиты продаж" — один блок на один товар
// (баннер + описание), см. ProductDetailSection.
// force-dynamic: цена/наличие можно менять из /admin без пересборки сайта —
// см. src/lib/productOverrides.ts.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [electricPump, bionicPump, sterilizer] = await Promise.all([
    getProductById("electric-pump"),
    getProductById("bionic-pump"),
    getProductById("sterilizer"),
  ]);

  return (
    <>
      <Hero />
      <WhyPaomma />
      <section className="mx-auto max-w-6xl px-4 py-3">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BundleOffer />
          <HowToChoose />
        </div>
      </section>
      {electricPump && (
        <ProductDetailSection
          product={electricPump}
          eyebrow="Свобода быть рядом"
          heading="Беспроводной молокоотсос 3 в 1"
          imageSide="left"
        />
      )}
      <LifestyleSection />
      {bionicPump && (
        <ProductDetailSection
          product={bionicPump}
          eyebrow="Хит продаж"
          eyebrowClassName="font-bold text-red-600"
          heading="Бионический молокоотсос «Свободные руки»"
          imageSide="left"
        />
      )}
      {sterilizer && (
        <ProductDetailSection product={sterilizer} heading="Стерилизатор 5 в 1" imageSide="left" />
      )}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <Quiz />
          <Faq />
        </div>
      </section>
      <DeliveryAndOrder />
      <Footer />
    </>
  );
}
