'use client';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import { Loader2 } from 'lucide-react';
export default function ProductsPage() {
  const { products, loading, pagination, filters, updateFilters } = useProducts();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64"><ProductFilters filters={filters} onChange={updateFilters} /></aside>
        <div className="flex-1">
          <div className="flex justify-between mb-6"><h1 className="text-2xl font-bold">All Products</h1><span>{pagination.total} results</span></div>
          {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>
              {products.length === 0 && <p className="text-center py-20 text-gray-500">No products found</p>}
              <Pagination pagination={pagination} onPageChange={(page: number) => updateFilters({ page })} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
