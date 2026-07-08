import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { FloatingRender } from "./FloatingRender";
import { MobileOffset } from "./MobileOffset";
import type { FloatingRenderConfig, SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

export function About({
  renders = [],
  copy = DEFAULT_SITE_COPY,
  mobileOffset = 0,
}: {
  renders?: FloatingRenderConfig[];
  copy?: SiteCopy;
  mobileOffset?: number;
}) {
  const behind = renders.filter((r) => r.layer === "behind");
  const front = renders.filter((r) => r.layer === "front");

  return (
    <section id="about" className="relative overflow-hidden bg-dark py-20 text-white">
      {behind.map((r) => (
        <FloatingRender key={r.id} render={r} />
      ))}
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 sm:px-10 md:flex-row md:items-center lg:px-16 2xl:max-w-7xl 2xl:px-24">
        <div className="group relative shrink-0 self-center">
          <div
            aria-hidden="true"
            className="absolute -right-3 -bottom-3 h-48 w-48 rounded-2xl bg-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 sm:h-56 sm:w-56"
          />
          <Image
            src="/foto-bautista.jpg"
            alt="Photo of Bautista"
            width={320}
            height={320}
            className="relative h-48 w-48 rounded-2xl object-cover grayscale transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0 sm:h-56 sm:w-56"
          />
        </div>
        <MobileOffset offset={mobileOffset}>
          <SectionHeading index="01" label={copy.aboutLabel} tone="dark" />
          <p className="mt-4 max-w-2xl text-2xl leading-[1.15] font-medium tracking-[-0.02em] sm:text-3xl">
            {copy.aboutHeadline}
          </p>
          <p className="mt-6 max-w-xl text-white/60">{copy.aboutBio}</p>
        </MobileOffset>
      </div>
      {front.map((r) => (
        <FloatingRender key={r.id} render={r} />
      ))}
    </section>
  );
}
