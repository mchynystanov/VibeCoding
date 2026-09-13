export function Footer() {
  return (
    <footer className="border-t border-paomma-line">
      <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-paomma-inkMuted">
        {/* TODO(owner): открытый вопрос №7 — юр. реквизиты (ИП/самозанятый) и политика возврата не предоставлены */}
        <p>© {new Date().getFullYear()} Paomma</p>
      </div>
    </footer>
  );
}
