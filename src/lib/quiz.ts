export type Q1Answer = "pump" | "sterilizer" | "unsure";
export type Q2Answer = "sometimes" | "daily" | "several-a-day";
export type Q3Answer = "unimportant" | "yes" | "very";

export type QuizAnswers = {
  need: Q1Answer;
  frequency: Q2Answer;
  handsFree: Q3Answer;
};

export const QUIZ_QUESTIONS = {
  need: {
    text: "Что вам сейчас нужно?",
    options: [
      { value: "pump" as const, label: "Молокоотсос" },
      { value: "sterilizer" as const, label: "Подогрев-стерилизация" },
      { value: "unsure" as const, label: "Пока не знаю" },
    ],
  },
  frequency: {
    text: "Как часто планируете сцеживаться?",
    options: [
      { value: "sometimes" as const, label: "Иногда" },
      { value: "daily" as const, label: "Каждый день" },
      { value: "several-a-day" as const, label: "Несколько раз в день" },
    ],
  },
  handsFree: {
    text: "Важна ли возможность сцеживаться без рук?",
    options: [
      { value: "unimportant" as const, label: "Неважно" },
      { value: "yes" as const, label: "Да" },
      { value: "very" as const, label: "Очень" },
    ],
  },
};

/**
 * Правила рекомендации — раздел 7 ТЗ, один в один. Порядок веток важен.
 */
export function getQuizRecommendation(answers: QuizAnswers): string {
  if (answers.need === "sterilizer") {
    return "sterilizer";
  }

  if (answers.need === "pump") {
    return answers.handsFree === "unimportant" ? "electric-pump" : "bionic-pump";
  }

  // answers.need === "unsure"
  return answers.frequency === "several-a-day" ? "bionic-pump" : "electric-pump";
}
