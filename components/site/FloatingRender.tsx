import Image from "next/image";

export function FloatingRender({
  src,
  className,
  width = 380,
  height = 380,
  duration = 9,
  delay = 0,
  rotate = 0,
  opacity = 0.85,
  grayscale = false,
}: {
  src: string;
  className?: string;
  width?: number;
  height?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
  opacity?: number;
  grayscale?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-float-slow pointer-events-none absolute ${grayscale ? "grayscale" : ""} ${className ?? ""}`}
      style={
        {
          opacity,
          rotate: `${rotate}deg`,
          "--float-duration": `${duration}s`,
          "--float-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      <Image src={src} alt="" width={width} height={height} className="h-auto w-full" />
    </div>
  );
}
