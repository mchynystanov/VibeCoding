export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  currency: "RUB"; // TODO(owner): открытый вопрос №6 — валюта расчётов с покупателем (₽ или конвертация в KGS/KZT)
  images: string[];
  specs: { label: string; value: string }[];
  category: "hit" | "accessory";
  badge?: string;
};

export const products: Product[] = [
  {
    id: "electric-pump",
    title: "Молокоотсос электрический",
    shortDescription: "Для комфортного ежедневного сцеживания",
    price: 2475,
    currency: "RUB",
    images: ["/products/paomma-molokootsos-electric.webp"],
    specs: [
      // TODO(owner): открытый вопрос №8 — гарантия на базовый электрический молокоотсос не найдена у поставщика
      { label: "Гарантия", value: "уточняется" },
    ],
    category: "hit",
  },
  {
    id: "sterilizer",
    title: "Стерилизатор-подогреватель 5 в 1",
    shortDescription: "Стерилизация, подогрев, разморозка и приготовление прикорма",
    price: 4144,
    currency: "RUB",
    images: ["/products/paomma-sterilizer-5v1.webp"],
    specs: [
      {
        label: "Функции",
        value:
          "стерилизация, подогрев молока/смеси (45–55 °C), бережная разморозка (37–44 °C), приготовление прикорма на пару (56–85 °C), поддержание температуры",
      },
      {
        label: "Доп. функции",
        value: "отложенный старт, защита от перегрева (автоотключение), бесшумный ночной режим",
      },
      { label: "Стерилизация", value: "~15 минут на цикл" },
      {
        label: "Вместимость чаши",
        value:
          "2 бутылочки (180/240 мл) + 6 пустышек + 2 кольца + 2 соски; отдельные ёмкости для прикорма 150–240 мл",
      },
      { label: "Мощность", value: "270 Вт, 220–240В/50Гц" },
      { label: "Гарантия", value: "24 месяца" },
    ],
    category: "hit",
  },
  {
    id: "bionic-pump",
    title: "Молокоотсос бионический «Свободные руки»",
    shortDescription: "4 режима, до 180 минут автономности, полностью автономная работа",
    price: 4400,
    currency: "RUB",
    images: ["/products/paomma-molokootsos-bionic.webp"],
    specs: [
      { label: "Режимы", value: "Стимуляция → Массаж → Сцеживание → Бионический (3-я фаза)" },
      { label: "Уровни интенсивности", value: "15" },
      { label: "Автономность", value: "до 180 минут (≈6 сеансов без подзарядки)" },
      { label: "Автоотключение", value: "через 30 минут бездействия" },
      { label: "Сила всасывания", value: "до 300 мм рт. ст." },
      { label: "Размеры воронок", value: "16 / 18 / 20 / 22 мм (4 размера в комплекте)" },
      { label: "Вес", value: "238,3 г" },
      { label: "Гарантия", value: "12 месяцев" },
    ],
    category: "hit",
    badge: "ХИТ",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
