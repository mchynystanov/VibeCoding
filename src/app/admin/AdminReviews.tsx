"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

type Section = { productId: string; title: string; reviews: Review[] };

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

export function AdminReviews({ sections: initialSections }: { sections: Section[] }) {
  const [sections, setSections] = useState(initialSections);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(productId: string, reviewId: string) {
    if (!confirm("Удалить этот отзыв? Это необратимо.")) return;
    setDeletingId(reviewId);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, reviewId }),
      });
      if (res.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.productId === productId
              ? { ...s, reviews: s.reviews.filter((r) => r.id !== reviewId) }
              : s,
          ),
        );
      } else {
        alert("Не получилось удалить отзыв. Попробуйте ещё раз.");
      }
    } catch {
      alert("Не получилось удалить отзыв. Попробуйте ещё раз.");
    } finally {
      setDeletingId(null);
    }
  }

  const totalReviews = sections.reduce((sum, s) => sum + s.reviews.length, 0);

  return (
    <div className="border border-paomma-line p-6">
      <h2 className="mb-4 font-medium">Отзывы покупателей ({totalReviews})</h2>
      {totalReviews === 0 && (
        <p className="text-sm text-paomma-inkMuted">Отзывов пока никто не оставлял.</p>
      )}
      <div className="space-y-6">
        {sections
          .filter((s) => s.reviews.length > 0)
          .map((section) => (
            <div key={section.productId}>
              <h3 className="mb-2 text-sm font-medium text-paomma-inkMuted">{section.title}</h3>
              <ul className="divide-y divide-paomma-line border-t border-paomma-line">
                {section.reviews.map((review) => (
                  <li key={review.id} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{review.name}</span>
                        <Stars rating={review.rating} />
                        <span className="text-xs text-paomma-inkMuted">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-paomma-inkMuted">{review.text}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(section.productId, review.id)}
                      disabled={deletingId === review.id}
                      className="shrink-0 text-xs uppercase tracking-wide text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === review.id ? "Удаляем…" : "Удалить"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
