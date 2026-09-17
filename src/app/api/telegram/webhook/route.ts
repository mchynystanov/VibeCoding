import { NextResponse } from "next/server";
import { answerTelegramCallback, updateOrderStatusMessage } from "@/lib/telegram";

// Telegram шлёт сюда апдейты (нажатия inline-кнопок под сообщением о
// заказе). Подлинность запроса проверяем секретным токеном, который сам
// Telegram возвращает в этом заголовке — его задаёт setWebhook при
// регистрации (см. scripts/set-telegram-webhook.mjs).
export async function POST(req: Request) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (!secret || secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  const callback = update?.callback_query;

  if (!callback || typeof callback.id !== "string") {
    return NextResponse.json({ ok: true });
  }

  const data: string = typeof callback.data === "string" ? callback.data : "";
  const chatId = callback.message?.chat?.id;
  const messageId = callback.message?.message_id;

  if (data === "noop" || typeof chatId !== "number" || typeof messageId !== "number") {
    await answerTelegramCallback(callback.id, "");
    return NextResponse.json({ ok: true });
  }

  const statusCode = data.startsWith("st:") ? data.slice(3) : null;
  if (!statusCode) {
    await answerTelegramCallback(callback.id, "");
    return NextResponse.json({ ok: true });
  }

  try {
    const label = await updateOrderStatusMessage({ chatId, messageId, statusCode });
    await answerTelegramCallback(callback.id, `Статус: ${label}`);
  } catch (err) {
    console.error("[telegram webhook] Failed to update order status:", err);
    await answerTelegramCallback(callback.id, "Не удалось обновить статус, попробуйте ещё раз");
  }

  return NextResponse.json({ ok: true });
}
