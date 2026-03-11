import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSite } from '@/contexts/SiteContext';
import { hasRichTextContent, sanitizeRichText } from '@/lib/richText';

export default function HeroSection() {
  const { settings } = useSite();
  const slides = useMemo(() => {
    if (settings.heroSlides?.length) {
      return settings.heroSlides;
    }

    return [
      {
        id: 'fallback-slide',
        badge: settings.tagline,
        title: settings.heroTitle,
        subtitle: settings.heroSubtitle,
        backgroundImage: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920',
        primaryCtaLabel: 'View Products',
        primaryCtaPath: '/products',
        secondaryCtaLabel: 'Learn About Us',
        secondaryCtaPath: '/about',
      },
    ];
  }, [settings.heroSlides, settings.tagline, settings.heroTitle, settings.heroSubtitle]);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide((prev) => (prev >= slides.length ? 0 : prev));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.backgroundImage}
            alt={`Hero slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-medium mb-4 animate-fade-up opacity-0 stagger-1 tracking-wider uppercase text-sm">
            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeSlide.badge) }} />
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up opacity-0 stagger-2 leading-tight text-shadow">
            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeSlide.title) }} />
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 animate-fade-up opacity-0 stagger-3 leading-relaxed max-w-2xl mx-auto">
            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeSlide.subtitle) }} />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 stagger-4">
            {activeSlide.primaryCtaPath !== 'none' && hasRichTextContent(activeSlide.primaryCtaLabel) && (
              <Link to={activeSlide.primaryCtaPath}>
                <Button size="lg" className="gold-gradient text-accent-foreground font-semibold shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto">
                  <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeSlide.primaryCtaLabel) }} />
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            {activeSlide.secondaryCtaPath !== 'none' && hasRichTextContent(activeSlide.secondaryCtaLabel) && (
              <Link to={activeSlide.secondaryCtaPath}>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-background text-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground w-full sm:w-auto">
                  <Globe className="mr-2 w-5 h-5" />
                  <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(activeSlide.secondaryCtaLabel) }} />
                </Button>
              </Link>
            )}
          </div>

          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-accent' : 'w-2.5 bg-primary-foreground/40'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
