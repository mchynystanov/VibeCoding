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
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Почему Paomma</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        {REASONS.map((r) => (
          <div key={r.title} className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-paomma-text/70">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
