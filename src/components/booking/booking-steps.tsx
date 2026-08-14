import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { bookingSteps } from "@/lib/mock-data";

/** 6-step booking progress indicator (docs/08). */
export function BookingSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="ขั้นตอนการจอง">
      {bookingSteps.map((step) => {
        const done = step.step < current;
        const active = step.step === current;
        return (
          <li key={step.step} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="flex w-full items-center">
              <span
                className={cn(
                  "h-1 w-full rounded-full transition-colors",
                  step.step === 1 ? "w-1/2 ml-auto" : "",
                  done || active ? "bg-brand" : "bg-muted",
                )}
                aria-hidden
              />
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-brand text-brand-fg",
                  active && "bg-coal text-white ring-2 ring-brand/50",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {done ? <Check className="size-3.5" /> : step.step}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
