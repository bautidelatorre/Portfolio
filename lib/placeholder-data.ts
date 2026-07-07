import { Project } from "./types";

// Sample content — replaced by real projects from the admin panel
// once the database and image upload are connected.
export const placeholderProjects: Project[] = [
  {
    id: "1",
    slug: "aurora-brand-identity",
    title: "Aurora — Brand identity",
    description:
      "Complete visual identity system for a clothing brand: logo, palette, typography, and applications across packaging and social media.",
    tags: ["Branding", "Visual identity"],
    images: [
      { url: "", alt: "Aurora logo" },
      { url: "", alt: "Palette and typography" },
      { url: "", alt: "Packaging application" },
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "personal-finance-app",
    title: "Personal finance app",
    description:
      "Product design for a mobile expense-tracking app: research, wireframes, and final high-fidelity UI.",
    tags: ["UI/UX", "Mobile"],
    images: [
      { url: "", alt: "App home screen" },
      { url: "", alt: "Onboarding flow" },
    ],
  },
  {
    id: "3",
    slug: "architecture-studio-landing",
    title: "Landing page — Architecture studio",
    description:
      "Website for an architecture studio, focused on showcasing projects with large-format photography and minimalist navigation.",
    tags: ["Web Design"],
    images: [{ url: "", alt: "Site homepage" }],
    externalUrl: "https://example.com",
  },
  {
    id: "4",
    slug: "culture-magazine-editorial",
    title: "Editorial — Culture magazine",
    description:
      "Editorial design for a quarterly magazine: grid, typography, and art direction for features and covers.",
    tags: ["Editorial", "Typography"],
    images: [
      { url: "", alt: "Magazine cover" },
      { url: "", alt: "Interior spread" },
    ],
  },
];
