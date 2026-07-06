export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 font-label text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Bautista</p>
        <a href="#contacto" className="hover:text-foreground">
          bautidelatorre@gmail.com
        </a>
      </div>
    </footer>
  );
}
