import type { OrderNotification } from "@/lib/telegram";

function buildMessage(order: OrderNotification): string {
  const deliveryLabel = order.deliveryMethod === "delivery" ? "доставка" : "самовывоз";
  const lines = [
    `⚠️ РЕЗЕРВНАЯ отправка: Telegram и Google Sheets не сработали`,
    `🍼 Новый заказ ${order.orderId}`,
    `${order.name}, ${order.phone}`,
    `Город: ${order.city}, ${deliveryLabel}`,
  ];

  if (order.address) lines.push(`Адрес: ${order.address}`);

  lines.push("");
  for (const item of order.items) {
    lines.push(
      `— ${item.title} ×${item.qty} — ${(item.price * item.qty).toLocaleString("ru-RU")} Сом`,
    );
  }

  if (order.discount > 0) {
    lines.push(`Скидка за комплект: −${order.discount.toLocaleString("ru-RU")} Сом`);
  }
  lines.push(`Итого: ${order.total.toLocaleString("ru-RU")} Сом`);

  if (order.comment) {
    lines.push("");
    lines.push(`Комментарий: ${order.comment}`);
  }

  return lines.join("\n");
}

export async function sendWhatsAppFallback(order: OrderNotification): Promise<void> {
  const phone = process.env.WHATSAPP_CALLMEBOT_PHONE;
  const apiKey = process.env.WHATSAPP_CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    throw new Error("WHATSAPP_CALLMEBOT_PHONE or WHATSAPP_CALLMEBOT_APIKEY is not configured");
  }

  const params = new URLSearchParams({ phone, text: buildMessage(order), apikey: apiKey });
  const res = await fetch(`https://api.callmebot.com/whatsapp.php?${params.toString()}`, {
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`CallMeBot WhatsApp error: HTTP ${res.status}`);
  }
}
