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
import { getProductById } from "@/data/products";

// Порядок блоков фиксирован разделом 4 ТЗ, но формат каталога изменён по
// запросу владельца: вместо сетки "Хиты продаж" — один блок на один товар
// (баннер + описание), см. ProductDetailSection.
export default function HomePage() {
  const electricPump = getProductById("electric-pump");
  const bionicPump = getProductById("bionic-pump");
  const sterilizer = getProductById("sterilizer");

  return (
    <>
      <Hero />
      <WhyPaomma />
      <BundleOffer />
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
          heading="Свободные руки"
          imageSide="left"
        />
      )}
      {sterilizer && (
        <ProductDetailSection
          product={sterilizer}
          eyebrow="5 в 1"
          heading="Стерилизатор"
          imageSide="left"
        />
      )}
      <HowToChoose />
      <Quiz />
      <Faq />
      <DeliveryAndOrder />
      <Footer />
    </>
  );
}
