import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackageCard from '@/components/PackageCard';
import { useSite } from '@/contexts/SiteContext';

export default function Packages() {
  const { packages } = useSite();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-medium mb-2 tracking-wider uppercase text-sm">
              Explore Destinations
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Travel Packages
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Discover our carefully curated collection of travel experiences, designed to create memories that last a lifetime.
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
            
            {packages.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No packages available at the moment. Please check back later!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
