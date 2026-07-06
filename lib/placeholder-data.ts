import { Project } from "./types";

// Contenido de ejemplo — se reemplaza por proyectos reales desde el panel admin
// una vez que la base de datos y la subida de imágenes estén conectadas.
export const placeholderProjects: Project[] = [
  {
    id: "1",
    slug: "identidad-marca-aurora",
    title: "Identidad de marca — Aurora",
    description:
      "Sistema de identidad visual completo para una marca de indumentaria: logotipo, paleta, tipografía y aplicaciones en packaging y redes.",
    tags: ["Branding", "Identidad visual"],
    images: [
      { url: "", alt: "Logotipo Aurora" },
      { url: "", alt: "Paleta y tipografía" },
      { url: "", alt: "Aplicación en packaging" },
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "app-finanzas-personales",
    title: "App de finanzas personales",
    description:
      "Diseño de producto para una app móvil de control de gastos: research, wireframes y UI final en alta fidelidad.",
    tags: ["UI/UX", "Mobile"],
    images: [
      { url: "", alt: "Pantalla principal de la app" },
      { url: "", alt: "Flujo de onboarding" },
    ],
  },
  {
    id: "3",
    slug: "landing-estudio-arquitectura",
    title: "Landing — Estudio de arquitectura",
    description:
      "Sitio web para un estudio de arquitectura, enfocado en mostrar proyectos con fotografía de gran formato y navegación minimalista.",
    tags: ["Web Design"],
    images: [{ url: "", alt: "Home del sitio" }],
    externalUrl: "https://example.com",
  },
  {
    id: "4",
    slug: "editorial-revista-cultura",
    title: "Editorial — Revista de cultura",
    description:
      "Diseño editorial de una revista trimestral: grilla, tipografía y dirección de arte para notas y tapas.",
    tags: ["Editorial", "Tipografía"],
    images: [
      { url: "", alt: "Tapa de la revista" },
      { url: "", alt: "Doble página interior" },
    ],
  },
];
