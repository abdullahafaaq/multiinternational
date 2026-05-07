import { ArrowUpRight, Trophy, CheckCircle2, Clock3, Truck, Ship } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSite } from '@/contexts/SiteContext';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

type CertificateItem = {
  id: string;
  name: string;
  issuer: string;
  description: string;
  image: string;
  featured: boolean;
};

export default function Certificates() {
  const { certificates } = useSite();
  const featured = certificates.filter((certificate) => certificate.featured);
  const others = certificates.filter((certificate) => !certificate.featured);
  const [preview, setPreview] = useState<null | { image: string; name: string; issuer?: string }>(null);

  const featuredSpanClasses = [
    'xl:col-span-2 xl:row-span-2',
    'xl:col-span-2',
    'xl:col-span-2',
    'xl:col-span-2 xl:row-span-2',
    'xl:col-span-2',
    'xl:col-span-2',
  ];

  const featuredHeightClasses = [
    'xl:h-[34rem]',
    'xl:h-[16rem]',
    'xl:h-[16rem]',
    'xl:h-[34rem]',
    'xl:h-[16rem]',
    'xl:h-[16rem]',
  ];

  const renderMosaicTile = (cert: CertificateItem, index: number) => (
    <button
      key={cert.id}
      type="button"
      onClick={() => setPreview({ image: cert.image, name: cert.name, issuer: cert.issuer })}
      className={`group relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-left shadow-[0_24px_70px_-34px_rgba(15,23,42,0.65)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_85px_-36px_rgba(15,23,42,0.78)] animate-scale-in ${featuredSpanClasses[index % featuredSpanClasses.length]} ${featuredHeightClasses[index % featuredHeightClasses.length]}`}
      style={{ animationDelay: `${index * 100}ms` }}
      aria-label={`Open large preview for ${cert.name}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div
        className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundImage: `url(${cert.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[85%]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {cert.issuer}
            </p>
            <h3 className="font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
              {cert.name}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/78 md:text-[15px]">
              {cert.description}
            </p>
          </div>

          <div className="hidden shrink-0 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110 md:block">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </button>
  );

  const renderScrollerTile = (cert: CertificateItem, index: number) => (
    <button
      key={cert.id}
      type="button"
      onClick={() => setPreview({ image: cert.image, name: cert.name, issuer: cert.issuer })}
      className="group relative w-[82vw] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 text-left shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.56)] animate-scale-in sm:w-[46vw] lg:w-[24%]"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={`Open large preview for ${cert.name}`}
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-muted/80 to-background p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_32%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex h-full items-center justify-center rounded-[1.25rem] bg-white/90 p-3 ring-1 ring-border/60">
          <img
            src={cert.image}
            alt={cert.name}
            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75">
          {cert.issuer}
        </p>
        <h4 className="font-serif text-xl font-bold text-foreground line-clamp-1">
          {cert.name}
        </h4>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {cert.description}
        </p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#263248]">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-[#1f2d46] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="mb-3 text-sm font-bold text-[#ffbd35]">We Build Trust</p>
              <h1 className="mb-6 text-5xl font-extrabold tracking-[-0.04em] md:text-6xl">
                Our Certifications
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/80">
                We maintain the highest standards in quality, safety, and environmental responsibility. Our comprehensive certifications demonstrate our commitment to excellence and international compliance.
              </p>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-12">
              <p className="mb-3 text-sm font-bold text-[#42516d]">Featured Collection</p>
              <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Featured Certifications</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[12rem]">
              {featured.map((cert, index) => renderMosaicTile(cert, index))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="bg-slate-50 px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12">
                <p className="mb-3 text-sm font-bold text-[#42516d]">Complete Listings</p>
                <h2 className="text-4xl font-extrabold tracking-[-0.04em]">Additional Certifications</h2>
              </div>

              <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
                <div className="flex gap-4 min-w-max pr-4 snap-x snap-mandatory">
                  {others.map((cert, index) => renderScrollerTile(cert, index))}
                </div>
              </div>
            </div>
          </section>
        )}

        {certificates.length === 0 && (
          <section className="px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Trophy className="h-8 w-8 text-[#42516d]" />
                </div>
              </div>
              <h3 className="mb-3 text-3xl font-extrabold tracking-[-0.04em]">
                No Certifications Yet
              </h3>
              <p className="text-base text-slate-500">
                Our certifications will be displayed here as they are added.
              </p>
            </div>
          </section>
        )}

        <section className="grid md:grid-cols-2">
          <div className="bg-[#1f2d46] px-6 py-24 text-white md:px-[max(3rem,calc((100vw-1152px)/2+1.5rem))]">
            <div className="max-w-md">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Excellence & Trust</p>
              <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Proven Excellence & Trust
              </h2>
              <p className="mb-8 text-sm leading-6 text-white/75">
                Our certified processes and quality standards ensure that every product and service meets the highest international requirements.
              </p>
              <a href="/contact" className="inline-flex bg-[#ffbd35] px-5 py-3 text-xs font-extrabold uppercase text-[#263248]">
                Get In Touch
              </a>
            </div>
          </div>

          <div className="bg-[#ffbd35] px-6 py-24 md:px-16">
            <div className="relative max-w-md">
              <p className="mb-4 text-sm font-bold text-[#263248]">Quality Standards</p>
              <p className="mb-8 text-sm leading-6 text-[#263248]/75">
                We prioritize secure handling and responsible practices across all certifications and compliance standards. Partner with us for assured quality and reliability.
              </p>
              <ul className="space-y-4 text-sm font-bold text-[#263248]">
                {[
                  ['International Compliance', CheckCircle2],
                  ['Quality Assurance', Clock3],
                  ['Transparent Documentation', Truck],
                  ['Certified Excellence', Ship],
                ].map(([label, Icon]) => (
                  <li key={label as string} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" /> {label as string}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={!!preview} onOpenChange={(v) => { if (!v) setPreview(null); }}>
        <DialogContent className="max-w-6xl overflow-hidden p-0">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full bg-black/90 p-4 sm:p-6">
            {preview && (
              <img src={preview.image} alt={preview.name} className="w-full max-h-[80vh] object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
