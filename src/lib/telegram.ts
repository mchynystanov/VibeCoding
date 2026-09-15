import type { CartItem } from "@/lib/pricing";

type OrderNotification = {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  deliveryMethod: "delivery" | "pickup";
  address: string | null;
  items: CartItem[];
  discount: number;
  total: number;
  comment: string | null;
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildMessage(order: OrderNotification): string {
  const deliveryLabel = order.deliveryMethod === "delivery" ? "доставка" : "самовывоз";
  const lines = [
    `🍼 Новый заказ #${escapeHtml(order.orderId)}`,
    `${escapeHtml(order.name)}, ${escapeHtml(order.phone)}`,
    `Город: ${escapeHtml(order.city)}, ${deliveryLabel}`,
  ];

  if (order.address) {
    lines.push(`Адрес: ${escapeHtml(order.address)}`);
  }

  lines.push("");
  for (const item of order.items) {
    lines.push(
      `— ${escapeHtml(item.title)} ×${item.qty} — ${(item.price * item.qty).toLocaleString("ru-RU")} Сом`,
    );
  }

  if (order.discount > 0) {
    lines.push(`Скидка за комплект: −${order.discount.toLocaleString("ru-RU")} Сом`);
  }
  lines.push(`Итого: ${order.total.toLocaleString("ru-RU")} Сом`);

  if (order.comment) {
    lines.push("");
    lines.push(`Комментарий: ${escapeHtml(order.comment)}`);
  }

  return lines.join("\n");
}

export async function sendTelegramMessage(order: OrderNotification): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(order),
      parse_mode: "HTML",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram API error: ${res.status} ${body}`);
  }
}
