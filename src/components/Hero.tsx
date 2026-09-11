const TRUST_BULLETS = [
  "Оплата при получении — без предоплаты и рисков",
  "Гарантия на технику — от 12 до 24 месяцев в зависимости от модели",
  "Доставка по Бишкеку, Чуйской области и регионам",
  "Бионические модели работают бесшумно — можно сцеживаться даже ночью",
];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold sm:text-5xl">
        Сцеживайтесь. Кормите. Живите своей жизнью.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-paomma-text/70">
        Техника Paomma освобождает время, а не просто помогает — она заботится о вас так же, как вы
        заботитесь о малыше.
      </p>
      <ul className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 text-left text-sm sm:grid-cols-2">
        {TRUST_BULLETS.map((bullet) => (
          <li key={bullet} className="flex gap-2 rounded-lg bg-white p-3 shadow-sm">
            <span aria-hidden>✓</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <a
        href="#products"
        className="mt-8 inline-block rounded-full bg-paomma-primary px-8 py-3 font-semibold text-white transition hover:bg-paomma-primaryDark"
      >
        Выбрать товар
      </a>
    </section>
  );
}
