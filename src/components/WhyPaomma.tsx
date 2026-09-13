const REASONS = [
  { title: "Комфорт", text: "Техника создана так, чтобы сцеживание не было испытанием." },
  {
    title: "Свобода",
    text: "Бионические модели работают без рук — вы не привязаны к розетке или дивану.",
  },
  {
    title: "Продуманность",
    text: "4 размера воронок, несколько режимов и уровней интенсивности — под вашу грудь и ваш ритм.",
  },
  {
    title: "Безопасность",
    text: "Автоотключение при бездействии и защита от перегрева у стерилизатора.",
  },
  {
    title: "Поддержка",
    text: "Мы на связи в Telegram и WhatsApp — отвечаем на вопросы до и после заказа.",
  },
];

export function WhyPaomma() {
  return (
    <section className="bg-paomma-surface">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="section-eyebrow mb-3">
          <span>Почему мы</span>
        </div>
        <h2 className="mb-8 text-3xl font-light tracking-tight">Почему Paomma</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 className="font-medium">{r.title}</h3>
              <p className="mt-1 text-sm text-paomma-inkMuted">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
