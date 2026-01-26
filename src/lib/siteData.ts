// Site configuration - this will be managed through admin panel
export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  phone: string;
  address: string;
  aboutText: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price: number;
  description: string;
  highlights: string[];
  image: string;
  featured: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageId?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

// Default site settings
export const defaultSiteSettings: SiteSettings = {
  siteName: "Multi Travel",
  tagline: "Explore the World with Us",
  heroTitle: "Discover Your Next Adventure",
  heroSubtitle: "Curated travel experiences that create memories lasting a lifetime. From exotic beaches to mountain peaks, we craft journeys that transform.",
  email: "info@multitravel.com",
  phone: "+1 (555) 123-4567",
  address: "123 Travel Street, Adventure City, AC 12345",
  aboutText: "Multi Travel has been crafting unforgettable journeys for over 15 years. Our team of travel experts combines local knowledge with global experience to create personalized adventures that exceed expectations."
};

// Default packages
export const defaultPackages: TravelPackage[] = [
  {
    id: "1",
    name: "Maldives Paradise Escape",
    destination: "Maldives",
    duration: "7 Days / 6 Nights",
    price: 3499,
    description: "Experience ultimate luxury in overwater bungalows with crystal clear waters and pristine beaches.",
    highlights: ["Overwater Villa", "All-Inclusive Dining", "Sunset Cruise", "Spa Treatment"],
    image: "maldives",
    featured: true
  },
  {
    id: "2",
    name: "Greek Island Hopping",
    destination: "Santorini, Greece",
    duration: "10 Days / 9 Nights",
    price: 2899,
    description: "Explore the iconic white-washed villages, stunning sunsets, and rich Mediterranean culture.",
    highlights: ["Island Ferry Pass", "Wine Tasting", "Local Cuisine Tour", "Photography Spots"],
    image: "santorini",
    featured: true
  },
  {
    id: "3",
    name: "Swiss Alpine Adventure",
    destination: "Switzerland",
    duration: "8 Days / 7 Nights",
    price: 4299,
    description: "Journey through majestic mountains, charming villages, and breathtaking alpine scenery.",
    highlights: ["Scenic Train Ride", "Mountain Hiking", "Chocolate Factory", "Lakeside Stay"],
    image: "swiss-alps",
    featured: true
  },
  {
    id: "4",
    name: "Bali Spiritual Retreat",
    destination: "Bali, Indonesia",
    duration: "9 Days / 8 Nights",
    price: 2199,
    description: "Find inner peace among ancient temples, lush rice terraces, and spiritual sanctuaries.",
    highlights: ["Temple Tours", "Yoga Sessions", "Rice Terrace Trek", "Balinese Cooking Class"],
    image: "bali",
    featured: false
  },
  {
    id: "5",
    name: "Dubai Luxury Experience",
    destination: "Dubai, UAE",
    duration: "6 Days / 5 Nights",
    price: 3799,
    description: "Experience futuristic architecture, world-class shopping, and Arabian hospitality.",
    highlights: ["Burj Khalifa Visit", "Desert Safari", "Luxury Hotel Stay", "Gold Souk Tour"],
    image: "dubai",
    featured: false
  },
  {
    id: "6",
    name: "Machu Picchu Expedition",
    destination: "Peru",
    duration: "12 Days / 11 Nights",
    price: 3999,
    description: "Trek through the Andes to discover the ancient Incan citadel and rich cultural heritage.",
    highlights: ["Inca Trail Trek", "Local Guide", "Cultural Experiences", "Cusco Exploration"],
    image: "machu-picchu",
    featured: false
  }
];

// Default services
export const defaultServices: Service[] = [
  {
    id: "1",
    name: "Custom Trip Planning",
    description: "Personalized itineraries designed around your preferences, budget, and travel style.",
    icon: "map"
  },
  {
    id: "2",
    name: "Flight Booking",
    description: "Access to the best flight deals with flexible booking options and 24/7 support.",
    icon: "plane"
  },
  {
    id: "3",
    name: "Hotel Reservations",
    description: "Handpicked accommodations from boutique hotels to luxury resorts worldwide.",
    icon: "building"
  },
  {
    id: "4",
    name: "Visa Assistance",
    description: "Hassle-free visa processing and documentation support for your destination.",
    icon: "file-text"
  },
  {
    id: "5",
    name: "Travel Insurance",
    description: "Comprehensive coverage for peace of mind throughout your journey.",
    icon: "shield"
  },
  {
    id: "6",
    name: "Group Tours",
    description: "Join like-minded travelers on expertly guided group adventures.",
    icon: "users"
  }
];
