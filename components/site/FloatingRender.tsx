export function FloatingRender({
  src,
  xPct,
  yPct,
  widthPct,
  rotate = 0,
  opacity = 0.85,
  duration = 10,
  delay = 0,
  float = true,
}: {
  src: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  rotate?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  float?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute max-sm:hidden ${float ? "animate-float-slow" : ""}`}
      style={
        {
          left: `${xPct}%`,
          top: `${yPct}%`,
          width: `${widthPct}%`,
          opacity,
          rotate: `${rotate}deg`,
          "--float-duration": `${duration}s`,
          "--float-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block h-auto w-full" />
    </div>
  );
}
