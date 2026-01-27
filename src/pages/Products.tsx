import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useSite } from '@/contexts/SiteContext';

export default function Products() {
  const { products } = useSite();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <p className="text-accent font-medium mb-2 tracking-wider uppercase text-sm">
              Our Catalog
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Products
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Explore our comprehensive range of quality products sourced from trusted suppliers across the globe.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products available at the moment. Please check back later!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
