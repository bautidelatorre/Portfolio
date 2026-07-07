import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";

const MAIL_TO = "bautidelatorre@gmail.com";
const MAIL_SUBJECT = "Quiero trabajar con vos";
const MAIL_BODY = "Hola Bautista,\n\nMe gustaría contarte sobre un proyecto en el que estoy pensando.\n\n";

const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  MAIL_TO
)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-24 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24"
    >
      <FloatingRender
        src="/floating/chairs-pair.webp"
        width={700}
        height={488}
        rotate={4}
        duration={10}
        delay={0.5}
        opacity={0.85}
        className="right-4 bottom-4 hidden w-[500px] xl:block 2xl:w-[620px] 2xl:right-10"
      />
      <SectionHeading index="03" label="Contacto" />
      <p className="mt-4 max-w-xl text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
        ¿Tenés un proyecto en mente? Hablemos.
      </p>
      <a
        href={GMAIL_COMPOSE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-full bg-dark px-6 py-3 font-label text-sm font-semibold text-white transition hover:opacity-85"
      >
        {MAIL_TO}
      </a>
    </section>
  );
}
