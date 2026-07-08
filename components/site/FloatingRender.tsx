import type { FloatingRenderConfig } from "@/lib/db/schema";

export function FloatingRender({ render }: { render: FloatingRenderConfig }) {
  return (
    <>
      <FloatingRenderImage
        src={render.imageUrl}
        xPct={render.xPct}
        yPct={render.yPct}
        widthPct={render.widthPct}
        rotate={render.rotate}
        opacity={render.opacity}
        float={render.float}
        className="max-sm:hidden"
      />
      {render.mobileVisible && (
        <FloatingRenderImage
          src={render.imageUrl}
          xPct={render.mobileXPct}
          yPct={render.mobileYPct}
          widthPct={render.mobileWidthPct}
          rotate={render.mobileRotate}
          opacity={render.mobileOpacity}
          float={render.float}
          className="hidden max-sm:block"
        />
      )}
    </>
  );
}

function FloatingRenderImage({
  src,
  xPct,
  yPct,
  widthPct,
  rotate = 0,
  opacity = 0.85,
  duration = 10,
  delay = 0,
  float = true,
  className = "",
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
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${float ? "animate-float-slow" : ""} ${className}`}
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
