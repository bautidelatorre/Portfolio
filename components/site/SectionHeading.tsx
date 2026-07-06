export function SectionHeading({
  index,
  label,
  tone = "light",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 -left-1 -z-10 text-[6.5rem] leading-none font-medium tracking-[-0.04em] select-none sm:text-[8.5rem] ${
          tone === "dark" ? "text-white/[0.06]" : "text-muted-bg"
        }`}
      >
        {index}
      </span>
      <h2 className="font-label text-xs font-semibold tracking-[0.08em] text-accent uppercase">
        {label}
      </h2>
    </div>
  );
}
