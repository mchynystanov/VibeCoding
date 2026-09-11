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
          aria-label="Написать в WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white shadow-lg"
        >
          💬
        </a>
      )}
      {TELEGRAM_FALLBACK && (
        <a
          href={`https://t.me/${TELEGRAM_FALLBACK.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-2xl text-white shadow-lg"
        >
          ✈️
        </a>
      )}
    </div>
  );
}
