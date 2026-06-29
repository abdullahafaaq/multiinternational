// Page-specific hero content interfaces
export interface PageHero {
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaLabel: string;
  ctaPath: string;
}

// Stats interface
export interface Stat {
  value: string;
  label: string;
}

// Office location interface
export interface Office {
  id: string;
  name: string;
  address: string;
}
