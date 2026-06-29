import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { hasRichTextContent, richTextToPlainText, sanitizeRichText } from '@/lib/richText';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const { settings, products, addInquiry } = useSite();
  const emailHref = richTextToPlainText(settings.email);
  const phoneHref = richTextToPlainText(settings.phone);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    productId: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      setFormData(prev => ({ ...prev, productId }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    addInquiry(formData);
    toast.success('Thank you! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', productId: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1f2d46]">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85"
            alt="Global contact and communication background"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2d46] via-[#1f2d46]/90 to-[#1f2d46]/50" />
          <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border-[36px] border-[#ffbd35]/15" />
          <div className="mx-auto grid min-h-[430px] max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#ffbd35]">
                <MessageSquare className="h-4 w-4" />
                Get in Touch
              </p>
              <h1 className="mb-6 max-w-2xl font-sans text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Contact Us
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/75 md:text-base">
                Ready to grow your business globally? Get in touch with our trade experts to discuss your requirements and explore partnership opportunities.
              </p>
            </div>

            <div className="relative z-10 border-l-4 border-[#ffbd35] bg-white/10 p-8 text-white backdrop-blur-sm">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Multiple Channels</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]\">24/7</p>
                  <p className="mt-2 text-xs leading-5 text-white/65\">Support Ready</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]\">3+</p>
                  <p className="mt-2 text-xs leading-5 text-white/65\">Global Offices</p>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/85\">
                <Sparkles className="h-5 w-5 text-[#ffbd35]" />
                Responsive team for your trade needs.
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-2xl font-extrabold">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffbd35]">
                        <Mail className="h-5 w-5 text-[#263248]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#263248]">Email</p>
                        <a href={`mailto:${emailHref}`} className="text-slate-600 transition-colors hover:text-[#ffbd35]">
                          <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.email) }} />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffbd35]">
                        <Phone className="h-5 w-5 text-[#263248]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#263248]">Phone</p>
                        <a href={`tel:${phoneHref}`} className="text-slate-600 transition-colors hover:text-[#ffbd35]">
                          <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.phone) }} />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffbd35]">
                        <MapPin className="h-5 w-5 text-[#263248]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#263248]">Address</p>
                        <div className="mt-1 space-y-2 text-slate-600">
                          <div className="flex items-start gap-2">
                            <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.address) }} />
                          </div>
                          {hasRichTextContent(settings.address2) && (
                            <div className="flex items-start gap-2">
                              <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.address2) }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-3 text-lg font-extrabold text-[#263248]">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-8 shadow-sm">
                  <h2 className="mb-6 text-2xl font-extrabold text-[#263248]">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-[#263248]">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          required
                          className="border-slate-200 bg-white text-[#263248]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-[#263248]">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          required
                          className="border-slate-200 bg-white text-[#263248]"
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-[#263248]">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 (555) 123-4567"
                          className="border-slate-200 bg-white text-[#263248]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product" className="text-sm font-bold text-[#263248]">Product Interest (Optional)</Label>
                        <Select
                          value={formData.productId}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
                        >
                          <SelectTrigger className="border-slate-200 bg-white text-[#263248]">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-bold text-[#263248]">Your Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us about your business requirements..."
                        rows={5}
                        required
                        className="border-slate-200 bg-white text-[#263248]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 bg-[#ffbd35] px-6 py-3 text-xs font-extrabold uppercase text-[#263248] transition hover:bg-[#f4a90d]"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Maps */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-bold text-[#42516d]">Our Locations</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#263248]">
                Find Us on Google Maps
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-extrabold text-[#263248]">Canada Office</h3>
                  <p className="mt-1 text-sm text-slate-500">60 Agnes Street, Mississauga, ON, Canada</p>
                </div>
                <div className="h-[320px]">
                  <iframe
                    title="Canada Office Map"
                    src="https://www.google.com/maps?q=60+Agnes+Street+Mississauga+ON+Canada&output=embed"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-extrabold text-[#263248]">Pakistan Office</h3>
                  <p className="mt-1 text-sm text-slate-500">UG-21, Lucky Center, 7-8 Jail Road, Lahore, Pakistan</p>
                </div>
                <div className="h-[320px]">
                  <iframe
                    title="Pakistan Office Map"
                    src="https://www.google.com/maps?q=UG-21,+Lucky+Center,+7-8+Jail+Road,+Lahore,+Pakistan&output=embed"
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
