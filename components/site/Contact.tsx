export function Contact() {
  return (
    <section
      id="contacto"
      className="mx-auto w-full max-w-5xl px-6 py-24 sm:px-10 lg:px-16"
    >
      <h2 className="text-sm font-medium tracking-wide text-accent uppercase">
        Contacto
      </h2>
      <p className="mt-4 max-w-xl text-2xl font-medium sm:text-3xl">
        ¿Tenés un proyecto en mente? Hablemos.
      </p>
      <a
        href="mailto:bautidelatorre@gmail.com"
        className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-85"
      >
        bautidelatorre@gmail.com
      </a>
    </section>
  );
}
