import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { useSite } from '@/contexts/SiteContext';
import { Award, Globe, Users, Shield } from 'lucide-react';

const values = [
  {
    icon: Globe,
    title: 'Global Expertise',
    description: 'Our team has extensive experience in international markets, bringing firsthand knowledge to every transaction.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'We maintain strict quality standards and conduct thorough inspections to ensure product excellence.'
  },
  {
    icon: Users,
    title: 'Reliable Partnerships',
    description: 'We build long-term relationships with trusted suppliers and clients around the world.'
  },
  {
    icon: Award,
    title: 'Competitive Pricing',
    description: 'Our established network allows us to offer the best prices while maintaining quality standards.'
  },
];

export default function About() {
  const { settings } = useSite();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-medium mb-2 tracking-wider uppercase text-sm">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              About {settings.siteName}
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              {settings.aboutText}
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do at {settings.siteName}.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Our Journey
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 2010, {settings.siteName} began with a simple vision: to bridge global markets and connect businesses with quality products from around the world.
                    </p>
                    <p>
                      What started as a small trading company has grown into a comprehensive import/export business serving clients across multiple continents.
                    </p>
                    <p>
                      Today, we continue to expand our network, forging new partnerships and discovering innovative products that help our clients succeed in their markets.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary text-primary-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">15+</p>
                    <p className="text-sm opacity-80">Years</p>
                  </div>
                  <div className="bg-accent text-accent-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">50+</p>
                    <p className="text-sm opacity-80">Countries</p>
                  </div>
                  <div className="bg-accent text-accent-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">1000+</p>
                    <p className="text-sm opacity-80">Clients</p>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">4.9</p>
                    <p className="text-sm opacity-80">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
