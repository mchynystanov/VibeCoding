const SCENARIOS = [
  "Поиграть с малышом",
  "Выпить кофе, пока горячий",
  "Поработать или ответить на сообщения",
  "Просто отдохнуть",
];

export function LifestyleSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="section-eyebrow mb-3">
        <span>Свобода</span>
      </div>
      <h2 className="mb-8 max-w-lg text-3xl font-light tracking-tight">
        Пока молокоотсос работает, вы можете...
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {SCENARIOS.map((text, i) => (
          <div key={text} className="border-t border-paomma-line pt-4">
            <span className="text-xs text-paomma-inkMuted">0{i + 1}</span>
            <p className="mt-1 text-sm">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
