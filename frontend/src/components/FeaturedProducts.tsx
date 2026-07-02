'use client';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
export function FeaturedProducts() {
  const { products } = useProducts({ sort: 'ratingAvg:desc', limit: 8 } as any);
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
