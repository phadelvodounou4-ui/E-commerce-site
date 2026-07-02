export function Pagination({ pagination, onPageChange }: any) {
  const { page, pages } = pagination;
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{p}</button>
      ))}
    </div>
  );
}
