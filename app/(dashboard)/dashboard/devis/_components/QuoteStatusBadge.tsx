import { Badge } from "@/components/ui/badge";
import { QuoteStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusConfig: Record<QuoteStatus, { label: string; className: string }> =
  {
    DRAFT: {
      label: "Brouillon",
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
    SENT: {
      label: "Envoyé",
      className: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    ACCEPTED: {
      label: "Accepté",
      className:
        "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
    },
    REJECTED: {
      label: "Refusé",
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    },
    EXPIRED: {
      label: "Expiré",
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    },
  };

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, className)} variant="outline">
      {config.label}
    </Badge>
  );
}
