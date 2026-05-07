import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="bg-[#1f2d46] px-6 py-24 text-white md:px-[max(3rem,calc((100vw-1152px)/2+1.5rem))]">
        <div className="max-w-md">
          <p className="mb-4 text-sm font-bold text-[#ffbd35]">Ready to Grow?</p>
          <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-[-0.04em]">
            Expand Your Business Globally
          </h2>
          <p className="mb-8 text-sm leading-6 text-white/75">
            Let us connect you with quality products and services from around the world. Our trade experts are ready to support your growth.
          </p>
          <Link to="/contact" className="inline-flex bg-[#ffbd35] px-5 py-3 text-xs font-extrabold uppercase text-[#263248]">
            Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="bg-[#ffbd35] px-6 py-24 md:px-16">
        <div className="max-w-md">
          <p className="mb-4 text-sm font-bold text-[#263248]">Comprehensive Solutions</p>
          <p className="mb-8 text-sm leading-6 text-[#263248]/75">
            From custom sourcing to reliable delivery, we handle every aspect of international trade with transparency and expertise. Partner with us for seamless global commerce.
          </p>
          <Link to="/products" className="inline-flex bg-[#263248] px-5 py-3 text-xs font-extrabold uppercase text-white">
            Browse Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
