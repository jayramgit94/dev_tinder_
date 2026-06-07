import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function Card({ children, className, hover = false, padding = true, ...props }) {
  const Component = hover ? motion.div : "div";
  const motionProps = hover
    ? {
        whileHover: { y: -3, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
      }
    : {};

  return (
    <Component
      className={cn(
        "relative bg-surface-elevated rounded-2xl overflow-hidden group",
        "border border-border",
        "shadow-[0_0_0_1px_var(--color-border),0_2px_8px_rgba(0,0,0,0.04)]",
        hover && "transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        padding && "p-6",
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("mb-5", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn("text-[17px] font-semibold text-text-primary tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return <p className={cn("text-[15px] text-text-secondary mt-1.5 leading-relaxed", className)}>{children}</p>;
}
