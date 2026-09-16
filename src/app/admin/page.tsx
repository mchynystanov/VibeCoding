import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, getAdminCredentials, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { getProducts } from "@/lib/productOverrides";
import { getAllReviews } from "@/lib/reviews";
import { AdminProductForm } from "@/app/admin/AdminProductForm";
import { AdminReviews } from "@/app/admin/AdminReviews";
import { CredentialsForm } from "@/app/admin/CredentialsForm";
import { LogoutButton } from "@/app/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const creds = await getAdminCredentials();

  if (creds) {
    // Логин/пароль уже настроены — обычная проверка сессии.
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifySession(session))) {
      redirect("/admin/login");
    }
  }
  // Если credentials ещё нет — это первый заход, пускаем без пароля и
  // предлагаем его задать ниже (CredentialsForm).

  const products = await getProducts();
  const allReviews = await getAllReviews();
  const reviewSections = products.map((product) => ({
    productId: product.id,
    title: product.title,
    reviews: allReviews[product.id] ?? [],
  }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-tight">Админка Paomma</h1>
        {creds && <LogoutButton />}
      </div>

      {!creds && (
        <div className="mb-10 border border-paomma-accent p-6">
          <h2 className="mb-2 font-medium">Установите логин и пароль</h2>
          <p className="mb-4 text-sm text-paomma-inkMuted">
            Пароль ещё не задан — сейчас страница открыта без входа. Задайте логин и пароль, чтобы
            дальше сюда мог зайти только тот, кто их знает.
          </p>
          <CredentialsForm mode="setup" />
        </div>
      )}

      <div className="space-y-6">
        {products.map((product) => (
          <AdminProductForm key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10">
        <AdminReviews sections={reviewSections} />
      </div>

      {creds && (
        <details className="mt-10 border border-paomma-line p-6">
          <summary className="cursor-pointer font-medium">Сменить пароль</summary>
          <div className="mt-4">
            <CredentialsForm mode="change" />
          </div>
        </details>
      )}
    </main>
  );
}
