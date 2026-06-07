import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Button from "../ui/Button";
import ThemeToggle from "../ThemeToggle";
import { cn } from "../../lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Open Source", href: "#opensource" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
  const user = useSelector((store) => store.user.data);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.06]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <motion.div
          className="absolute inset-0 glass-nav"
          style={{ opacity: bgOpacity }}
        />
        <motion.div
          className="absolute bottom-0 inset-x-0 h-px bg-black"
          style={{ opacity: borderOpacity }}
        />

        <nav className="relative container-wide flex items-center justify-between h-[72px] px-5 sm:px-8 lg:px-12" aria-label="Main">
          <Link to="/" className="flex items-center gap-3 group z-10">
            <motion.span
              className="flex size-9 items-center justify-center rounded-xl bg-text-primary text-surface font-bold text-xs"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              DT
            </motion.span>
            <span className="font-semibold text-[15px] text-text-primary tracking-tight">DevTinder</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary rounded-full hover:bg-black/[0.04] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 z-10">
            <ThemeToggle />
            {user ? (
              <Link to="/app">
                <Button variant="primary" size="sm" magnetic>Open app</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" magnetic>Get started</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-1 z-10">
            <ThemeToggle />
            <button
              type="button"
              className="p-2.5 -mr-2 rounded-xl hover:bg-surface-subtle transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-text-primary rounded-full origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-full bg-text-primary rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-text-primary rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-surface/95 backdrop-blur-2xl pt-24 px-6"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-4 text-2xl font-semibold text-text-primary border-b border-border"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-10">
              {user ? (
                <Link to="/app" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="lg">Open app</Button>
                </Link>
              ) : (
                <>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="lg" magnetic>Get started free</Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="secondary" className="w-full" size="lg">Log in</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
