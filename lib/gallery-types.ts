export type GalleryProject = {
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  url: string;
  author?: string;
  publishedAt?: string;
};

export type GalleryPage = {
  unavailable?: boolean;
  projects: GalleryProject[];
  hasMore: boolean;
  nextOffset: number | null;
};
