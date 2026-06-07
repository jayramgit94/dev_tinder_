import { cn } from "../../lib/utils";

const variants = {
  default: "bg-brand-50 text-brand-700 border-brand-100/80 dark:bg-brand-50/20 dark:text-brand-300 dark:border-brand-100/30",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
  warning: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
  error: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50",
  neutral: "bg-surface-subtle text-text-secondary border-border",
};

export default function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
