export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paomma-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-xl font-bold text-paomma-primaryDark">Paomma</span>
        {/* TODO(этап 4): иконка корзины со счётчиком, открывающая CartDrawer */}
      </div>
    </header>
  );
}
