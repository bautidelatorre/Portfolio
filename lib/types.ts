export type ProjectImage = {
  url: string;
  alt: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  images: ProjectImage[];
  externalUrl?: string;
  featured?: boolean;
};
