const GUIDE = [
  { title: "Электрический молокоотсос", text: "если вы только начинаете и сцеживаетесь иногда." },
  { title: "Стерилизатор 5 в 1", text: "если важна стерилизация и подогрев, а не сцеживание." },
  { title: "«Свободные руки»", text: "если сцеживаетесь часто и хотите освободить руки." },
];

export function HowToChooseAndBundle() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Как выбрать</h2>
      <p className="mb-4 text-sm text-paomma-text/70">Вам подходит:</p>
      <ul className="mb-8 space-y-2 text-sm">
        {GUIDE.map((g) => (
          <li key={g.title}>
            <span className="font-semibold">{g.title}</span> — {g.text}
          </li>
        ))}
      </ul>
      <div className="rounded-xl bg-paomma-primary/10 p-6">
        <h3 className="font-semibold">Комплект: молокоотсос + стерилизатор</h3>
        <p className="mt-1 text-sm text-paomma-text/70">
          Купите вместе — скидка на комплект применится автоматически в корзине.
          {/* TODO(owner): открытый вопрос №5 — точный размер скидки на комплект не согласован */}
        </p>
      </div>
    </section>
  );
}
