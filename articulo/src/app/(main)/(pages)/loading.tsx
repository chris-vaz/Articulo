import { Skeleton } from '@/components/ui/skeleton'

// Shown instantly while a dashboard page loads its data.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="space-y-2 border-b px-6 py-6 lg:px-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}
