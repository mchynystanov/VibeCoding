"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS, getQuizRecommendation } from "@/lib/quiz";
import type { QuizAnswers } from "@/lib/quiz";
import { getProductById } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";

const STEPS: (keyof QuizAnswers)[] = ["need", "frequency", "handsFree"];

export function Quiz() {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const addItem = useCartStore((state) => state.addItem);
  const openOrderForm = useCartStore((state) => state.openOrderForm);

  const currentStepIndex = STEPS.findIndex((key) => answers[key] === undefined);
  const isDone = currentStepIndex === -1;

  function selectAnswer(key: keyof QuizAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setAnswers({});
  }

  if (isDone) {
    const productId = getQuizRecommendation(answers as QuizAnswers);
    const product = getProductById(productId);

    return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Подберите свой товар</h2>
        {product && (
          <div className="mx-auto max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-paomma-text/70">Вам подойдёт:</p>
            <h3 className="mt-2 text-xl font-bold">{product.title}</h3>
            <p className="mt-2 text-lg font-bold">{product.price.toLocaleString("ru-RU")} ₽</p>
            <button
              onClick={() => {
                addItem(product.id);
                openOrderForm();
              }}
              className="mt-4 w-full rounded-full bg-paomma-primary py-3 font-semibold text-white transition hover:bg-paomma-primaryDark"
            >
              Заказать
            </button>
            <button onClick={reset} className="mt-2 text-sm text-paomma-text/50 underline">
              Пройти квиз заново
            </button>
          </div>
        )}
      </section>
    );
  }

  const stepKey = STEPS[currentStepIndex];
  const question = QUIZ_QUESTIONS[stepKey];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Подберите свой товар</h2>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm text-paomma-text/50">
          Вопрос {currentStepIndex + 1} из {STEPS.length}
        </p>
        <p className="mb-4 font-semibold">{question.text}</p>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => selectAnswer(stepKey, option.value)}
              className="rounded-full border border-paomma-primary/30 py-2 text-sm transition hover:bg-paomma-primary/10"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
