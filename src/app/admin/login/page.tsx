import { redirect } from "next/navigation";
import { getAdminCredentials } from "@/lib/adminAuth";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const creds = await getAdminCredentials();
  if (!creds) {
    // Логин/пароль ещё не заданы — заходить некуда логиниться, сразу в /admin.
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <LoginForm />
    </main>
  );
}
