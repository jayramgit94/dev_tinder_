import { motion } from "framer-motion";
import Card from "./ui/Card";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";

export default function UserRequestCard({ user, actions, variant = "default" }) {
  const isPending = variant === "pending";

  return (
    <Card hover className="overflow-hidden p-0 group">
      <div className="relative aspect-[4/3] overflow-hidden card-gradient">
        <img
          src={user.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
          alt={`${user.firstName || "User"} ${user.lastName || ""}`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {isPending && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface-elevated/90 text-brand-700 dark:text-brand-300 shadow-sm backdrop-blur-sm border border-border">
            Pending
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Avatar src={user.photoUrl} alt={user.firstName} size="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-text-primary tracking-tight truncate">
              {(user.firstName || "") + " " + (user.lastName || "")}
            </h3>
            {(user.age || user.gender || user.city) && (
              <p className="text-xs text-text-muted mt-0.5">
                {[user.age, user.gender, user.city].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        {user.about && (
          <p className="text-[13px] text-text-secondary line-clamp-2 leading-relaxed mb-3">
            {user.about}
          </p>
        )}

        {Array.isArray(user.skills) && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {user.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="neutral">{skill}</Badge>
            ))}
            {user.skills.length > 4 && (
              <Badge variant="neutral">+{user.skills.length - 4}</Badge>
            )}
          </div>
        )}

        {actions && (
          <motion.div
            className="flex gap-2 justify-end pt-1 border-t border-border"
            initial={false}
            whileHover={{ y: -1 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </Card>
  );
}
