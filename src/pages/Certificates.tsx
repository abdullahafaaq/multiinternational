import { Trophy } from 'lucide-react';
import { useState } from 'react';
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
  const [preview, setPreview] = useState<null | { image: string; name: string; issuer?: string }>(null);

  const visibleCertificates = certificates;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#263248]">
      <Header />

      <main className="flex-1 pt-20">
        <section className="bg-[#1f2d46] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="mb-3 text-sm font-bold text-[#ffbd35]">We Build Trust</p>
              <h1 className="mb-6 text-5xl font-extrabold tracking-[-0.04em] md:text-6xl text-white">
                Our Certifications
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/80">
                We maintain the highest standards in quality, safety, and environmental responsibility.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          {visibleCertificates.length === 0 ? (
            <div className="mx-auto max-w-2xl text-center py-20">
              <div className="mb-8 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Trophy className="h-8 w-8 text-[#42516d]" />
                </div>
              </div>
              <h3 className="mb-3 text-3xl font-extrabold tracking-[-0.04em]">No Certifications Yet</h3>
              <p className="text-base text-slate-500">Our certifications will be displayed here as they are added.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleCertificates.map((item: CertificateItem) => (
                <article
                  key={item.id}
                  className="relative h-[18rem] sm:h-[20rem] overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    className="group relative block h-full w-full text-left"
                    onClick={() => setPreview({ image: item.image, name: item.name, issuer: item.issuer })}
                    aria-label={`Open certificate preview for ${item.name}`}
                  >
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
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <Dialog open={!!preview} onOpenChange={(v) => { if (!v) setPreview(null); }}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="w-full bg-black/90 p-4 sm:p-6">
              <img
                src={preview.image}
                alt={preview.name}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

