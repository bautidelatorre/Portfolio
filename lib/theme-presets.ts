export type ThemePreset = {
  name: string;
  accentColor: string;
  backgroundColor: string;
  darkColor: string;
};

export const themePresets: ThemePreset[] = [
  { name: "Coral", accentColor: "#ff6044", backgroundColor: "#ffffff", darkColor: "#121212" },
  { name: "Neón naranja", accentColor: "#ff6a00", backgroundColor: "#ffffff", darkColor: "#121212" },
  { name: "Índigo", accentColor: "#4338ca", backgroundColor: "#ffffff", darkColor: "#14142b" },
  { name: "Verde bosque", accentColor: "#1f7a53", backgroundColor: "#f7f6f1", darkColor: "#12211b" },
  { name: "Rosa", accentColor: "#e6417a", backgroundColor: "#fffaf9", darkColor: "#1f1417" },
  { name: "Monocromo", accentColor: "#121212", backgroundColor: "#ffffff", darkColor: "#121212" },
];
