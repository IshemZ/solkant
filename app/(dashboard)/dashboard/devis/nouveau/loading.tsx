export default function NewQuoteLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded bg-foreground/10" />
        <div className="h-5 w-96 animate-pulse rounded bg-foreground/10" />
      </div>

      {/* Form skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Client selection */}
        <div className="space-y-2">
          <div className="h-5 w-20 animate-pulse rounded bg-foreground/10" />
          <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-5 w-28 animate-pulse rounded bg-foreground/10" />
          <div className="h-24 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Items section */}
        <div className="space-y-3">
          <div className="h-6 w-32 animate-pulse rounded bg-foreground/10" />
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted p-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
                <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <div className="h-10 w-24 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}
