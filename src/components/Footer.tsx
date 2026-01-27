import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';
import logo from '@/assets/logo.png';

export default function Footer() {
  const { settings } = useSite();
  
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img 
                src={logo} 
                alt="Multi International" 
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {settings.tagline}. Facilitating global trade since 2010.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Products', 'Services', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade Regions */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Trade Regions</h3>
            <ul className="space-y-3">
              {['Asia Pacific', 'Europe', 'North America', 'Middle East', 'Africa', 'South America'].map((region) => (
                <li key={region}>
                  <Link 
                    to="/products"
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <a href={`mailto:${settings.email}`} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <a href={`tel:${settings.phone}`} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  {settings.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center space-y-2">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Multi International (Pvt). Ltd. All rights reserved.
          </p>
          <p className="text-primary-foreground/40 text-xs">
            www.multiinternational.asia
          </p>
        </div>
      </div>
    </footer>
  );
}
