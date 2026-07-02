'use client';
export function ProductFilters({ filters, onChange }: any) {
  return (
    <div className="space-y-4">
      <input placeholder="Search..." value={filters.search || ''} onChange={e => onChange({ search: e.target.value })} className="input-field" />
      <select value={filters.sort || ''} onChange={e => onChange({ sort: e.target.value })} className="input-field">
        <option value="">Sort by</option>
        <option value="price:asc">Price: Low to High</option>
        <option value="price:desc">Price: High to Low</option>
      </select>
    </div>
  );
}
