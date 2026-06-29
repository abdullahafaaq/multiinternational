import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Send,
  Ship,
  Star,
  Truck,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';

const heroImage =
  'https://images.unsplash.com/photo-1506792006437-256b665541e2?auto=format&fit=crop&w=1800&q=85';
const stats = [
  ['50+', 'Countries Served Worldwide'],
  ['1000+', 'Annual Shipments Delivered'],
  ['3M+', 'Tonnes Freight Handled'],
  ['1,200+', 'Trusted Global Partners'],
];

const offices = [
  ['Canada', '60 Agnes Street Mississauga, ON'],
  ['Pakistan', 'UG-21 Lucky Center, 7-8 Jail Road, Lahore'],
  ['Australia', '3851 Hills Avenue, Kojonup'],
];

// Certifications now come from SiteContext (admin-managed). See `certificates`.

const testimonials = [
  ['Engineering Manager', 'Alice Howard'],
  ['Interior Designer', 'Nathan Marshall'],
  ['Architect', 'Emma Romero'],
  ['Manager', 'Ann Smith'],
];

export default function Index() {
  const { settings, services, certificates, addInquiry } = useSite();
  const displayTestimonials = settings.testimonials || testimonials.map(([role, name]) => ({ 
    id: `default-${name}`, 
    name, 
    role,
    content: "Outstanding service and attention to detail. Multi International transformed how we manage our supply chain globally. Highly recommended!"
  }));
  const founders = settings.teamMembers?.slice(0, 3) || [];
  const certifications = certificates || [];
  const heroImages = useMemo(() => {
    const slideImages = settings.heroSlides
      ?.map((slide) => slide.backgroundImage?.trim())
      .filter(Boolean);

    return slideImages?.length ? slideImages : [heroImage];
  }, [settings.heroSlides]);
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  // Request a Quote form state
  const [quoteData, setQuoteData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingQuote(true);

    // Simulate API call
    await new Promise((res) => setTimeout(res, 800));

    addInquiry({
      name: quoteData.name,
      email: quoteData.email,
      phone: '',
      productId: '',
      message: quoteData.message,
    });

    toast.success("Thank you! We'll get back to you soon.");
    setQuoteData({ name: '', email: '', subject: '', message: '' });
    setIsSendingQuote(false);
  };

  useEffect(() => {
    setActiveHeroImage(0);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main>
        <section className="relative min-h-[760px] overflow-hidden">
          {heroImages.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt="Modern global trade background"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                index === activeHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f3855]/55 via-[#407da7]/25 to-[#16304a]/25" />
          <div className="relative z-10 mx-auto flex min-h-[660px] max-w-6xl items-center px-6 pt-24">
            <div className="max-w-2xl text-white">
              <p className="mb-5 text-sm font-bold text-[#ffbd35]">Your Global Trade Partner</p>
              <h1 className="mb-6 max-w-2xl font-sans text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Connecting Businesses Worldwide
              </h1>
              <p className="mb-8 max-w-xl text-sm leading-7 text-white/85 md:text-base">
                We specialize in premium quality imports and exports, connecting businesses across continents with reliable
                supply chains and competitive pricing.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-[#24304a] shadow-xl transition hover:bg-[#f4a90d]"
              >
                Our Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-20 bg-white">
          <div className="mx-auto -mt-36 grid max-w-5xl grid-cols-1 shadow-2xl md:grid-cols-[1fr_1.35fr]">
            <div className="bg-[#ffbd35] p-9 md:p-12">
              <p className="mb-3 text-sm font-extrabold text-[#263248]">Reliable Import & Export</p>
              <h2 className="mb-4 max-w-sm text-3xl font-extrabold leading-tight tracking-[-0.03em]">
                25 Years of Seamless International Logistics
              </h2>
              <p className="mb-7 text-sm leading-6 text-[#263248]/75">
                Navigating complex international markets requires expertise and precision. We provide end-to-end import
                and export solutions.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center bg-[#263248] px-5 py-3 text-xs font-extrabold uppercase text-white"
              >
                Partner With Us
              </Link>
            </div>
            <div className="grid grid-cols-2 bg-white">
              {stats.map(([value, label]) => (
                <div key={value} className="border-b border-r border-slate-200 p-8">
                  <p className="mb-3 text-4xl font-extrabold tracking-[-0.04em] text-[#42516d]">{value}</p>
                  <p className="max-w-[140px] text-xs leading-5 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 pt-20">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-bold text-[#42516d]">What We Offer</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em]">Quality Services</h2>
            </div>
            <Link to="/services" className="hidden text-xs font-extrabold uppercase tracking-wide text-[#42516d] md:inline-flex items-center gap-2 hover:text-primary transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 flex justify-center md:hidden">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#42516d] hover:text-primary transition-colors">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2">
          <div className="relative overflow-hidden bg-[#1f2d46] px-6 py-20 text-white md:px-[max(3rem,calc((100vw-1152px)/2+1.5rem))]">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="relative max-w-md">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Global Standards</p>
              <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Committed to Secure & Sustainable Trade
              </h2>
              <p className="mb-8 text-sm leading-6 text-white/75">
                We prioritize the secure handling of your cargo while supporting responsible trade across communities and
                supply chain routes.
              </p>
              <Link to="/contact" className="inline-flex bg-[#ffbd35] px-5 py-3 text-xs font-extrabold uppercase text-[#263248]">
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#ffbd35] px-6 py-20 md:px-16">
            <div className="absolute right-10 top-12 h-56 w-56 rounded-full border-[26px] border-white/15" />
            <div className="relative max-w-md">
              <p className="mb-4 text-sm font-bold text-[#263248]">We Follow Industry Best Practices</p>
              <p className="mb-8 text-sm leading-6 text-[#263248]/75">
                From secure warehousing to strict customs compliance, our operations are built on transparency and rigorous
                quality controls that protect your goods.
              </p>
              <ul className="space-y-4 text-sm font-bold text-[#263248]">
                {[
                  ['Eco-Friendly Routing', CheckCircle2],
                  ['Expedited Clearance', Clock3],
                  ['Real-Time Cargo Tracking', Truck],
                  ['Custom Freight Solutions', Ship],
                ].map(([label, Icon]) => (
                  <li key={label as string} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" /> {label as string}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-12 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-sm font-bold text-[#42516d]">Sustainability</p>
              <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Transform Communities Across the Globe
              </h2>
            </div>
            <p className="self-end text-sm leading-7 text-slate-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in ipsum id orci porta dapibus.
              Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {offices.map(([country, address]) => (
              <article key={country} className="border border-slate-200 bg-white p-8">
                <h3 className="mb-4 text-lg font-extrabold">{country}</h3>
                <p className="mb-10 text-sm text-slate-500">{address}</p>
                <Link to="/contact" className="inline-flex items-center text-xs font-extrabold uppercase text-[#42516d]">
                  Direction <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase text-[#263248]">
              View Our Offices
            </Link>
          </div>
        </section>

        <section className="bg-gradient-to-r from-slate-50 via-slate-50 to-white py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="mb-4 text-sm font-bold text-[#42516d]">About Founders</p>
            <h2 className="mx-auto mb-16 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em]">
              We Are Leading International Company In The World
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {founders.map((member) => (
                <article key={member.id} className="relative h-96 overflow-hidden text-left">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d46]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-7 left-7 text-white">
                    <h3 className="text-lg font-extrabold">{member.name}</h3>
                    <p className="text-xs">{member.title}</p>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/about" className="mt-12 inline-flex bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase text-[#263248]">
              About Us
            </Link>
          </div>
        </section>

        <section className="pt-24">
          <div className="mx-auto mb-12 flex max-w-6xl items-end justify-between px-6">
            <div>
              <p className="mb-3 text-sm font-bold text-[#42516d]">We Build trust</p>
              <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Certifications</h2>
            </div>
            <Link
              to="/certificates"
              className="bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase text-[#263248]"
            >
              View All
            </Link>
          </div>

          {/* Show only 4 certificates on homepage */}
          <div className="grid md:grid-cols-4 min-h-[70vh] items-stretch">
            {certifications.slice(0, 4).map((item) => (

              <article
                key={item.id}
                className="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="group relative block h-full w-full text-left">
                  <div className="absolute inset-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d46]/85 via-[#1f2d46]/15 to-transparent" />

                  <div className="absolute bottom-7 left-7 right-7 text-white">
                    <h3 className="text-lg font-extrabold leading-tight line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-white/80 line-clamp-1">{item.issuer}</p>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </section>


        <section className="bg-gradient-to-br from-slate-50 to-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-bold text-[#42516d]">What Our Clients Say</p>
              <h2 className="mb-4 text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">Client Testimonials</h2>
              <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
                Hear from satisfied partners who have trusted us with their international trade needs.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {displayTestimonials.map((testimonial) => (
                <article key={testimonial.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Decorative top bar */}
                  <div className="mb-4 h-1 w-12 bg-gradient-to-r from-[#ffbd35] to-[#f4a90d]" />
                  
                  {/* Stars */}
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#ffbd35] text-[#ffbd35]" />
                    ))}
                  </div>
                  
                  {/* Quote text */}
                  <p className="mb-6 text-sm leading-6 text-slate-700">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Person info */}
                  <div className="border-t border-slate-200 pt-4">
                    <p className="font-bold text-[#263248]">{testimonial.name}</p>
                    <p className="text-xs text-[#42516d]">{testimonial.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
            <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-[0.9fr_1fr]">
            <form onSubmit={handleQuoteSubmit} className="bg-[#1f2d46] p-9 text-white">
              <h2 className="mb-2 text-3xl font-extrabold tracking-[-0.04em]">Request a Quote</h2>
              <p className="mb-7 text-sm text-white/70">Ready to Work Together? Build a project with us.</p>
              <div className="space-y-4">
                <input
                  className="w-full border border-[#ffbd35]/40 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Enter your name *"
                  value={quoteData.name}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  className="w-full border border-[#ffbd35]/40 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Enter your email address *"
                  type="email"
                  value={quoteData.email}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Subject"
                  value={quoteData.subject}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, subject: e.target.value }))}
                />
                <textarea
                  className="min-h-28 w-full border border-white/20 bg-transparent px-4 py-3 text-sm outline-none"
                  placeholder="Message *"
                  value={quoteData.message}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
                <button
                  type="submit"
                  disabled={isSendingQuote}
                  className="inline-flex items-center gap-2 bg-[#ffbd35] px-5 py-3 text-xs font-extrabold uppercase text-[#263248] disabled:opacity-60"
                >
                  {isSendingQuote ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="self-center">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Learn More From</p>
              <h2 className="mb-8 max-w-md text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {[
                  'How to create cities and communities that solve?',
                  'Construction of the winning $45 million?',
                  'How to create cities and communities that solve?',
                ].map((question, index) => (
                  <details key={`faq-${index}`} className="group bg-white px-5 py-4 text-sm shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[#263248]">
                      {question}
                      <CircleDollarSign className="h-4 w-4 text-[#ffbd35]" />
                    </summary>
                    <p className="mt-3 text-slate-500">
                      Our specialists coordinate planning, documents, customs, and delivery milestones before shipment
                      begins.
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
