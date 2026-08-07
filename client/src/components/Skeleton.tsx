export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
