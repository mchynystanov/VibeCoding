import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductsGrid } from "@/components/ProductsGrid";
import { BionicPumpSection } from "@/components/BionicPumpSection";
import { LifestyleSection } from "@/components/LifestyleSection";
import { WhyPaomma } from "@/components/WhyPaomma";
import { SterilizerSection } from "@/components/SterilizerSection";
import { HowToChooseAndBundle } from "@/components/HowToChooseAndBundle";
import { Quiz } from "@/components/Quiz";
import { Faq } from "@/components/Faq";
import { DeliveryAndOrder } from "@/components/DeliveryAndOrder";
import { Footer } from "@/components/Footer";

// Порядок блоков фиксирован разделом 4 ТЗ — не менять без явного запроса.
export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <ProductsGrid />
      <BionicPumpSection />
      <LifestyleSection />
      <WhyPaomma />
      <SterilizerSection />
      <HowToChooseAndBundle />
      <Quiz />
      <Faq />
      <DeliveryAndOrder />
      <Footer />
    </>
  );
}
