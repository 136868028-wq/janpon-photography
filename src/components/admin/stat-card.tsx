import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
  className?: string;
}) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="font-heading text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                trend === "up" && "text-emerald-600 dark:text-emerald-400",
                trend === "down" && "text-red-600 dark:text-red-400",
                trend === "flat" && "text-muted-foreground",
              )}
            >
              {trend === "up" && <TrendingUp className="size-3.5" />}
              {trend === "down" && <TrendingDown className="size-3.5" />}
              {trend === "flat" && <Minus className="size-3.5" />}
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
