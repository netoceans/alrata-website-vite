export type AspectRatio = 'landscape' | 'portrait' | 'wide' | 'square';

export interface MediaAsset {
  src: string | null;
  poster: string;
  alt: string;
  aspectRatio: AspectRatio;
  placeholder: boolean;
  credit?: string;
  sourceUrl?: string;
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  href: string;
  media: MediaAsset;
}
export interface TreatmentSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  points?: readonly string[];
}

export interface Treatment extends Service {
  category: string;
  introduction: string;
  sections: readonly TreatmentSection[];
  relatedSlugs: readonly string[];
  reference?: { label: string; href: string };
}

export interface VideoItem {
  title: string;
  meta: string;
  description: string;
  media: MediaAsset;
}
export interface TeamMember {
  name: string;
  role: string;
  href: string;
  media: MediaAsset;
}
export interface Offer {
  category: string;
  name: string;
  price: string | null;
  description: string;
  availability: string;
  href: string | null;
  placeholder: boolean;
  media: MediaAsset;
}
export interface Statistic {
  value: number | null;
  suffix: string;
  label: string;
  placeholder: string;
}
export interface JourneyStep {
  title: string;
  description: string;
}
export interface ClinicContact {
  openingHours: {
    display: string;
    days: readonly ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
    opens: string;
    closes: string;
  };
  postalAddress: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string };
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  address: string;
  mapHref: string;
  openStreetMapEmbedHref: string;
  bookingHref: string;
}
