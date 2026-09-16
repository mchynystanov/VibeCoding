"use client";

import { useEffect, useState } from "react";

function getRemainingMs(endsAt: string): number {
  return Math.max(0, new Date(endsAt).getTime() - Date.now());
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0
    ? `${days}д ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Тикающий обратный отсчёт до конца распродажи. Ничего не рендерит, если
 * время уже вышло — родитель к этому моменту сам перестаёт показывать
 * скидочную цену (см. isSaleActive() в src/lib/pricing.ts). */
export function SaleCountdown({ endsAt }: { endsAt: string }) {
  // null до монтирования на клиенте: Date.now() на сервере (SSR) и в
  // браузере (гидратация) чуть отличаются, из-за чего React ругался на
  // hydration mismatch. Рендерим null первый раз одинаково на сервере и
  // клиенте, а настоящее значение считаем только в useEffect (только клиент).
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(getRemainingMs(endsAt));
    const id = setInterval(() => setRemaining(getRemainingMs(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (remaining === null) return null;

  if (remaining <= 0) {
    return (
      <span className="text-xs font-medium uppercase tracking-wide text-paomma-inkMuted">
        Распродажа завершена
      </span>
    );
  }

  return (
    <span className="text-xs font-medium uppercase tracking-wide text-paomma-inkMuted">
      Распродажа закончится через{" "}
      <span className="font-semibold text-paomma-accent">{formatRemaining(remaining)}</span>
    </span>
  );
}
