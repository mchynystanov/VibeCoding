import { NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rateLimit";
import { verifyCredentials, signSession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(`admin-login:${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  let valid: boolean;
  try {
    valid = verifyCredentials(parsed.data.username, parsed.data.password);
  } catch (err) {
    console.error("[admin login] misconfigured:", err);
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
