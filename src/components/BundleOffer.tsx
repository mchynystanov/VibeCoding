export function BundleOffer() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="bundle-offer-glow rounded-2xl bg-gradient-to-r from-paomma-rose to-paomma-surface p-6 sm:p-8">
        <span className="mb-3 inline-block rounded-full bg-paomma-accent px-3 py-1 text-xs uppercase tracking-wide text-white">
          Специальное предложение
        </span>
        <h3 className="text-xl font-medium">Комплект: молокоотсос + стерилизатор</h3>
        <p className="mt-2 text-sm text-paomma-inkMuted">
          Купите вместе — скидка на комплект применится автоматически в корзине.
          {/* TODO(owner): открытый вопрос №5 — точный размер скидки на комплект не согласован */}
        </p>
      </div>
    </section>
  );
}
