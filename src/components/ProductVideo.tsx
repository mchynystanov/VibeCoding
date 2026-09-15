export function ProductVideo({
  videoId,
  instructionUrl,
}: {
  videoId: string;
  instructionUrl?: string;
}) {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-light tracking-tight">Видеобзор</h1>
      <div className="relative aspect-video w-full overflow-hidden sm:max-w-[50%]">
        <iframe
          src={`https://kinescope.io/embed/${videoId}`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {instructionUrl && (
        <a
          href={instructionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-paomma-accent px-8 py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark"
        >
          Инструкция
        </a>
      )}
    </div>
  );
}
