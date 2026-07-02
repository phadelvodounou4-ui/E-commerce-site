import Link from 'next/link';
export function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
        <p className="text-lg mb-8">Shop the latest trends with fast delivery and secure payments.</p>
        <Link href="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Shop Now</Link>
      </div>
    </section>
  );
}
