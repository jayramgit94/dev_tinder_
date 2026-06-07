import { cn } from "../../lib/utils";

const sizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
};

export default function Avatar({ src, alt, size = "md", online, className }) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden ring-2 ring-surface shadow-sm bg-surface-subtle",
          sizes[size],
        )}
      >
        <img
          src={src || "https://api.dicebear.com/7.x/notionists/svg?seed=DevTinder"}
          alt={alt || "User avatar"}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full ring-2 ring-surface"
          aria-label="Online"
        />
      )}
    </div>
  );
}
