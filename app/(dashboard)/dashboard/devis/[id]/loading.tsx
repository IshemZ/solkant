export default function QuoteDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-5 w-32 animate-pulse rounded bg-foreground/10" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-foreground/10" />
        </div>
      </div>

      {/* Client info skeleton */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-foreground/10 mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-foreground/10" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-foreground/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-foreground/10" />
        </div>
      </div>

      {/* Quote items skeleton */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="h-6 w-32 animate-pulse rounded bg-foreground/10 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0"
            >
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 animate-pulse rounded bg-foreground/10" />
                <div className="h-4 w-32 animate-pulse rounded bg-foreground/10" />
              </div>
              <div className="h-6 w-24 animate-pulse rounded bg-foreground/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Total skeleton */}
      <div className="flex justify-end">
        <div className="w-64 space-y-3 rounded-lg border border-border bg-card p-4">
          <div className="flex justify-between">
            <div className="h-5 w-24 animate-pulse rounded bg-foreground/10" />
            <div className="h-5 w-20 animate-pulse rounded bg-foreground/10" />
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <div className="h-6 w-32 animate-pulse rounded bg-foreground/10" />
            <div className="h-6 w-24 animate-pulse rounded bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
