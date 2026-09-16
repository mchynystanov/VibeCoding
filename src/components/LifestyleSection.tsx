const SCENARIOS = [
  {
    text: "Поиграть с малышом",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-4.5-2.7-8-6-8-9.5A4.5 4.5 0 0112 8a4.5 4.5 0 018 3.5c0 3.5-3.5 6.8-8 9.5z"
      />
    ),
  },
  {
    text: "Выпить кофе, пока горячий",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9h1.5a2.5 2.5 0 010 5H17" />
        <path strokeLinecap="round" d="M8 3.5c0 1-1 1-1 2M12 3.5c0 1-1 1-1 2" />
      </>
    ),
  },
  {
    text: "Поработать или ответить на сообщения",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v11H9l-4 3.5V16H4V5z" />,
  },
  {
    text: "Просто отдохнуть",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"
      />
    ),
  },
];

export function LifestyleSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-4">
      <h2 className="mb-4 text-xl font-light tracking-tight sm:text-3xl">
        Пока молокоотсос работает, вы можете...
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {SCENARIOS.map((s) => (
          <div
            key={s.text}
            className="rounded-2xl bg-paomma-surface p-4 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-paomma-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5"
                aria-hidden
              >
                {s.icon}
              </svg>
            </div>
            <p className="text-sm">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
