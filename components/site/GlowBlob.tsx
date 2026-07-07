export function GlowBlob({
  xPct,
  yPct,
  sizePct,
  blur,
  color,
  opacity,
}: {
  xPct: number;
  yPct: number;
  sizePct: number;
  blur: number;
  color: string;
  opacity: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${sizePct}%`,
        aspectRatio: "1 / 1",
        background: `radial-gradient(circle, ${color}cc 0%, ${color}55 45%, ${color}00 72%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  );
}
