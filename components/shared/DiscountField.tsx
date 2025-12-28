"use client";

import { useState, useEffect } from "react";
import { FormField, Input } from "@/components/ui";

export type DiscountType = "PERCENTAGE" | "FIXED";

interface DiscountFieldProps {
  value: number;
  type: DiscountType;
  subtotal: number;
  onChange: (value: number, type: DiscountType) => void;
  className?: string;
}

export default function DiscountField({
  value,
  type,
  subtotal,
  onChange,
  className = "",
}: DiscountFieldProps) {
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync local value when prop value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  // Calculate the actual discount amount in euros
  // Protect against NaN when subtotal is invalid
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const discountAmount =
    type === "PERCENTAGE" ? safeSubtotal * (value / 100) : value;

  const handleTypeChange = (newType: DiscountType) => {
    // Reset value to 0 when switching types
    setLocalValue("0");
    onChange(0, newType);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLocalValue(inputValue);

    const numValue = Number.parseFloat(inputValue) || 0;

    // Validate based on type
    if (type === "PERCENTAGE") {
      // Max 100% for percentage
      const validValue = Math.min(100, Math.max(0, numValue));
      onChange(validValue, type);
    } else {
      // Max subtotal for fixed amount (protect against NaN)
      const maxValue = Number.isFinite(subtotal) ? subtotal : 0;
      const validValue = Math.min(maxValue, Math.max(0, numValue));
      onChange(validValue, type);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("FIXED")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            type === "FIXED"
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
          }`}
        >
          € Montant fixe
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("PERCENTAGE")}
          className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
            type === "PERCENTAGE"
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/20 bg-background text-foreground hover:border-foreground/40"
          }`}
        >
          % Pourcentage
        </button>
      </div>

      {/* Value Input */}
      <FormField label="Montant de la remise" id="discount-value">
        <div className="relative">
          <Input
            id="discount-value"
            type="number"
            min="0"
            max={type === "PERCENTAGE" ? 100 : (Number.isFinite(subtotal) ? subtotal : undefined)}
            step={type === "PERCENTAGE" ? 1 : 0.01}
            value={localValue}
            onChange={handleValueChange}
            placeholder={type === "PERCENTAGE" ? "Ex: 20" : "Ex: 15.00"}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {type === "PERCENTAGE" ? "%" : "€"}
          </div>
        </div>
      </FormField>

      {/* Calculated Amount Display */}
      {value > 0 && (
        <div className="rounded-md bg-muted/50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-foreground/70">Remise appliquée :</span>
            <span className="font-semibold text-foreground">
              -{discountAmount.toFixed(2)} €
            </span>
          </div>
          {type === "PERCENTAGE" && Number.isFinite(safeSubtotal) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {value}% de {safeSubtotal.toFixed(2)} €
            </p>
          )}
        </div>
      )}

      {/* Validation Messages */}
      {type === "PERCENTAGE" && value > 100 && (
        <p className="text-sm text-red-600">
          La remise en pourcentage ne peut pas dépasser 100%
        </p>
      )}
      {type === "FIXED" && Number.isFinite(subtotal) && value > subtotal && (
        <p className="text-sm text-red-600">
          La remise ne peut pas dépasser le sous-total ({subtotal.toFixed(2)} €)
        </p>
      )}
    </div>
  );
}
