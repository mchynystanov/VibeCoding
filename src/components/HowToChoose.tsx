const GUIDE = [
  { title: "Электрический молокоотсос", text: "если вы только начинаете и сцеживаетесь иногда." },
  { title: "Стерилизатор 5 в 1", text: "если важна стерилизация и подогрев, а не сцеживание." },
  { title: "«Свободные руки»", text: "если сцеживаетесь часто и хотите освободить руки." },
];

export function HowToChoose() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="section-eyebrow mb-3">
        <span>Гид</span>
      </div>
      <h2 className="mb-6 text-3xl font-light tracking-tight">Как выбрать</h2>
      <p className="mb-4 text-sm text-paomma-inkMuted">Вам подходит:</p>
      <ul className="space-y-2 text-sm">
        {GUIDE.map((g) => (
          <li key={g.title}>
            <span className="font-medium">{g.title}</span> — {g.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
