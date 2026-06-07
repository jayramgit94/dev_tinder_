import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export default function Modal({ isOpen, onClose, children, className }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative w-full max-w-md bg-surface-elevated rounded-3xl shadow-2xl border border-border outline-none overflow-hidden",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalCloseButton({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:bg-surface-subtle hover:text-text-primary transition-colors z-10"
      aria-label="Close"
    >
      ✕
    </button>
  );
}
