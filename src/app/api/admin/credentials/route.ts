import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCredentialsSchema } from "@/lib/schemas";
import {
  getAdminCredentials,
  setAdminCredentials,
  verifyCredentials,
  verifySession,
  signSession,
  ADMIN_SESSION_COOKIE,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = adminCredentialsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const existing = await getAdminCredentials();

  if (existing) {
    // Смена пароля: нужна и активная сессия, и текущий пароль.
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifySession(session))) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    const currentOk =
      data.currentPassword && (await verifyCredentials(existing.username, data.currentPassword));
    if (!currentOk) {
      return NextResponse.json({ ok: false, error: "wrong_current_password" }, { status: 401 });
    }
  }

  await setAdminCredentials(data.username, data.password);

  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  if (token) {
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 12 * 60 * 60,
    });
  }
  return res;
}
