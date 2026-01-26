import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedPackages from '@/components/FeaturedPackages';
import ServicesSection from '@/components/ServicesSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPackages />
        <StatsSection />
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
