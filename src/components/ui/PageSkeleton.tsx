export default function PageSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 h-24" />
        ))}
      </div>
      <div className="rounded-2xl bg-white/10 h-64 mt-6" />
    </div>
  )
}