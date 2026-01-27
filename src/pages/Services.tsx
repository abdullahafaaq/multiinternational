import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import { useSite } from '@/contexts/SiteContext';

export default function Services() {
  const { services } = useSite();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-medium mb-2 tracking-wider uppercase text-sm">
              What We Offer
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Services
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              From sourcing to delivery, we provide comprehensive trade services to make your international business seamless and profitable.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No services available at the moment. Please check back later!
                </p>
              </div>
            )}
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
