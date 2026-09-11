import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schemas";
import { isRateLimited } from "@/lib/rateLimit";
import { sendTelegramMessage } from "@/lib/telegram";
import { appendOrderToSheet } from "@/lib/googleSheets";

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot заполнен ботом — тихо возвращаем 200, не палим детект.
  if (data.honeypot) {
    return NextResponse.json({ ok: true, orderId: null });
  }

  const orderId = `PM-${Date.now()}`;

  const [telegramResult, sheetsResult] = await Promise.allSettled([
    sendTelegramMessage({
      orderId,
      name: data.customer.name,
      phone: data.customer.phone,
      city: data.customer.city,
      deliveryMethod: data.deliveryMethod,
      address: data.customer.address,
      items: data.items,
      discount: data.discount,
      total: data.total,
      comment: data.comment,
    }),
    appendOrderToSheet({
      orderId,
      name: data.customer.name,
      phone: data.customer.phone,
      city: data.customer.city,
      deliveryMethod: data.deliveryMethod,
      address: data.customer.address,
      items: data.items,
      discount: data.discount,
      total: data.total,
      comment: data.comment,
    }),
  ]);

  if (telegramResult.status === "rejected") {
    console.error(`[order ${orderId}] Telegram notification failed:`, telegramResult.reason);
  }
  if (sheetsResult.status === "rejected") {
    console.error(`[order ${orderId}] Google Sheets append failed:`, sheetsResult.reason);
  }

  // Ни один канал не должен быть единой точкой отказа: если хотя бы один
  // прошёл — заказ считается принятым.
  const anySucceeded = telegramResult.status === "fulfilled" || sheetsResult.status === "fulfilled";

  if (!anySucceeded) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, orderId });
}
