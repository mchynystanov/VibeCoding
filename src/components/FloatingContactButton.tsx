const WHATSAPP_FALLBACK = process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK;
const TELEGRAM_FALLBACK = process.env.NEXT_PUBLIC_TELEGRAM_FALLBACK;

export function FloatingContactButton() {
  if (!WHATSAPP_FALLBACK && !TELEGRAM_FALLBACK) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
      {WHATSAPP_FALLBACK && (
        <a
          href={`https://wa.me/${WHATSAPP_FALLBACK}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-paomma-ink bg-paomma-bg px-4 py-2 text-xs uppercase tracking-wide text-paomma-ink shadow-sm transition hover:bg-paomma-ink hover:text-paomma-bg"
        >
          WhatsApp
        </a>
      )}
      {TELEGRAM_FALLBACK && (
        <a
          href={`https://t.me/${TELEGRAM_FALLBACK.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-paomma-ink bg-paomma-bg px-4 py-2 text-xs uppercase tracking-wide text-paomma-ink shadow-sm transition hover:bg-paomma-ink hover:text-paomma-bg"
        >
          Telegram
        </a>
      )}
    </div>
  );
}
