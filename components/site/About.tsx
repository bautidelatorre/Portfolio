import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";

export function About() {
  return (
    <section id="sobre-mi" className="relative overflow-hidden bg-dark py-20 text-white">
      <FloatingRender
        src="/floating/chair-2.webp"
        width={700}
        height={1422}
        rotate={4}
        duration={10}
        delay={1}
        opacity={0.5}
        className="top-4 right-6 hidden w-[220px] xl:block 2xl:w-[300px] 2xl:right-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,96,68,0.16),transparent_60%)]"
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 sm:px-10 md:flex-row md:items-center lg:px-16 2xl:max-w-7xl 2xl:px-24">
        <div className="group relative shrink-0">
          <div
            aria-hidden="true"
            className="absolute -right-3 -bottom-3 h-48 w-48 rounded-2xl bg-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 sm:h-56 sm:w-56"
          />
          <Image
            src="/foto-bautista.jpg"
            alt="Foto de Bautista"
            width={320}
            height={320}
            className="relative h-48 w-48 rounded-2xl object-cover grayscale transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0 sm:h-56 sm:w-56"
          />
        </div>
        <div>
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
      </div>
    </section>
  );
}
