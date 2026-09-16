import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { getProducts } from "@/lib/productOverrides";
import { AdminProductForm } from "@/app/admin/AdminProductForm";
import { LogoutButton } from "@/app/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySession(session))) {
    redirect("/admin/login");
  }

  const products = await getProducts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-tight">Админка Paomma</h1>
        <LogoutButton />
      </div>
      <div className="space-y-6">
        {products.map((product) => (
          <AdminProductForm key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
