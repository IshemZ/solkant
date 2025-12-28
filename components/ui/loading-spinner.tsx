import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  className,
  size = "md",
}: Readonly<LoadingSpinnerProps>) {
  return (
    <output
      className={cn(
        "animate-spin rounded-full border-2 border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      aria-label="Chargement en cours"
    >
      <span className="sr-only">Chargement...</span>
    </output>
  );
}
