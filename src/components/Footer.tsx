function InstagramIcon({ gradientId }: { gradientId: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill={`url(#${gradientId})`} />
      <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="white" />
    </svg>
  );
}

const INSTAGRAM_LINKS = [
  {
    href: "https://www.instagram.com/paomma.kg?stkn=MXUwNzdpODFrNWQ4bg==",
    label: "Paomma.kg",
    gradientId: "ig-gradient-paomma",
  },
  {
    href: "https://www.instagram.com/luvsbaby.club?stkn=dDU4eW54Z2NkbWY=",
    label: "LuvsBaby.club",
    gradientId: "ig-gradient-luvsbaby",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-paomma-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-sm text-paomma-inkMuted">
        {/* TODO(owner): открытый вопрос №7 — юр. реквизиты (ИП/самозанятый) и политика возврата не предоставлены */}
        <p>© {new Date().getFullYear()} Paomma</p>
        <div className="flex items-center gap-6">
          {INSTAGRAM_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-paomma-ink"
            >
              <InstagramIcon gradientId={link.gradientId} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
