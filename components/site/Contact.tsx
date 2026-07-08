import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";
import type { FloatingRenderConfig, SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

const MAIL_TO = "bautidelatorre@gmail.com";
const MAIL_SUBJECT = "Let's work together";
const MAIL_BODY = "Hi Bautista,\n\nI'd love to tell you about a project I have in mind.\n\n";

const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  MAIL_TO
)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

export function Contact({
  renders = [],
  copy = DEFAULT_SITE_COPY,
}: {
  renders?: FloatingRenderConfig[];
  copy?: SiteCopy;
}) {
  const behind = renders.filter((r) => r.layer === "behind");
  const front = renders.filter((r) => r.layer === "front");

  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-24 max-sm:pb-44 sm:px-10 lg:px-16 2xl:max-w-7xl 2xl:px-24"
    >
      {behind.map((r) => (
        <FloatingRender key={r.id} render={r} />
      ))}
      <div className="max-sm:-translate-y-8">
        <SectionHeading index="03" label={copy.contactLabel} />
        <p className="mt-4 max-w-xl text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
          {copy.contactHeadline}
        </p>
        <a
          href={GMAIL_COMPOSE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-dark px-6 py-3 font-label text-sm font-semibold text-white transition hover:opacity-85"
        >
          {MAIL_TO}
        </a>
      </div>
      {front.map((r) => (
        <FloatingRender key={r.id} render={r} />
      ))}
    </section>
  );
}
