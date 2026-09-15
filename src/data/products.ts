export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  price: number;
  currency: "KGS"; // Открытый вопрос №6 из ТЗ решён владельцем: валюта — Сом (см. TODO.md)
  images: string[];
  specs: { label: string; value: string }[];
  category: "hit" | "accessory";
  badge?: string;
};

export const products: Product[] = [
  {
    id: "electric-pump",
    title: "Беспроводной молокоотсос 3 в 1",
    shortDescription: "Забота, которая подстраивается под ваш ритм жизни",
    price: 2700,
    currency: "KGS",
    images: ["/products/paomma-molokootsos-electric.webp"],
    specs: [
      { label: "Цвет", value: "almond milk (бежевый)" },
      { label: "Объём", value: "180 мл" },
      { label: "Гарантийный срок", value: "12 месяцев с даты покупки" },
      { label: "Тип сцеживания", value: "массаж, сцеживание, экспресс 2-в-1" },
      { label: "Дисплей", value: "сенсорный LED-дисплей" },
      { label: "Питание", value: "от аккумулятора" },
      { label: "Тип молокоотсоса", value: "электрический" },
      { label: "Функция памяти", value: "есть" },
      { label: "Тип мотора", value: "двухфазный" },
      { label: "Режимы работы", value: "3 режима, 9 уровней интенсивности" },
      { label: "Мощность аккумулятора", value: "1200 мАч" },
      { label: "Время автономной работы", value: "до 180 минут" },
      { label: "Время зарядки", value: "2 часа" },
      { label: "Количество сеансов сцеживания", value: "4–6" },
      { label: "Срок службы", value: "3 года с даты изготовления" },
    ],
    category: "hit",
  },
  {
    id: "sterilizer",
    title: "Стерилизатор-подогреватель 5 в 1",
    shortDescription: "Стерилизация, подогрев, разморозка и приготовление прикорма",
    // TODO(owner): цена указана в старых рублёвых цифрах прайса поставщика,
    // переведена в Сом только по названию валюты — реальную цену в Сом нужно
    // подтвердить (см. открытый вопрос №6 в TODO.md).
    price: 4144,
    currency: "KGS",
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
    // TODO(owner): цена указана в старых рублёвых цифрах прайса поставщика,
    // переведена в Сом только по названию валюты — реальную цену в Сом нужно
    // подтвердить (см. открытый вопрос №6 в TODO.md).
    price: 4400,
    currency: "KGS",
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
