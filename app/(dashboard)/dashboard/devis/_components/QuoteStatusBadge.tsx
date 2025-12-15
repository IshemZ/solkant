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
