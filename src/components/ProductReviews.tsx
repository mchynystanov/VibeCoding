"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} из 5`} className="text-paomma-accent">
      {"★".repeat(rating)}
      <span className="text-paomma-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, text, honeypot }),
      });
      const json: { ok: boolean; review?: Review } = await res.json();
      if (!res.ok || !json.ok) {
        setError(
          res.status === 429
            ? "Слишком много попыток — подождите минуту"
            : "Не получилось отправить отзыв. Проверьте поля и попробуйте снова.",
        );
        setStatus("error");
        return;
      }
      if (json.review) {
        setReviews((prev) => [json.review as Review, ...prev]);
      }
      setName("");
      setRating(5);
      setText("");
      setFormOpen(false);
      setStatus("idle");
    } catch {
      setError("Не получилось отправить отзыв. Попробуйте ещё раз.");
      setStatus("error");
    }
  }

  return (
    <div>
      {reviews.length > 0 ? (
        <div className="mb-6 flex items-center gap-3">
          <Stars rating={Math.round(average ?? 0)} />
          <span className="text-sm text-paomma-inkMuted">
            {average?.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "отзыв" : "отзывов"}
          </span>
        </div>
      ) : (
        <p className="mb-6 text-sm text-paomma-inkMuted">
          Отзывов о покупке в нашем магазине пока нет — станьте первым.
        </p>
      )}

      {reviews.length > 0 && (
        <ul className="mb-6 space-y-4 divide-y divide-paomma-line">
          {reviews.map((review) => (
            <li key={review.id} className="pt-4 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="font-medium">{review.name}</span>
                <Stars rating={review.rating} />
                <span className="text-xs text-paomma-inkMuted">{formatDate(review.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-paomma-inkMuted">{review.text}</p>
            </li>
          ))}
        </ul>
      )}

      {!formOpen && (
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-full border border-paomma-ink px-6 py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
        >
          Оставить отзыв
        </button>
      )}

      {formOpen && (
        <form onSubmit={handleSubmit} className="max-w-md border border-paomma-line p-6">
          <div className="mb-4">
            <label htmlFor="review-name" className="mb-1 block text-sm font-medium">
              Имя
            </label>
            <input
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
            />
          </div>

          <div className="mb-4">
            <span className="mb-1 block text-sm font-medium">Оценка</span>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} из 5`}
                  className={value <= rating ? "text-paomma-accent" : "text-paomma-line"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="review-text" className="mb-1 block text-sm font-medium">
              Отзыв
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              minLength={10}
              rows={4}
              className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
            />
          </div>

          {/* Honeypot: скрыт визуально off-screen, а не display:none — так его чаще не замечают боты. */}
          <input
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          />

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-paomma-accent px-6 py-2 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Отправляем…" : "Отправить"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-xs uppercase tracking-wide text-paomma-inkMuted underline"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
