const SCENARIOS = [
  { emoji: "🧸", text: "Поиграть с малышом" },
  { emoji: "☕", text: "Выпить кофе, пока горячий" },
  { emoji: "💻", text: "Поработать или ответить на сообщения" },
  { emoji: "🛋️", text: "Просто отдохнуть" },
];

export function LifestyleSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Пока молокоотсос работает, вы можете...</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SCENARIOS.map((s) => (
          <div key={s.text} className="rounded-xl bg-white p-4 text-center shadow-sm">
            <div className="text-3xl" aria-hidden>
              {s.emoji}
            </div>
            <p className="mt-2 text-sm">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
