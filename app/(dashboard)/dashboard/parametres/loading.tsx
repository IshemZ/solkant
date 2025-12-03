export default function ParametresLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-foreground/10" />
        <div className="h-5 w-96 animate-pulse rounded bg-foreground/10" />
      </div>

      {/* Settings sections skeleton */}
      <div className="space-y-6">
        {/* Business info section */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-56 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-80 animate-pulse rounded bg-foreground/10" />
          </div>

          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-foreground/10" />
                <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Additional settings section */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-72 animate-pulse rounded bg-foreground/10" />
          </div>

          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-28 animate-pulse rounded bg-foreground/10" />
                <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <div className="h-10 w-24 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-10 w-40 animate-pulse rounded-md bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}
