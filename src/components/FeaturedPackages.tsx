import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PackageCard from '@/components/PackageCard';
import { useSite } from '@/contexts/SiteContext';

export default function FeaturedPackages() {
  const { packages } = useSite();
  const featuredPackages = packages.filter(pkg => pkg.featured).slice(0, 3);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-medium mb-2 tracking-wider uppercase text-sm">
            Handpicked Adventures
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Travel Packages
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most sought-after destinations, carefully curated to deliver extraordinary experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/packages">
            <Button variant="outline" size="lg" className="group">
              View All Packages
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
