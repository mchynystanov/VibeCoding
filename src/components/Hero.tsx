import Image from "next/image";

const TRUST_BULLETS = [
  "Оплата при получении",
  "Гарантия 12–24 месяца",
  "Доставка по КР и КЗ",
  "Бесшумная работа",
];

export function Hero() {
  return (
    <section>
      {/* Баннер уже содержит лого/слоган/бейджи как часть картинки — на мобильных
          показываем левую (текстовую) часть крупнее через object-left и более
          высокий (портретный) контейнер; на десктопе — почти весь кадр целиком. */}
      <div className="relative aspect-square w-full sm:aspect-[16/9] lg:aspect-[1713/918]">
        <Image
          src="/banner-paomma.png"
          alt="Paomma — забота с первых дней. Стильные и продуманные товары для мам и малышей: безопасные материалы, сертифицированная продукция, забота о каждом малыше."
          fill
          priority
          sizes="100vw"
          className="object-cover object-left sm:object-center"
        />
      </div>
      <div className="bg-paomma-surface">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <ul className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-wide text-paomma-inkMuted">
            {TRUST_BULLETS.map((bullet, i) => (
              <li key={bullet} className={i > 0 ? "border-l border-paomma-line pl-6" : ""}>
                {bullet}
              </li>
            ))}
          </ul>
          <a
            href="#products"
            className="mt-8 inline-block border border-paomma-ink px-10 py-3 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
          >
            Выбрать товар
          </a>
        </div>
      </div>
    </section>
  );
}
