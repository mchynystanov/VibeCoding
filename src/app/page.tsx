import { Hero } from "@/components/Hero";
import { ProductDetailSection } from "@/components/ProductDetailSection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { WhyPaomma } from "@/components/WhyPaomma";
import { HowToChooseAndBundle } from "@/components/HowToChooseAndBundle";
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
      {electricPump && (
        <ProductDetailSection
          product={electricPump}
          eyebrow="Свобода быть рядом"
          heading="Беспроводной молокоотсос 3 в 1"
          imageSide="left"
        />
      )}
      {bionicPump && (
        <ProductDetailSection
          product={bionicPump}
          eyebrow="Хит продаж"
          heading="Свободные руки"
          imageSide="right"
        />
      )}
      <LifestyleSection />
      <WhyPaomma />
      {sterilizer && (
        <ProductDetailSection
          product={sterilizer}
          eyebrow="5 в 1"
          heading="Стерилизатор"
          imageSide="left"
        />
      )}
      <HowToChooseAndBundle />
      <Quiz />
      <Faq />
      <DeliveryAndOrder />
      <Footer />
    </>
  );
}
