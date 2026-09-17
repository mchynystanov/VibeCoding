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

export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "🆕 Новый",
  done: "✅ Обработан",
  shipped: "📦 Отправлен",
  cancelled: "❌ Отменён",
};

// Первая строка — только для отображения текущего статуса (клик по ней не
// меняет статус, callback_data "noop"), вторая — кнопки смены статуса.
// Статус живёт прямо в клавиатуре сообщения, а не в тексте — так не нужно
// перепарсивать/переэкранировать HTML при каждом редактировании.
function buildStatusKeyboard(currentLabel: string) {
  return {
    inline_keyboard: [
      [{ text: `Статус: ${currentLabel}`, callback_data: "noop" }],
      [
        { text: "✅ Обработан", callback_data: "st:done" },
        { text: "📦 Отправлен", callback_data: "st:shipped" },
        { text: "❌ Отменён", callback_data: "st:cancelled" },
      ],
    ],
  };
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
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatIdsRaw) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured");
  }

  // TELEGRAM_CHAT_ID может содержать несколько id через запятую — заказ
  // уходит всем сразу (владельцу, менеджеру и т.п.).
  const chatIds = chatIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const text = buildMessage(order);

  const results = await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: buildStatusKeyboard(ORDER_STATUS_LABELS.new),
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Telegram API error for chat ${chatId}: ${res.status} ${body}`);
      }
    }),
  );

  const allFailed = results.every((result) => result.status === "rejected");
  if (allFailed) {
    const reasons = results.map((result) => (result as PromiseRejectedResult).reason).join("; ");
    throw new Error(`Telegram delivery failed for all recipients: ${reasons}`);
  }
}

export async function updateOrderStatusMessage(params: {
  chatId: number | string;
  messageId: number;
  statusCode: string;
}): Promise<string> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  const label = ORDER_STATUS_LABELS[params.statusCode];
  if (!label) {
    throw new Error(`Unknown order status code: ${params.statusCode}`);
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: params.chatId,
      message_id: params.messageId,
      reply_markup: buildStatusKeyboard(label),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram editMessageReplyMarkup error: ${res.status} ${body}`);
  }

  return label;
}

export async function answerTelegramCallback(callbackQueryId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  }).catch(() => {
    // Best-effort — если это не пройдёт, кнопка просто "подвиснет" визуально
    // на пару секунд у пользователя, статус уже обновлён отдельным вызовом.
  });
}
