const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function ThemeStyle({
  accentColor,
  backgroundColor,
  darkColor,
}: {
  accentColor: string;
  backgroundColor: string;
  darkColor: string;
}) {
  const accent = HEX_COLOR_RE.test(accentColor) ? accentColor : "#ff6044";
  const background = HEX_COLOR_RE.test(backgroundColor) ? backgroundColor : "#ffffff";
  const dark = HEX_COLOR_RE.test(darkColor) ? darkColor : "#121212";

  return (
    <style>{`:root { --accent: ${accent}; --background: ${background}; --dark: ${dark}; }`}</style>
  );
}
