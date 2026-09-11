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
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Доставка и как заказать</h2>
      <ol className="mb-8 space-y-2 text-sm">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="font-semibold">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ZONES.map((zone) => (
          <div key={zone} className="rounded-xl bg-white p-4 text-center shadow-sm">
            <p className="font-semibold">{zone}</p>
            <p className="mt-1 text-sm text-paomma-text/70">Сроки и стоимость уточняются</p>
            {/* TODO(owner): открытый вопрос №4 — стоимость и сроки доставки по каждой зоне не определены */}
          </div>
        ))}
      </div>
    </section>
  );
}
