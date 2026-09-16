import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { productOverrideSchema } from "@/lib/schemas";
import { verifySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { setProductOverride } from "@/lib/productOverrides";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySession(session))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = productOverrideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await setProductOverride(parsed.data.id, {
      price: parsed.data.price,
      inStock: parsed.data.inStock,
    });
  } catch (err) {
    console.error("[admin products] failed to save override:", err);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
