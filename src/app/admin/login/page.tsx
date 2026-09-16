"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError(
          res.status === 429
            ? "Слишком много попыток — подождите минуту"
            : "Неверный логин или пароль",
        );
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <form onSubmit={handleSubmit} className="w-full border border-paomma-line p-8">
        <h1 className="mb-6 text-2xl font-light tracking-tight">Вход в админку</h1>
        <label className="mb-4 block text-sm">
          Логин
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="mt-1 block w-full border border-paomma-line px-3 py-2"
          />
        </label>
        <label className="mb-4 block text-sm">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 block w-full border border-paomma-line px-3 py-2"
          />
        </label>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-paomma-accent py-2 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
