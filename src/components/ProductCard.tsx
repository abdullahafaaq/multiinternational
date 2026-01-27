import { Package, Globe, Star } from 'lucide-react';
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
    <div className="group bg-card rounded-2xl overflow-hidden card-elevated">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-4 left-4 gold-gradient text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-background/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Globe className="w-4 h-4" />
              {product.origin}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Package className="w-4 h-4" />
              MOQ: {product.minOrderQuantity}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
            {product.category}
          </span>
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        {/* Specifications */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.specifications.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-muted-foreground text-sm">Per {product.unit}</span>
            <p className="text-2xl font-bold text-primary">
              ${product.pricePerUnit.toLocaleString()}
            </p>
          </div>
          <Link to={`/contact?product=${product.id}`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Request Quote
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
