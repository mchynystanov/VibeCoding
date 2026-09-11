// TODO(owner): реальные фото товаров (700×700 WebP) ещё не предоставлены —
// см. TODO.md. Как только появятся файлы в public/products/, заменить этот
// компонент на next/image с соответствующим src.
export function ProductImagePlaceholder({ title }: { title: string }) {
  return (
    <div
      className="flex aspect-square items-center justify-center rounded-xl bg-paomma-primary/15 text-center text-sm text-paomma-primaryDark"
      role="img"
      aria-label={title}
    >
      {title}
    </div>
  );
}
