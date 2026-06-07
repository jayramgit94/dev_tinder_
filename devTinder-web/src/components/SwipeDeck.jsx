import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";

const SWIPE_THRESHOLD = 72;
const FLY_OUT = 640;

function SwipeCard({ user, passOpacity, connectOpacity, onViewDetails }) {
  const PassOverlay = typeof passOpacity === "number" ? "div" : motion.div;
  const ConnectOverlay = typeof connectOpacity === "number" ? "div" : motion.div;
  const passStyle = typeof passOpacity === "number" ? { opacity: passOpacity } : { opacity: passOpacity };
  const connectStyle = typeof connectOpacity === "number" ? { opacity: connectOpacity } : { opacity: connectOpacity };

  return (
    <div className="absolute inset-0 bg-surface-elevated rounded-[28px] overflow-hidden touch-none select-none border border-border shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18)]">
      <div className="h-[58%] relative bg-linear-to-br from-brand-50/80 via-surface-elevated to-violet-50/50 dark:from-brand-900/30 dark:via-surface-elevated dark:to-violet-900/20">
        <img
          src={user.photoUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user._id}`}
          alt={`${user.firstName} ${user.lastName}`}
          className="size-full object-cover pointer-events-none"
          draggable={false}
        />
        {user.compatibility > 0 && (
          <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-surface-elevated/90 text-[11px] font-bold text-brand-600 shadow-sm">
            {user.compatibility}% match
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onViewDetails?.(user); }}
          className="absolute bottom-4 right-4 size-9 rounded-full bg-surface-elevated/90 shadow-md text-sm hover:scale-105 transition-transform z-20"
          aria-label="View profile"
        >
          ℹ️
        </button>
        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        <PassOverlay
          className="absolute top-5 left-5 px-4 py-1.5 rounded-full border-2 border-red-500 text-red-500 font-bold text-[13px] tracking-wide uppercase backdrop-blur-sm bg-surface-elevated/90 pointer-events-none"
          style={passStyle}
        >
          Pass
        </PassOverlay>
        <ConnectOverlay
          className="absolute top-5 right-5 px-4 py-1.5 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-[13px] tracking-wide uppercase backdrop-blur-sm bg-surface-elevated/90 pointer-events-none"
          style={connectStyle}
        >
          Connect
        </ConnectOverlay>
      </div>

      <div className="p-6 lg:p-7">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={user.photoUrl} alt={user.firstName} size="md" />
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {(user.firstName || "") + " " + (user.lastName || "")}
            </h2>
            {(user.age || user.gender || user.city) && (
              <p className="text-[13px] text-text-muted mt-0.5">
                {[user.age, user.gender, user.city].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        {user.about && (
          <p className="text-[14px] text-text-secondary leading-relaxed line-clamp-3 mb-4">{user.about}</p>
        )}
        {Array.isArray(user.skills) && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <Badge key={skill} variant="neutral">{skill}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const SwipeDeck = forwardRef(function SwipeDeck(
  { user, nextUser, onSwipeLeft, onSwipeRight, onSuper, onViewDetails, disabled, onBusyChange },
  ref,
) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const passOpacity = useTransform(x, [-130, -50, 0], [1, 0.4, 0]);
  const connectOpacity = useTransform(x, [0, 50, 130], [0, 0.4, 1]);
  const nextScale = useTransform(x, [-180, 0, 180], [0.98, 0.94, 0.98]);
  const nextOpacity = useTransform(x, [-180, 0, 180], [0.85, 0.55, 0.85]);

  const [busy, setBusy] = useState(false);

  const setDeckBusy = useCallback(
    (value) => {
      setBusy(value);
      onBusyChange?.(value);
    },
    [onBusyChange],
  );

  useEffect(() => {
    x.set(0);
    setDeckBusy(false);
  }, [user?._id, x, setDeckBusy]);

  const flyOut = useCallback(
    async (direction, handlerOverride) => {
      if (!user || busy || disabled) return false;
      setDeckBusy(true);
      const target = direction === "left" ? -FLY_OUT : FLY_OUT;
      await animate(x, target, {
        type: "spring",
        stiffness: 320,
        damping: 32,
        mass: 0.75,
        velocity: direction === "left" ? -400 : 400,
      });
      const handler =
        handlerOverride || (direction === "left" ? onSwipeLeft : onSwipeRight);
      const ok = handler ? await handler(user) : true;
      if (!ok) {
        await animate(x, 0, { type: "spring", stiffness: 420, damping: 28 });
        setDeckBusy(false);
        return false;
      }
      x.set(0);
      setDeckBusy(false);
      return true;
    },
    [user, busy, disabled, x, onSwipeLeft, onSwipeRight, setDeckBusy],
  );

  useImperativeHandle(ref, () => ({
    swipeLeft: () => flyOut("left"),
    swipeRight: () => flyOut("right"),
    swipeSuper: () => (onSuper ? flyOut("right", onSuper) : flyOut("right")),
  }));

  if (!user) return null;

  return (
    <div className="relative w-full max-w-[340px] mx-auto h-[540px]">
      {nextUser && (
        <motion.div className="absolute inset-0 z-0" style={{ scale: nextScale, opacity: nextOpacity }}>
          <SwipeCard user={nextUser} passOpacity={0} connectOpacity={0} onViewDetails={onViewDetails} />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={user._id}
          className="absolute inset-0 z-10 touch-none"
          style={{ x, rotate }}
          drag={busy || disabled ? false : "x"}
          dragConstraints={{ left: -280, right: 280 }}
          dragElastic={0.82}
          dragMomentum={false}
          whileTap={{ cursor: "grabbing" }}
          onDragEnd={(_, info) => {
            const offset = info.offset.x;
            const velocity = info.velocity.x;
            if (offset > SWIPE_THRESHOLD || velocity > 450) flyOut("right");
            else if (offset < -SWIPE_THRESHOLD || velocity < -450) flyOut("left");
            else animate(x, 0, { type: "spring", stiffness: 420, damping: 30 });
          }}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <SwipeCard
            user={user}
            passOpacity={passOpacity}
            connectOpacity={connectOpacity}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default SwipeDeck;

export function SwipeActions({ onPass, onConnect, onSuper, onUndo, canUndo, disabled, loading }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <div className="flex items-center justify-center gap-6">
        <motion.button
          type="button"
          onClick={onPass}
          disabled={disabled || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="size-[56px] rounded-full border border-border bg-surface-elevated shadow-md flex items-center justify-center text-xl text-red-500 disabled:opacity-40"
          aria-label="Pass"
        >
          ✕
        </motion.button>
        {onSuper && (
          <motion.button
            type="button"
            onClick={onSuper}
            disabled={disabled || loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="size-[52px] rounded-full border border-amber-200 bg-amber-50 dark:bg-amber-900/30 shadow-md flex items-center justify-center text-lg disabled:opacity-40"
            aria-label="Super Connect"
          >
            ⭐
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={onConnect}
          disabled={disabled || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="size-[68px] rounded-full bg-text-primary text-surface shadow-xl flex items-center justify-center text-2xl disabled:opacity-40"
          aria-label="Connect"
        >
          ♥
        </motion.button>
      </div>
      {canUndo && onUndo && (
        <button type="button" onClick={onUndo} className="text-xs font-medium text-brand-600 hover:underline">
          Undo last swipe
        </button>
      )}
    </div>
  );
}
