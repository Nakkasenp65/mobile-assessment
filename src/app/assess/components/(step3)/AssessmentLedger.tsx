"use client";
import { CheckCircle, ArrowDownCircle } from "lucide-react";
import { PriceAdjustment } from "../../../../hooks/usePriceCalculation";
import { cn } from "@/lib/utils";

interface AssessmentLedgerProps {
  basePrice: number;
  adjustments: PriceAdjustment[];
}

const AssessmentLedger = ({
  basePrice,
  adjustments,
}: AssessmentLedgerProps) => {
  return (
    <div className="space-y-2 text-sm">
      {/* Base Price */}
      <div className="flex items-center justify-between rounded-md p-2">
        <span className="text-foreground font-medium">
          ราคาเริ่มต้น (รุ่นและความจุ)
        </span>
        <span className="text-foreground font-semibold">
          {basePrice.toLocaleString()}
        </span>
      </div>

      {/* Adjustments List */}
      {adjustments.map((adj, index) => (
        <div
          key={index}
          className="hover:bg-accent/50 flex items-center justify-between rounded-md p-2"
        >
          <div className="flex flex-col">
            <span className="text-muted-foreground font-medium">
              {adj.label}
            </span>
            <span className="text-muted-foreground text-xs">{adj.value}</span>
          </div>
          {/* Aria's touch: Semantic coloring for impact */}
          <div
            className={cn(
              "flex items-center gap-1 font-semibold",
              adj.impact < 0 && "text-destructive",
              adj.impact > 0 && "text-success",
            )}
          >
            {adj.impact < 0 ? (
              <ArrowDownCircle className="h-4 w-4" />
            ) : adj.impact > 0 ? (
              <CheckCircle className="h-4 w-4" />
            ) : null}
            <span>
              {adj.impact > 0
                ? `+${adj.impact.toLocaleString()}`
                : adj.impact.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentLedger;
