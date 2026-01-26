import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TravelPackage } from '@/lib/siteData';

// Import images
import maldivesImg from '@/assets/hero-maldives.jpg';
import santoriniImg from '@/assets/santorini.jpg';
import swissAlpsImg from '@/assets/swiss-alps.jpg';
import baliImg from '@/assets/bali.jpg';
import dubaiImg from '@/assets/dubai.jpg';
import machuPicchuImg from '@/assets/machu-picchu.jpg';

const imageMap: Record<string, string> = {
  'maldives': maldivesImg,
  'santorini': santoriniImg,
  'swiss-alps': swissAlpsImg,
  'bali': baliImg,
  'dubai': dubaiImg,
  'machu-picchu': machuPicchuImg,
};

interface PackageCardProps {
  pkg: TravelPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const imageSrc = imageMap[pkg.image] || maldivesImg;

  return (
    <div className="group bg-card rounded-2xl overflow-hidden card-elevated">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {pkg.featured && (
          <div className="absolute top-4 left-4 gold-gradient text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              {pkg.destination}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              {pkg.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {pkg.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {pkg.description}
        </p>
        
        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.highlights.slice(0, 3).map((highlight, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-muted-foreground text-sm">From</span>
            <p className="text-2xl font-bold text-primary">
              ${pkg.price.toLocaleString()}
            </p>
          </div>
          <Link to={`/contact?package=${pkg.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Inquire Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
