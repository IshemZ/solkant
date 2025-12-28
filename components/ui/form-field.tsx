import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
  hint?: string;
}

export function FormField({
  label,
  id,
  error,
  required,
  children,
  className,
  hint,
}: Readonly<FormFieldProps>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-destructive" aria-label="requis">
            *
          </span>
        )}
      </Label>
      {hint && !error && (
        <p className="text-sm text-muted-foreground" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
