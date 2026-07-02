import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';

export function ProductCard({ product }: any) {
  return (
    <Link href={`/products/${product.slug}`} className="bg-white rounded-xl border hover:shadow-md transition group">
      <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden relative">
        <Image src={product.images[0] || '/placeholder.png'} alt={product.name} fill className="object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{product.ratingAvg} ({product.ratingCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
          {product.comparePrice && <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
