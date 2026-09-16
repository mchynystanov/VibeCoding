"use client";

import { useEffect, useState } from "react";
import { QUIZ_QUESTIONS, getQuizRecommendation } from "@/lib/quiz";
import type { QuizAnswers } from "@/lib/quiz";
import type { Product } from "@/data/products";
import { getSalePrice } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/analytics";

const STEPS: (keyof QuizAnswers)[] = ["need", "frequency", "handsFree"];

export function Quiz() {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [product, setProduct] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const openOrderForm = useCartStore((state) => state.openOrderForm);

  const currentStepIndex = STEPS.findIndex((key) => answers[key] === undefined);
  const isDone = currentStepIndex === -1;

  function selectAnswer(key: keyof QuizAnswers, value: string) {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);

    const isLastStep = STEPS.every((step) => nextAnswers[step] !== undefined);
    if (isLastStep) {
      const productId = getQuizRecommendation(nextAnswers as QuizAnswers);
      trackEvent("quiz_completed", { productId });
    }
  }

  function reset() {
    setAnswers({});
    setProduct(null);
  }

  useEffect(() => {
    if (!isDone) return;
    const productId = getQuizRecommendation(answers as QuizAnswers);
    let cancelled = false;
    // Берём актуальные цену/скидку из /api/products — статический каталог
    // (src/data/products.ts) не знает о правках из /admin.
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => {
        if (cancelled) return;
        setProduct(data.products.find((p) => p.id === productId) ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isDone]);

  if (isDone) {
    const salePrice = product ? getSalePrice(product.price, product.salePercent) : null;
    const effectivePrice = product ? (salePrice ?? product.price) : 0;

    return (
      <div>
        <h2 className="mb-4 text-2xl font-light tracking-tight">Подберите свой товар</h2>
        {product && (
          <div className="mx-auto max-w-sm border border-paomma-line p-8 text-center">
            <p className="text-sm text-paomma-inkMuted">Вам подойдёт:</p>
            <h3 className="mt-2 text-xl font-light tracking-tight">{product.title}</h3>
            {salePrice !== null ? (
              <p className="mt-2 flex items-center justify-center gap-2">
                <span className="text-sm text-paomma-inkMuted line-through">
                  {product.price.toLocaleString("ru-RU")} Сом
                </span>
                <span className="text-lg font-bold text-paomma-accent">
                  {salePrice.toLocaleString("ru-RU")} Сом
                </span>
              </p>
            ) : (
              <p className="mt-2 text-lg font-semibold">
                {product.price.toLocaleString("ru-RU")} Сом
              </p>
            )}
            <button
              onClick={() => {
                addItem({ id: product.id, title: product.title, price: effectivePrice });
                openOrderForm();
              }}
              className="mt-6 w-full bg-paomma-accent py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark"
            >
              Заказать
            </button>
            <button
              onClick={reset}
              className="mt-3 text-xs uppercase tracking-wide text-paomma-inkMuted underline"
            >
              Пройти квиз заново
            </button>
          </div>
        )}
      </div>
    );
  }

  const stepKey = STEPS[currentStepIndex];
  const question = QUIZ_QUESTIONS[stepKey];

  return (
    <div>
      <h2 className="mb-4 text-2xl font-light tracking-tight">Подберите свой товар</h2>
      <div className="border border-paomma-line p-6">
        <p className="mb-4 text-xs uppercase tracking-wide text-paomma-inkMuted">
          Вопрос {currentStepIndex + 1} из {STEPS.length}
        </p>
        <p className="mb-4 font-medium">{question.text}</p>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => selectAnswer(stepKey, option.value)}
              className="border border-paomma-line py-2 text-sm transition hover:border-paomma-ink"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
