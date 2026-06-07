import { useRef } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";

export default function MagneticWrap({ children, strength = 0.25, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

export function GlowCard({ children, className }) {
  const reduced = useReducedMotion();
  const mouseX = useSpring(0, { stiffness: 200, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 200, damping: 25 });

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, rgba(94,106,210,0.08), transparent 40%)`,
  );

  return (
    <div
      className={className}
      onMouseMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background }}
        />
      )}
      {children}
    </div>
  );
}
