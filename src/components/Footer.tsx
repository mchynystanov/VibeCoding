export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-paomma-text/70">
      {/* TODO(owner): открытый вопрос №7 — юр. реквизиты (ИП/самозанятый) и политика возврата не предоставлены */}
      <p>© {new Date().getFullYear()} Paomma</p>
    </footer>
  );
}
