import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import MagneticWrap from "../motion/MagneticWrap";

const variants = {
  primary:
    "bg-text-primary text-surface hover:opacity-90 shadow-md hover:shadow-lg border border-transparent",
  secondary:
    "bg-surface-elevated text-text-primary border border-border hover:bg-surface-subtle shadow-xs",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
  outline:
    "bg-transparent border border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 dark:border-brand-400/40 dark:text-brand-300 dark:hover:bg-brand-50/15",
  glow:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-glow border border-brand-500/20",
};

const sizes = {
  sm: "h-9 px-4 text-[13px] gap-1.5 rounded-full",
  md: "h-11 px-5 text-sm gap-2 rounded-full",
  lg: "h-12 px-7 text-sm gap-2 rounded-full font-semibold",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  disabled,
  magnetic = false,
  ...props
}) {
  const inner = (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-300",
        "disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {loading && (
        <span
          className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </motion.button>
  );

  if (magnetic && !disabled && !loading) {
    return <MagneticWrap strength={0.15}>{inner}</MagneticWrap>;
  }

  return inner;
}
