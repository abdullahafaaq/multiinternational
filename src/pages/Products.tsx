import { useMemo, useState } from 'react';
import { ArrowRight, PackageSearch, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useSite } from '@/contexts/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { defaultProductCategories } from '@/lib/siteData';

export default function Products() {
  const { settings, products } = useSite();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const configuredCategories = settings.productCategories?.length ? settings.productCategories : defaultProductCategories;
  const productCategories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  const categories = ['All', ...Array.from(new Set([...configuredCategories, ...productCategories]))];

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const searchableText = [
        product.name,
        product.category,
        product.origin,
        product.description,
        ...product.specifications,
      ].join(' ').toLowerCase();

      return matchesCategory && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [products, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        <section className="relative overflow-hidden bg-[#1f2d46]">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=85"
            alt="Cargo containers at an international logistics terminal"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2d46] via-[#1f2d46]/90 to-[#1f2d46]/50" />
          <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border-[36px] border-[#ffbd35]/15" />
          <div className="mx-auto grid min-h-[430px] max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 text-white">
              <p className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#ffbd35]">
                <PackageSearch className="h-4 w-4" />
                Our Catalog
              </p>
              <h1 className="mb-6 max-w-2xl font-sans text-5xl font-extrabold leading-[1.04] tracking-[-0.04em] md:text-7xl">
                Quality Products for Global Trade
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/75 md:text-base">
                Explore trusted products sourced for international buyers, with clear origin details, order quantities,
                and specifications ready for export planning.
              </p>
            </div>

            <div className="relative z-10 border-l-4 border-[#ffbd35] bg-white/10 p-8 text-white backdrop-blur-sm">
              <p className="mb-4 text-sm font-bold text-[#ffbd35]">Procurement Snapshot</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]">{products.length}</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">Products Available</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold tracking-[-0.04em]">{categories.length - 1}</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">Trade Categories</p>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm font-bold text-white/85">
                <Sparkles className="h-5 w-5 text-[#ffbd35]" />
                Sourced from reliable suppliers across key global markets.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-6xl space-y-10 px-6">
            <div className="-mt-16 w-full overflow-hidden border border-slate-200 bg-white p-5 shadow-2xl md:p-7">
              <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(260px,360px)_1fr] xl:items-start">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#263248]">
                    <Search className="h-4 w-4 text-[#ffbd35]" />
                    Search Products
                  </div>
                  <div className="relative">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by product, origin, or specification"
                      className="h-12 rounded-none border-slate-200 pr-10 focus-visible:ring-[#ffbd35]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#263248]"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-[#263248]">
                      <SlidersHorizontal className="h-4 w-4 text-[#ffbd35]" />
                      Filter by Category
                    </div>
                    {(searchQuery || selectedCategory !== 'All') && (
                      <Button type="button" variant="ghost" size="sm" className="rounded-none text-xs font-bold" onClick={clearFilters}>
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        className={`h-auto min-h-10 rounded-none border-slate-200 px-4 py-2 text-xs font-extrabold whitespace-normal text-left ${
                          selectedCategory === category
                            ? 'bg-[#1f2d46] text-white hover:bg-[#263956]'
                            : 'bg-white text-[#42516d] hover:bg-[#ffbd35] hover:text-[#263248]'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500">
                <span>
                  Showing {filteredProducts.length} of {products.length} products
                </span>
                {selectedCategory !== 'All' && <span className="font-bold text-[#263248]">{selectedCategory}</span>}
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-sm font-bold text-[#42516d]">Export Ready</p>
                <h2 className="text-3xl font-extrabold tracking-[-0.04em]">Product Listings</h2>
              </div>
              <a href="#products" className="hidden items-center text-xs font-extrabold uppercase tracking-wide text-[#42516d] md:inline-flex">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>

            <div id="products" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="border border-slate-200 bg-white py-16 text-center">
                <p className="text-lg text-slate-500">
                  No products available at the moment. Please check back later!
                </p>
              </div>
            )}
            {products.length > 0 && filteredProducts.length === 0 && (
              <div className="border border-slate-200 bg-white py-16 text-center">
                <p className="text-lg text-slate-500">
                  No products matched your search. Try another keyword or category.
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
