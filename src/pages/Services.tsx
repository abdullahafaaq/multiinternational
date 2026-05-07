import { Briefcase, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import { useSite } from '@/contexts/SiteContext';

export default function Services() {
  const { services } = useSite();

  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1f2d46]">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85"
            alt="Professional trade services background"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2d46] via-[#1f2d46]/90 to-[#1f2d46]/50" />
          <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border-[36px] border-[#ffbd35]/15" />
          <div className="mx-auto grid min-h-[430px] max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#ffbd35]">
                <Briefcase className="h-4 w-4" />
                What We Offer
              </p>
              <h1 className="mb-6 max-w-2xl font-sans text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Our Services
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/75 md:text-base">
                From sourcing to delivery, we provide comprehensive trade services to make your international business seamless and profitable.
              </p>
            </div>

            <div className="relative z-10 border-l-4 border-[#ffbd35] bg-white/10 p-8 text-white backdrop-blur-sm">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Why Choose Us</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]">25+</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]">50+</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">Countries Served</p>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/85">
                <Sparkles className="h-5 w-5 text-[#ffbd35]" />
                Trusted by global businesses worldwide.
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12">
              <p className="mb-3 text-sm font-bold text-[#42516d]">Professional Solutions</p>
              <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Premium Trade Services</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            {services.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-base text-slate-500">
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
