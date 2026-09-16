"use client";

import { useEffect, useState } from "react";
import { formatRemainingMs } from "@/lib/countdownFormat";

const MIN_HOURS = 3;
const MAX_HOURS = 5;

function randomDurationMs(): number {
  const hours = MIN_HOURS + Math.random() * (MAX_HOURS - MIN_HOURS);
  return Math.round(hours * 60 * 60 * 1000);
}

type StoredCountdown = { endsAt: number };

function readStoredEndsAt(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCountdown;
    return parsed.endsAt > Date.now() ? parsed.endsAt : null;
  } catch {
    return null;
  }
}

function writeStoredEndsAt(key: string, endsAt: number): void {
  try {
    localStorage.setItem(key, JSON.stringify({ endsAt } satisfies StoredCountdown));
  } catch {
    // localStorage недоступен (приватный режим и т.п.) — таймер просто не
    // переживёт перезагрузку страницы у этого посетителя, не критично.
  }
}

/**
 * "Вечный" обратный отсчёт: у каждого посетителя свой случайный таймер на
 * 3–5 часов (хранится в localStorage конкретного браузера, чтобы не
 * перезапускался при каждой перезагрузке страницы). Как только он доходит
 * до нуля — стартует заново со случайной длительностью, и так пока эта
 * функция включена в админке. В отличие от SaleCountdown, не привязан к
 * реальной дате окончания распродажи и не влияет на то, действует ли сама
 * скидка (см. isSaleActive() в src/lib/pricing.ts) — это только визуальный
 * таймер.
 */
export function RandomSaleCountdown({ productId }: { productId: string }) {
  const storageKey = `paomma-random-countdown-${productId}`;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let endsAt = readStoredEndsAt(storageKey);
    if (endsAt === null) {
      endsAt = Date.now() + randomDurationMs();
      writeStoredEndsAt(storageKey, endsAt);
    }
    setRemaining(endsAt - Date.now());

    const id = setInterval(() => {
      let left = (endsAt as number) - Date.now();
      if (left <= 0) {
        endsAt = Date.now() + randomDurationMs();
        writeStoredEndsAt(storageKey, endsAt);
        left = endsAt - Date.now();
      }
      setRemaining(left);
    }, 1000);

    return () => clearInterval(id);
  }, [storageKey]);

  if (remaining === null) return null;

  return (
    <span className="text-xs font-medium uppercase tracking-wide text-paomma-inkMuted">
      Распродажа закончится через{" "}
      <span className="font-semibold text-paomma-accent">{formatRemainingMs(remaining)}</span>
    </span>
  );
}
