const FONT_NAME_SHAPE_RE = /^[A-Za-z0-9 ]{1,60}$/;

export function googleFontStylesheetUrl(fontFamily: string): string | null {
  if (!FONT_NAME_SHAPE_RE.test(fontFamily)) return null;
  const encoded = encodeURIComponent(fontFamily).replace(/%20/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;500;600;700&display=swap`;
}
