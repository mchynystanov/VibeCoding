import Image from "next/image";

export function Hero() {
  return (
    <section>
      {/* Файл банера уже обрезан по вертикали (от сердечка до соски), поэтому
          object-left достаточно на всех брейкпоинтах — обрезка идёт только
          по горизонтали на узких экранах, верх/низ кадра не теряются. */}
      <div className="relative aspect-square w-full sm:aspect-[16/9] lg:aspect-[1714/854]">
        <Image
          src="/banner-paomma.png"
          alt="Paomma — забота с первых дней. Стильные и продуманные товары для мам и малышей: безопасные материалы, сертифицированная продукция, забота о каждом малыше."
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
        />
      </div>
    </section>
  );
}
