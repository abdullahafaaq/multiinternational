import { ArrowRight, Globe, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/siteData';

// Placeholder images for product categories
const categoryImages: Record<string, string> = {
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
  'coffee': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
  'machinery': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
  'textiles': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
  'chemicals': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
  'electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
};

const defaultImage = 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Support both preset image keys and custom URLs (http or data: base64)
  const isCustomImage = product.image.startsWith('http') || product.image.startsWith('data:');
  const imageSrc = isCustomImage ? product.image : (categoryImages[product.image] || defaultImage);

  return (
    <article className="group overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d46]/85 via-[#1f2d46]/10 to-transparent opacity-85" />
        {product.featured && (
          <div className="absolute left-4 top-4 flex items-center gap-1 bg-[#ffbd35] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#263248]">
            <Star className="h-3 w-3 fill-[#263248]" />
            Featured
          </div>
        )}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <span className="mb-3 inline-flex bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-sm">
            {product.category}
          </span>
          <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.04em] transition-colors group-hover:text-[#ffbd35]">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-[#1f2d46] px-5 py-4 text-white">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/75">
            <Globe className="h-4 w-4 text-[#ffbd35]" />
            <span>{product.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-white/75">
            <Package className="h-4 w-4 text-[#ffbd35]" />
            <span>MOQ: {product.minOrderQuantity}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
          {product.description}
        </p>
        
        <div className="mb-5 flex flex-wrap gap-2">
          {product.specifications.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-[#42516d]"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <div>
            <span className="text-sm text-slate-500">Per {product.unit}</span>
            <p className="text-3xl font-extrabold tracking-[-0.04em] text-[#263248]">
              ${product.pricePerUnit.toLocaleString()}
            </p>
          </div>
          <Link to={`/contact?product=${product.id}`}>
            <Button className="rounded-none bg-[#ffbd35] px-4 text-xs font-extrabold uppercase text-[#263248] shadow-none hover:bg-[#f4a90d]">
              Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
