import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface EmptyStateProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  let actionButton = null;

  if (actionLabel) {
    if (actionHref) {
      actionButton = (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      );
    } else if (onAction) {
      actionButton = <Button onClick={onAction}>{actionLabel}</Button>;
    }
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionButton}
    </div>
  );
}
