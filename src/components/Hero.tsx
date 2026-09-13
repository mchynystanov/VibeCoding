const TRUST_BULLETS = [
  "Оплата при получении",
  "Гарантия 12–24 месяца",
  "Доставка по КР и КЗ",
  "Бесшумная работа",
];

export function Hero() {
  return (
    <section className="bg-paomma-surface">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="section-eyebrow mb-4 justify-center">
          <span>Paomma</span>
        </div>
        <h1 className="text-3xl font-light tracking-tight sm:text-5xl">
          Сцеживайтесь. Кормите.
          <br />
          Живите своей жизнью.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-paomma-inkMuted">
          Техника Paomma освобождает время, а не просто помогает — она заботится о вас так же, как
          вы заботитесь о малыше.
        </p>
        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 divide-x divide-paomma-line text-xs uppercase tracking-wide text-paomma-inkMuted">
          {TRUST_BULLETS.map((bullet, i) => (
            <li key={bullet} className={i > 0 ? "pl-6" : ""}>
              {bullet}
            </li>
          ))}
        </ul>
        <a
          href="#products"
          className="mt-10 inline-block border border-paomma-ink px-10 py-3 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
        >
          Выбрать товар
        </a>
      </div>
    </section>
  );
}
