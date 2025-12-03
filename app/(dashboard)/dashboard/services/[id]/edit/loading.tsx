export default function EditServiceLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-72 animate-pulse rounded bg-foreground/10" />
        <div className="h-5 w-96 animate-pulse rounded bg-foreground/10" />
      </div>

      {/* Form skeleton */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Name field */}
        <div className="space-y-2">
          <div className="h-5 w-24 animate-pulse rounded bg-foreground/10" />
          <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <div className="h-5 w-28 animate-pulse rounded bg-foreground/10" />
          <div className="h-20 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Price field */}
        <div className="space-y-2">
          <div className="h-5 w-16 animate-pulse rounded bg-foreground/10" />
          <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Duration field */}
        <div className="space-y-2">
          <div className="h-5 w-20 animate-pulse rounded bg-foreground/10" />
          <div className="h-10 w-full animate-pulse rounded-md bg-foreground/10" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <div className="h-10 w-24 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-10 w-48 animate-pulse rounded-md bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}
