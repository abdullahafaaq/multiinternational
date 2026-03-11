// Site configuration - this will be managed through admin panel
export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCtaLabel: string;
  primaryCtaPath: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: HeroSlide[];
  email: string;
  phone: string;
  address: string;
  address2: string;
  aboutText: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  unit: string;
  minOrderQuantity: string;
  pricePerUnit: number;
  description: string;
  specifications: string[];
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
  productId?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'resolved';
}

// Default site settings
export const defaultSiteSettings: SiteSettings = {
  siteName: "Multi International",
  tagline: "Your Global Trade Partner",
  heroTitle: "Connecting Businesses Worldwide",
  heroSubtitle: "We specialize in premium quality imports and exports, connecting businesses across continents with reliable supply chains and competitive pricing.",
  heroSlides: [
    {
      id: "slide-1",
      badge: "Your Global Trade Partner",
      title: "Connecting Businesses Worldwide",
      subtitle: "We specialize in premium quality imports and exports, connecting businesses across continents with reliable supply chains and competitive pricing.",
      backgroundImage: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920",
      primaryCtaLabel: "View Products",
      primaryCtaPath: "/products",
      secondaryCtaLabel: "Learn About Us",
      secondaryCtaPath: "/about"
    },
    {
      id: "slide-2",
      badge: "Reliable Import & Export",
      title: "Quality Products, Global Reach",
      subtitle: "From sourcing to delivery, our team ensures smooth cross-border trade operations tailored to your business goals.",
      backgroundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920",
      primaryCtaLabel: "Our Services",
      primaryCtaPath: "/services",
      secondaryCtaLabel: "Contact Us",
      secondaryCtaPath: "/contact"
    }
  ],
  email: "info@multiinternational.asia",
  phone: "+92 331 9056666 | 042 3755 3030",
  address: "UG-21, Lucky Center, 7-8 Jail Road, Lahore, Pakistan",
  address2: "",
  aboutText: "Multi International has been facilitating global trade for over 15 years. Under the leadership of Chief Executive IKRAM UL HAQ, our team of trade experts combines market knowledge with international experience to deliver quality products and reliable partnerships that exceed expectations."
};

// Default products
export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Premium Basmati Rice",
    category: "Agricultural Products",
    origin: "India",
    unit: "Metric Ton",
    minOrderQuantity: "20 MT",
    pricePerUnit: 1200,
    description: "Extra-long grain premium basmati rice, aged for 2 years. Perfect aroma and texture for fine dining.",
    specifications: ["Extra Long Grain", "2 Year Aged", "1% Broken Max", "Non-GMO Certified"],
    image: "rice",
    featured: true
  },
  {
    id: "2",
    name: "Organic Arabica Coffee",
    category: "Agricultural Products",
    origin: "Colombia",
    unit: "Metric Ton",
    minOrderQuantity: "5 MT",
    pricePerUnit: 4500,
    description: "Single-origin organic arabica coffee beans, carefully selected and roasted to perfection.",
    specifications: ["Single Origin", "Organic Certified", "Fair Trade", "Medium Roast"],
    image: "coffee",
    featured: true
  },
  {
    id: "3",
    name: "Industrial CNC Machinery",
    category: "Industrial Machinery",
    origin: "Germany",
    unit: "Unit",
    minOrderQuantity: "1 Unit",
    pricePerUnit: 85000,
    description: "High-precision CNC milling machines for manufacturing. Industry-leading accuracy and durability.",
    specifications: ["5-Axis Control", "0.001mm Precision", "CE Certified", "2 Year Warranty"],
    image: "machinery",
    featured: true
  },
  {
    id: "4",
    name: "Cotton Textiles",
    category: "Textiles & Garments",
    origin: "Bangladesh",
    unit: "Metric Ton",
    minOrderQuantity: "10 MT",
    pricePerUnit: 2800,
    description: "High-quality cotton fabrics and textiles suitable for garment manufacturing and home furnishings.",
    specifications: ["100% Cotton", "OEKO-TEX Certified", "Multiple Thread Counts", "Various Colors"],
    image: "textiles",
    featured: false
  },
  {
    id: "5",
    name: "Pharmaceutical Grade Chemicals",
    category: "Chemicals",
    origin: "Switzerland",
    unit: "Kilogram",
    minOrderQuantity: "500 KG",
    pricePerUnit: 150,
    description: "High-purity pharmaceutical intermediates and active ingredients for drug manufacturing.",
    specifications: ["99.9% Purity", "GMP Certified", "COA Included", "Cold Chain Available"],
    image: "chemicals",
    featured: false
  },
  {
    id: "6",
    name: "Consumer Electronics",
    category: "Electronics",
    origin: "China",
    unit: "Unit",
    minOrderQuantity: "1000 Units",
    pricePerUnit: 45,
    description: "Wholesale consumer electronics including smart devices, accessories, and components.",
    specifications: ["CE/FCC Certified", "OEM Available", "Custom Branding", "1 Year Warranty"],
    image: "electronics",
    featured: false
  }
];

// Default services
export const defaultServices: Service[] = [
  {
    id: "1",
    name: "Import/Export Consulting",
    description: "Expert guidance on international trade regulations, tariffs, and market entry strategies.",
    icon: "globe"
  },
  {
    id: "2",
    name: "Customs Clearance",
    description: "Streamlined customs documentation and clearance services for hassle-free imports and exports.",
    icon: "file-check"
  },
  {
    id: "3",
    name: "Freight Forwarding",
    description: "Comprehensive logistics solutions including sea, air, and land freight at competitive rates.",
    icon: "ship"
  },
  {
    id: "4",
    name: "Quality Inspection",
    description: "Pre-shipment and on-site quality inspections to ensure products meet your specifications.",
    icon: "search-check"
  },
  {
    id: "5",
    name: "Trade Documentation",
    description: "Complete documentation services including letters of credit, bills of lading, and certificates.",
    icon: "file-text"
  },
  {
    id: "6",
    name: "Supply Chain Management",
    description: "End-to-end supply chain optimization for efficient and cost-effective operations.",
    icon: "network"
  }
];
