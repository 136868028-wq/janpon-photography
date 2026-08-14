import { cn } from "@/lib/utils";
import {
  BOOKING_STATUS_LABEL_TH,
  BOOKING_STATUS_VARIANT,
  PAYMENT_STATUS_LABEL_TH,
  PAYMENT_STATUS_VARIANT,
  ROLE_LABEL_TH,
  type BookingStatus,
  type PaymentStatus,
  type Role,
  type BookingStatusVariant,
} from "@/constants/booking";

const variantClasses: Record<BookingStatusVariant, string> = {
  default: "bg-primary text-primary-foreground",
  success: "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300 border-emerald-600/20",
  warning: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300 border-amber-600/20",
  destructive: "bg-red-600/10 text-red-700 dark:bg-red-400/10 dark:text-red-300 border-red-600/20",
  info: "bg-sky-600/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300 border-sky-600/20",
  muted: "bg-muted text-muted-foreground",
};

const dotClasses: Record<BookingStatusVariant, string> = {
  default: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-red-500",
  info: "bg-sky-500",
  muted: "bg-muted-foreground/60",
};

export function StatusBadge({
  variant = "default",
  children,
  className,
}: {
  variant?: BookingStatusVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5.5 w-fit shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dotClasses[variant])} />
      {children}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <StatusBadge variant={BOOKING_STATUS_VARIANT[status]}>
      {BOOKING_STATUS_LABEL_TH[status]}
    </StatusBadge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <StatusBadge variant={PAYMENT_STATUS_VARIANT[status]}>
      {PAYMENT_STATUS_LABEL_TH[status]}
    </StatusBadge>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const cls: Record<Role, string> = {
    owner: "bg-amber-500/10 text-amber-700 border-amber-600/20 dark:text-amber-300",
    admin: "bg-violet-500/10 text-violet-700 border-violet-600/20 dark:text-violet-300",
    staff: "bg-sky-500/10 text-sky-700 border-sky-600/20 dark:text-sky-300",
    photographer: "bg-emerald-500/10 text-emerald-700 border-emerald-600/20 dark:text-emerald-300",
  };
  return (
    <span className={cn("inline-flex h-5.5 items-center rounded-full border px-2.5 text-xs font-medium", cls[role])}>
      {ROLE_LABEL_TH[role]}
    </span>
  );
}
