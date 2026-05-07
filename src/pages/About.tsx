import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Globe2,
  Handshake,
  Landmark,
  PackageCheck,
  ShieldCheck,
  Ship,
  Truck,
  Users,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSite } from '@/contexts/SiteContext';
import { sanitizeRichText } from '@/lib/richText';

const heroImage =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85';

const stats = [
  ['25+', 'Years of Trade Experience'],
  ['50+', 'Countries Served Worldwide'],
  ['1000+', 'Annual Shipments Delivered'],
  ['1,200+', 'Trusted Global Partners'],
];

const principles = [
  {
    icon: Globe2,
    title: 'Global Trade Knowledge',
    body: 'We combine regional market insight with practical import and export execution across key trade corridors.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Supply Chains',
    body: 'Every shipment is supported by careful documentation, trusted partners, and disciplined compliance checks.',
  },
  {
    icon: Handshake,
    title: 'Long-Term Partnerships',
    body: 'Our work is built around reliable relationships with buyers, suppliers, logistics teams, and institutions.',
  },
];

const clientMarks = [
  [Landmark, 'TradeCorp'],
  [PackageCheck, 'CargoLine'],
  [Ship, 'PortFlow'],
  [Truck, 'RouteMax'],
  [FileCheck2, 'DocuTrade'],
];

export default function About() {
  const { settings } = useSite();
  const founders = settings.teamMembers?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        <section className="relative min-h-[520px] overflow-hidden bg-[#1f2d46]">
          <img src={heroImage} alt="International logistics containers" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2d46] via-[#1f2d46]/90 to-[#1f2d46]/35" />
          <div className="absolute -right-20 top-16 h-72 w-72 rounded-full border-[36px] border-[#ffbd35]/15" />
          <div className="relative z-10 mx-auto flex min-h-[520px] max-w-6xl items-center px-6">
            <div className="max-w-2xl text-white">
              <p className="mb-5 text-sm font-extrabold text-[#ffbd35]">About Multi International</p>
              <h1 className="mb-6 font-sans text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Built for Reliable Global Trade
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/75 md:text-base">
                We connect businesses with dependable sourcing, documentation, logistics, and cross-border trade support.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-20 bg-white">
          <div className="mx-auto -mt-24 grid max-w-5xl grid-cols-2 bg-white shadow-2xl md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={value} className="border-b border-r border-slate-200 p-7 md:p-9">
                <p className="mb-3 text-4xl font-extrabold tracking-[-0.04em] text-[#42516d]">{value}</p>
                <p className="max-w-[150px] text-xs leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-20 md:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-bold text-[#ffbd35]">Who We Are</p>
            <h2 className="mb-7 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em]">
              We Are A Leading International Company In The World
            </h2>
            <div
              className="mb-8 max-w-2xl text-sm leading-7 text-slate-500"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.aboutText) }}
            />
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase text-[#263248] transition hover:bg-[#f4a90d]"
            >
              Our Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-7">
            {principles.map(({ icon: Icon, title, body }) => (
              <article key={title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[#ffbd35] text-[#263248]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-extrabold tracking-[-0.03em]">{title}</h3>
                <p className="text-sm leading-6 text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-slate-50 via-slate-50 to-white py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="mb-4 text-sm font-bold text-[#42516d]">About Founders</p>
            <h2 className="mx-auto mb-16 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em]">
              Our Founders
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {founders.slice(0, 3).map((member) => (
                <article key={member.id} className="relative h-96 overflow-hidden text-left shadow-sm">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d46]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-7 left-7 text-white">
                    <h3 className="text-lg font-extrabold">{member.name}</h3>
                    <p className="text-xs text-white/80">{member.title}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2">
          <div className="relative overflow-hidden bg-[#1f2d46] px-6 py-24 text-white md:px-[max(3rem,calc((100vw-1152px)/2+1.5rem))]">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="relative max-w-md">
              <p className="mb-5 text-sm font-bold text-[#ffbd35]">Sustainability</p>
              <h2 className="mb-7 text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Committed To Secure & Sustainable Trade
              </h2>
              <p className="mb-10 text-sm leading-7 text-white/75">
                We focus on responsible routing, careful handling, and transparent coordination from origin to destination.
              </p>
              <Link to="/contact" className="inline-flex bg-[#ffbd35] px-8 py-4 text-xs font-extrabold uppercase text-[#263248]">
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#ffbd35] px-6 py-24 md:px-24">
            <div className="absolute right-10 top-12 h-56 w-56 rounded-full border-[26px] border-white/15" />
            <div className="relative max-w-md">
              <h2 className="mb-5 text-2xl font-extrabold tracking-[-0.03em]">We Follow Best Practices</h2>
              <p className="mb-8 text-sm leading-7 text-[#263248]/75">
                Our process is shaped around speed, accuracy, and the checks needed to keep international shipments moving.
              </p>
              <ul className="space-y-5 text-base font-bold text-[#263248]">
                {[
                  [CheckCircle2, 'Verified Trade Partners'],
                  [Clock3, 'Time-Sensitive Coordination'],
                  [Truck, 'Reliable Cargo Routing'],
                  [Ship, 'Custom Freight Solutions'],
                ].map(([Icon, label]) => (
                  <li key={label as string} className="flex items-center gap-4">
                    <Icon className="h-5 w-5" /> {label as string}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="mb-5 text-sm font-bold text-[#ffbd35]">Trust and Worth</p>
          <h2 className="mb-14 text-4xl font-extrabold tracking-[-0.04em]">Our Clients</h2>
          <div className="grid grid-cols-2 items-center gap-8 text-slate-400 md:grid-cols-5">
            {clientMarks.map(([Icon, label], index) => (
              <div key={index} className="flex items-center justify-center gap-3 text-2xl font-extrabold">
                <Icon className="h-9 w-9" />
                <span>{label as string}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
