import { NextResponse } from "next/server";
import { reviewSchema } from "@/lib/schemas";
import { isRateLimited } from "@/lib/rateLimit";
import { addReview } from "@/lib/reviews";

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(`review:${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot заполнен ботом — тихо возвращаем 200, не палим детект.
  if (data.honeypot) {
    return NextResponse.json({ ok: true, review: null });
  }

  const review = await addReview(data.productId, {
    name: data.name,
    rating: data.rating,
    text: data.text,
  });

  return NextResponse.json({ ok: true, review });
}
