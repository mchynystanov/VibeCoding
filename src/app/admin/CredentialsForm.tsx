"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CredentialsForm({ mode }: { mode: "setup" | "change" }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          ...(mode === "change" ? { currentPassword } : {}),
        }),
      });
      if (!res.ok) {
        const json: { error?: string } = await res.json().catch(() => ({}));
        setError(
          json.error === "wrong_current_password"
            ? "Текущий пароль указан неверно"
            : json.error === "unauthorized"
              ? "Сессия истекла — войдите заново"
              : "Пароли не совпадают или логин пустой",
        );
        setStatus("error");
        return;
      }
      setStatus("saved");
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      router.refresh();
    } catch {
      setError("Не получилось сохранить. Попробуйте ещё раз.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <label className="mb-4 block text-sm">
        Логин
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="mt-1 block w-full border border-paomma-line px-3 py-2"
        />
      </label>

      {mode === "change" && (
        <label className="mb-4 block text-sm">
          Текущий пароль
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 block w-full border border-paomma-line px-3 py-2"
          />
        </label>
      )}

      <label className="mb-4 block text-sm">
        Новый пароль
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 block w-full border border-paomma-line px-3 py-2"
        />
      </label>

      <label className="mb-4 block text-sm">
        Повторите пароль
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 block w-full border border-paomma-line px-3 py-2"
        />
      </label>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {status === "saved" && <p className="mb-4 text-sm text-green-600">Сохранено</p>}

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-full bg-paomma-accent px-6 py-2 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
