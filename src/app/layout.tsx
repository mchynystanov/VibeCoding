import type { Metadata } from "next";
import { Inter, Comfortaa } from "next/font/google";
import "./globals.css";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderForm } from "@/components/OrderForm";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

// Только для логотипа "paomma" — закруглённый геометрический шрифт, похожий
// на wordmark на paomma.ru (у нас нет их файла логотипа, только текст).
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-comfortaa",
});

export const metadata: Metadata = {
  title: "Paomma — сцеживайтесь. Кормите. Живите своей жизнью.",
  description:
    "Молокоотсосы и стерилизатор Paomma для мам в Кыргызстане и Казахстане. Оформите заказ на сайте — оплата при получении.",
  openGraph: {
    title: "Paomma",
    description:
      "Техника, которая освобождает время, а не просто гаджет. Молокоотсосы и стерилизатор Paomma.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${comfortaa.variable}`}>
      <body>
        {children}
        <CartDrawer />
        <OrderForm />
        <FloatingContactButton />
      </body>
    </html>
  );
}
