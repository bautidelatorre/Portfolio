import { FloatingRender } from "./FloatingRender";
import { GlowBlob } from "./GlowBlob";
import type { FloatingRenderConfig, GlowConfig, SiteCopy } from "@/lib/db/schema";
import { DEFAULT_SITE_COPY } from "@/lib/db/schema";

export function Hero({
  renders = [],
  glows = [],
  copy = DEFAULT_SITE_COPY,
}: {
  renders?: FloatingRenderConfig[];
  glows?: GlowConfig[];
  copy?: SiteCopy;
}) {
  const behind = renders.filter((r) => r.layer === "behind");
  const front = renders.filter((r) => r.layer === "front");

  return (
    <section className="dot-grid relative flex min-h-[85vh] flex-col justify-center overflow-hidden px-6 sm:px-10 lg:px-16 2xl:px-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[-8%] h-[320px] w-[320px] rounded-full bg-dark/10 blur-[90px]"
      />
      {glows.map((g) => (
        <GlowBlob
          key={g.id}
          xPct={g.xPct}
          yPct={g.yPct}
          sizePct={g.sizePct}
          blur={g.blur}
          color={g.color}
          opacity={g.opacity}
        />
      ))}
      {behind.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
          float={r.float}
        />
      ))}

      <div className="relative mx-auto w-full max-w-5xl 2xl:max-w-7xl">
        <p className="font-label text-xs font-semibold tracking-[0.08em] text-accent uppercase">
          {copy.heroKicker}
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[1.02] font-medium tracking-[-0.03em] sm:text-7xl">
          {copy.heroHeadline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{copy.heroSubtext}</p>
        <div className="mt-10 flex gap-4">
          <a
            href="#projects"
            className="rounded-full bg-dark px-6 py-3 font-label text-sm font-semibold text-white transition hover:opacity-85"
          >
            {copy.heroPrimaryCta}
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-6 py-3 font-label text-sm font-semibold transition hover:bg-muted-bg"
          >
            {copy.heroSecondaryCta}
          </a>
        </div>
      </div>
      {front.map((r) => (
        <FloatingRender
          key={r.id}
          src={r.imageUrl}
          xPct={r.xPct}
          yPct={r.yPct}
          widthPct={r.widthPct}
          rotate={r.rotate}
          opacity={r.opacity}
          float={r.float}
        />
      ))}
    </section>
  );
}
