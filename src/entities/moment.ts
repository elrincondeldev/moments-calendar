export interface Moment {
  id: string;
  title: string;
  description?: string;
  content: ContentMoment;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentMoment {
  images?: string[];
  videos?: string[];
  audio?: string[];
}

