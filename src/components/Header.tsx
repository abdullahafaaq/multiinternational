import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white text-[#263248] shadow-lg shadow-slate-900/5"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          <Link to="/" className="group">                 
            <img 
              src={logo} 
              alt="Multi International" 
              className="h-9 w-auto transition-transform group-hover:scale-105 md:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-bold transition-colors ${
                  isActive(link.path)
                    ? 'text-[#ffbd35]'
                    : 'text-[#263248]/75 hover:text-[#263248]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/contact">
              <Button className="h-10 rounded-none bg-[#ffbd35] px-6 text-xs font-extrabold uppercase text-[#263248] shadow-none hover:bg-[#f4a90d]">
                Get a Quote
              </Button>
            </Link>
          </div>

          <button
            className="p-2 text-[#263248] md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="animate-fade-in border-t border-white/15 bg-white py-4 text-[#263248] md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-bold transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#ffbd35] text-[#263248]'
                      : 'text-[#263248]/70 hover:bg-slate-100 hover:text-[#263248]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="mt-2 w-full rounded-none bg-[#ffbd35] font-extrabold uppercase text-[#263248] hover:bg-[#f4a90d]">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
