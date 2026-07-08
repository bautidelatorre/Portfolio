export function MobileOffset({
  offset = 0,
  className = "",
  children,
}: {
  offset?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`max-sm:translate-y-[var(--mobile-offset)] ${className}`}
      style={{ "--mobile-offset": `${offset}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
