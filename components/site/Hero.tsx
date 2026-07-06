export function Hero() {
  return (
    <section className="dot-grid relative flex min-h-[85vh] flex-col justify-center overflow-hidden px-6 sm:px-10 lg:px-16 2xl:px-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[-15%] h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,106,0,0.75)_0%,rgba(255,106,0,0.35)_45%,rgba(255,106,0,0)_72%)] blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] right-[-2%] h-[220px] w-[220px] -translate-y-1/2 rounded-full bg-[#ff7a1a] opacity-70 blur-[60px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[-8%] h-[320px] w-[320px] rounded-full bg-dark/10 blur-[90px]"
      />

      <div className="relative mx-auto w-full max-w-5xl 2xl:max-w-7xl">
        <p className="font-label text-xs font-semibold tracking-[0.08em] text-accent uppercase">
          Bautista
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[1.02] font-medium tracking-[-0.03em] sm:text-7xl">
          Diseñador de producto e identidad visual.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Ayudo a marcas y equipos a construir productos y experiencias
          claras, con foco en la forma y en el detalle.
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#proyectos"
            className="rounded-full bg-dark px-6 py-3 font-label text-sm font-semibold text-white transition hover:opacity-85"
          >
            Ver proyectos
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-border px-6 py-3 font-label text-sm font-semibold transition hover:bg-muted-bg"
          >
            Contacto
          </a>
        </div>
      </div>
    </section>
  );
}
