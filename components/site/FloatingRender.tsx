export function FloatingRender({
  src,
  xPct,
  yPct,
  widthPct,
  rotate = 0,
  opacity = 0.85,
  duration = 10,
  delay = 0,
}: {
  src: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  rotate?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="animate-float-slow pointer-events-none absolute"
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
