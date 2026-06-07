import { cn } from "../../lib/utils";

export default function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase()?.replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full h-11 px-4 rounded-xl bg-surface-elevated text-text-primary text-[15px] placeholder:text-text-muted",
          "border transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-400",
          error ? "border-red-300" : "border-border hover:border-border-strong",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[13px] text-error" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-2 text-[13px] text-text-muted">{hint}</p>
      )}
    </div>
  );
}
