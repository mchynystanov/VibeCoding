import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteReviewSchema } from "@/lib/schemas";
import { verifySession, getAdminCredentials, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { deleteReview } from "@/lib/reviews";

export async function DELETE(req: Request) {
  // Как и в /api/admin/products: пока логин/пароль не заданы (первый заход),
  // /admin открыт без сессии — после setAdminCredentials() эта ветка больше
  // не сработает.
  const creds = await getAdminCredentials();
  if (creds) {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifySession(session))) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = deleteReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 400 });
  }

  try {
    await deleteReview(parsed.data.productId, parsed.data.reviewId);
  } catch (err) {
    console.error("[admin reviews] failed to delete review:", err);
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
