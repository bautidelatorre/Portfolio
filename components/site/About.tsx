import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="sobre-mi" className="relative overflow-hidden bg-dark py-20 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,96,68,0.16),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24">
        <SectionHeading index="01" label="Sobre mí" tone="dark" />
        <p className="mt-4 max-w-2xl text-2xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-3xl">
          Trabajo en la intersección entre diseño de producto e identidad de
          marca, buscando siempre soluciones simples a problemas complejos.
        </p>
        <p className="mt-6 max-w-xl text-white/60">
          Este es un texto de ejemplo — reemplazalo por tu propia bio desde el
          panel de administración cuando esté listo.
        </p>
      </div>
    </section>
  );
}
