import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { useSite } from '@/contexts/SiteContext';
import { Award, Heart, Globe, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We believe travel transforms lives. Every journey we plan is infused with our love for exploration.'
  },
  {
    icon: Globe,
    title: 'Global Expertise',
    description: 'Our team has traveled to over 100 countries, bringing firsthand knowledge to every itinerary.'
  },
  {
    icon: Users,
    title: 'Personalized Service',
    description: 'No two travelers are alike. We craft unique experiences tailored to your preferences.'
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'We partner only with trusted providers to ensure exceptional quality at every step.'
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
                      Founded in 2010, {settings.siteName} began with a simple dream: to make extraordinary travel experiences accessible to everyone.
                    </p>
                    <p>
                      What started as a small team of passionate travelers has grown into a full-service travel agency serving thousands of adventurers worldwide.
                    </p>
                    <p>
                      Today, we continue to push boundaries, discovering new destinations and creating innovative travel experiences that inspire and delight.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary text-primary-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">15+</p>
                    <p className="text-sm opacity-80">Years</p>
                  </div>
                  <div className="bg-accent text-accent-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">50K+</p>
                    <p className="text-sm opacity-80">Travelers</p>
                  </div>
                  <div className="bg-accent text-accent-foreground rounded-2xl p-6 text-center">
                    <p className="font-serif text-4xl font-bold mb-2">100+</p>
                    <p className="text-sm opacity-80">Destinations</p>
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
