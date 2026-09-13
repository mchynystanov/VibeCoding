const STEPS = [
  "Выберите товар или пройдите короткий квиз-подборщик",
  "Добавьте в корзину и оформите заявку — это займёт меньше минуты",
  "Мы свяжемся с вами для подтверждения заказа",
  "Согласуем способ получения: доставка или самовывоз",
  "Получаете заказ и оплачиваете при получении",
];

const ZONES = ["Бишкек", "Чуйская область", "Регионы"];

export function DeliveryAndOrder() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="section-eyebrow mb-3">
        <span>Доставка</span>
      </div>
      <h2 className="mb-8 text-3xl font-light tracking-tight">Доставка и как заказать</h2>
      <ol className="mb-10 space-y-2 text-sm">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="font-medium">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ZONES.map((zone) => (
          <div key={zone} className="border border-paomma-line p-4 text-center">
            <p className="font-medium">{zone}</p>
            <p className="mt-1 text-sm text-paomma-inkMuted">Сроки и стоимость уточняются</p>
            {/* TODO(owner): открытый вопрос №4 — стоимость и сроки доставки по каждой зоне не определены */}
          </div>
        ))}
      </div>
    </section>
  );
}
