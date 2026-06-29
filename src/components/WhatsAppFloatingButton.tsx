import { useMemo } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const phoneNumber = useMemo(() => {
    // WhatsApp accepts numbers in international format without '+'
    return '+923319056666'.replace(/^\+/, '');
  }, []);

  const href = useMemo(() => {
    const message = encodeURIComponent('Hi, I want to request a quote.');
    return `https://wa.me/${phoneNumber}?text=${message}`;
  }, [phoneNumber]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_12px_25px_rgba(37,211,102,0.35)] transition-transform hover:scale-105">
        <MessageCircle className="h-7 w-7 text-white" />
      </span>
    </a>
  );
}

