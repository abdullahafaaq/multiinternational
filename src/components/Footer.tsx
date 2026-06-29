import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';
import { richTextToPlainText, sanitizeRichText } from '@/lib/richText';
import logo from '@/assets/logo-white.png';

export default function Footer() {
  const { settings } = useSite();
  const email = richTextToPlainText(settings.email);
  const phone = richTextToPlainText(settings.phone);

  return (
    <footer className="bg-[#1f2d46] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Multi International" className="h-8 w-auto" />
            </Link>
            <p className="max-w-xs text-xs leading-5 text-white/70">
              <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.footerDescription || settings.tagline) }} />
            </p>
            <div className="flex items-center gap-3 text-[#ffbd35] pt-2">
              <a href="#" className="transition hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="transition hover:text-white">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="transition hover:text-white">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-[#ffbd35]">Quick Links</h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link to="/products" className="transition hover:text-[#ffbd35]">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition hover:text-[#ffbd35]">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="transition hover:text-[#ffbd35]">
                  Certifications
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-[#ffbd35]">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xs font-extrabold uppercase tracking-wide text-[#ffbd35]">Contact</h3>
            <div className="space-y-3 text-xs text-white/70">
              <a href={`mailto:${email}`} className="flex items-start gap-2 transition hover:text-[#ffbd35]">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#ffbd35]" />
                <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.email) }} />
              </a>
              <a href={`tel:${phone}`} className="flex items-start gap-2 transition hover:text-[#ffbd35]">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#ffbd35]" />
                <span dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.phone) }} />
              </a>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#ffbd35]" />
                <div className="space-y-1 text-xs leading-5">
                  <p dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.address) }} />
                  {settings.address2 && (
                    <p dangerouslySetInnerHTML={{ __html: sanitizeRichText(settings.address2) }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-white/60">
            © 2026 Multi International. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/60">
            <Link to="/privacy" className="transition hover:text-[#ffbd35]">Privacy Policy</Link>
            <Link to="/terms" className="transition hover:text-[#ffbd35]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
