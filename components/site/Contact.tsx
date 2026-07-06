import { SectionHeading } from "./SectionHeading";

export function Contact() {
  return (
    <section
      id="contacto"
      className="mx-auto w-full max-w-5xl px-6 py-24 sm:px-10 lg:px-16"
    >
      <SectionHeading index="03" label="Contacto" />
      <p className="mt-4 max-w-xl text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        ¿Tenés un proyecto en mente? Hablemos.
      </p>
      <a
        href="mailto:bautidelatorre@gmail.com"
        className="mt-8 inline-block rounded-full bg-dark px-6 py-3 font-label text-sm font-semibold text-white transition hover:opacity-85"
      >
        bautidelatorre@gmail.com
      </a>
    </section>
  );
}
