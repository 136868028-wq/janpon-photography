import { cn } from "@/lib/utils";
import { SLOT_STATUS_TEXT_TH, type DaySlotStatus } from "@/constants/booking";

const statusClasses: Record<DaySlotStatus, { bg: string; border: string; text: string }> = {
  both_free: { bg: "bg-emerald-500/10", border: "border-emerald-600/30", text: "text-emerald-700 dark:text-emerald-300" },
  morning_only: { bg: "bg-sky-500/10", border: "border-sky-600/30", text: "text-sky-700 dark:text-sky-300" },
  evening_only: { bg: "bg-violet-500/10", border: "border-violet-600/30", text: "text-violet-700 dark:text-violet-300" },
  full: { bg: "bg-red-500/10", border: "border-red-600/30", text: "text-red-700 dark:text-red-300" },
  closed: { bg: "bg-muted", border: "border-border", text: "text-muted-foreground" },
  past: { bg: "bg-muted/50", border: "border-border/50", text: "text-muted-foreground/60" },
};

/** Slot status pill — text is mandatory, color is supplementary (docs/02). */
export function DayStatusPill({ status, className }: { status: DaySlotStatus; className?: string }) {
  const s = statusClasses[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        s.bg,
        s.border,
        s.text,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "past" && "bg-muted-foreground/50")} />
      {SLOT_STATUS_TEXT_TH[status]}
    </span>
  );
}

/** Selectable slot chip (เช้า/เย็น) for the booking wizard. */
export function SlotChip({
  label,
  range,
  disabled = false,
  selected = false,
  onSelect,
}: {
  label: string;
  range: string;
  disabled?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
        selected
          ? "border-brand bg-brand/10 ring-2 ring-brand/40"
          : "border-border hover:border-brand/50 hover:bg-muted/50",
        disabled && "cursor-not-allowed opacity-45 hover:border-border hover:bg-transparent",
      )}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{range}</p>
      </div>
      <span
        className={cn(
          "size-4 rounded-full border",
          selected ? "border-brand bg-brand" : "border-border",
        )}
        aria-hidden
      >
        {selected && <span className="block size-2 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-fg" />}
      </span>
    </button>
  );
}

/** Calendar day cell in booking wizard — combines label + status. */
export function CalendarDayCell({
  day,
  status,
  selected = false,
  onSelect,
}: {
  day: string;
  status: DaySlotStatus;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const s = statusClasses[status];
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={status === "past" || status === "closed" || status === "full"}
      aria-pressed={selected}
      className={cn(
        "flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-all",
        selected
          ? "border-brand bg-brand/10 ring-2 ring-brand/40"
          : "border-border hover:border-brand/50",
        (status === "past" || status === "closed" || status === "full") && "cursor-not-allowed opacity-50",
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{day}</span>
      <span className={cn("text-sm font-bold", s.text)}>{SLOT_STATUS_TEXT_TH[status]}</span>
    </button>
  );
}
