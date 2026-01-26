import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSite } from '@/contexts/SiteContext';
import heroImage from '@/assets/hero-maldives.jpg';

export default function HeroSection() {
  const { settings } = useSite();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-medium mb-4 animate-fade-up opacity-0 stagger-1 tracking-wider uppercase text-sm">
            {settings.tagline}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up opacity-0 stagger-2 leading-tight text-shadow">
            {settings.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 animate-fade-up opacity-0 stagger-3 leading-relaxed max-w-2xl mx-auto">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 stagger-4">
            <Link to="/packages">
              <Button size="lg" className="gold-gradient text-accent-foreground font-semibold shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto">
                Explore Packages
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto">
                <Play className="mr-2 w-5 h-5" />
                Watch Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
