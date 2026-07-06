import type { Metadata } from "next";
import { Geist, Geist_Mono, Zalando_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/actions/settings";
import { googleFontStylesheetUrl } from "@/lib/google-fonts";
import { ThemeStyle } from "@/components/site/ThemeStyle";
import { CursorGlow } from "@/components/site/CursorGlow";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zalandoSans = Zalando_Sans({
  variable: "--font-zalando-sans",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Bautista — Diseño",
  description: "Portfolio de trabajos de diseño de Bautista.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const fontUrl = googleFontStylesheetUrl(settings.fontFamily);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${zalandoSans.variable} h-full antialiased`}
    >
      <head>
        {fontUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fontUrl} />
            <style>{`:root { --font-sans: '${settings.fontFamily}', var(--font-zalando-sans), sans-serif; --default-font-family: '${settings.fontFamily}', var(--font-zalando-sans), sans-serif; }`}</style>
          </>
        )}
        <ThemeStyle
          accentColor={settings.accentColor}
          backgroundColor={settings.backgroundColor}
          darkColor={settings.darkColor}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="noise-overlay" aria-hidden="true" />
        <CursorGlow color={settings.cursorGlowColor} />
        {children}
      </body>
    </html>
  );
}
