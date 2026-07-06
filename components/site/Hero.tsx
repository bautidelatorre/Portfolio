export function Hero() {
  return (
    <section className="flex min-h-[85vh] flex-col justify-center px-6 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          Bautista
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Diseñador de producto e identidad visual.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Ayudo a marcas y equipos a construir productos y experiencias
          claras, con foco en la forma y en el detalle.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#proyectos"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-85"
          >
            Ver proyectos
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:bg-muted-bg"
          >
            Contacto
          </a>
        </div>
      </div>
    </section>
  );
}
