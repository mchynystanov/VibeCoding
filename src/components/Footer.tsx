export function Footer() {
  return (
    <footer className="border-t border-paomma-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-12 text-sm text-paomma-inkMuted">
        {/* TODO(owner): открытый вопрос №7 — юр. реквизиты (ИП/самозанятый) и политика возврата не предоставлены */}
        <p>© {new Date().getFullYear()} Paomma</p>
        <a
          href="https://www.instagram.com/paomma.kg/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition hover:text-paomma-ink"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <defs>
              <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
                <stop offset="0%" stopColor="#fdf497" />
                <stop offset="5%" stopColor="#fdf497" />
                <stop offset="45%" stopColor="#fd5949" />
                <stop offset="60%" stopColor="#d6249f" />
                <stop offset="90%" stopColor="#285AEB" />
              </radialGradient>
            </defs>
            <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#ig-gradient)" />
            <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.8" />
            <circle cx="17.6" cy="6.4" r="1.2" fill="white" />
          </svg>
          <span>Paomma.kg</span>
        </a>
      </div>
    </footer>
  );
}
