import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";
import type { FloatingRenderConfig } from "@/lib/db/schema";

const MAIL_TO = "bautidelatorre@gmail.com";
const MAIL_SUBJECT = "Quiero trabajar con vos";
const MAIL_BODY = "Hola Bautista,\n\nMe gustaría contarte sobre un proyecto en el que estoy pensando.\n\n";

const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  MAIL_TO
)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

export function Contact({ renders = [] }: { renders?: FloatingRenderConfig[] }) {
  const behind = renders.filter((r) => r.layer === "behind");
  const front = renders.filter((r) => r.layer === "front");

  return (
    <section
      id="contacto"
      className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-24 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24"
    >
      {behind.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
        />
      ))}
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
      {front.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
        />
      ))}
    </section>
  );
}
