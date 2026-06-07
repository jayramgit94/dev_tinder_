import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const variants = {
  error: "bg-red-50/80 border-red-200/60 text-red-800",
  success: "bg-emerald-50/80 border-emerald-200/60 text-emerald-800",
  info: "bg-brand-50/80 border-brand-200/60 text-brand-800",
  warning: "bg-amber-50/80 border-amber-200/60 text-amber-800",
};

export default function Alert({ children, variant = "info", className, onDismiss }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start justify-between gap-3 px-4 py-3.5 rounded-xl border text-[14px] backdrop-blur-sm",
        variants[variant],
        className,
      )}
    >
      <span className="leading-relaxed">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

export function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto px-4 py-3.5 rounded-2xl shadow-lg border text-[14px] font-medium backdrop-blur-xl",
              t.variant === "success"
                ? "bg-emerald-950/90 text-white border-emerald-800/50"
                : t.variant === "error"
                  ? "bg-red-950/90 text-white border-red-800/50"
                  : "bg-neutral-900/90 text-white border-neutral-700/50",
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
