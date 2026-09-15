import Image from "next/image";

export function Hero() {
  return (
    <section>
      {/* Баннер уже содержит лого/слоган/бейджи как часть картинки — на мобильных
          показываем левую (текстовую) часть крупнее через object-left и более
          высокий (портретный) контейнер; на десктопе — почти весь кадр целиком.
          max-h ограничивает высоту баннера, чтобы он не занимал весь экран
          при первой загрузке — object-cover сам подберёт нужную часть кадра. */}
      <div className="relative aspect-square w-full max-h-[420px] sm:aspect-[16/9] sm:max-h-[380px] lg:aspect-[1714/918] lg:max-h-[560px]">
        <Image
          src="/banner-paomma.png"
          alt="Paomma — забота с первых дней. Стильные и продуманные товары для мам и малышей: безопасные материалы, сертифицированная продукция, забота о каждом малыше."
          fill
          priority
          sizes="100vw"
          className="object-cover object-left sm:object-top"
        />
      </div>
    </section>
  );
}
