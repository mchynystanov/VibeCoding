// TODO(owner): конкретный счётчик (Яндекс.Метрика и/или GA4) не выбран —
// открытый вопрос, не входящий в перечисленные 8 в разделе 17, но упомянутый
// в разделе 14 ("Аналитика"). Как только появится ID счётчика:
// 1. Подключить скрипт счётчика в src/app/layout.tsx.
// 2. Заменить console.debug ниже на реальный вызов ym()/gtag().
// Цели по ТЗ: "добавление в корзину", "отправка заказа", "квиз пройден".

type AnalyticsEvent = "add_to_cart" | "quiz_completed" | "order_submitted";

export function trackEvent(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, payload);
  }
}
