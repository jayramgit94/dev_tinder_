import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import MagneticWrap from "../motion/MagneticWrap";
import { fadeUp } from "../../lib/motion";

const floatingCards = [
  { name: "Alex K.", role: "Backend · Go", x: "-12%", y: "18%", delay: 0.2 },
  { name: "Priya S.", role: "Full Stack", x: "78%", y: "8%", delay: 0.4 },
  { name: "Jordan M.", role: "Mobile Dev", x: "72%", y: "62%", delay: 0.6 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center mesh-bg overflow-hidden pt-[72px]">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container-wide px-5 sm:px-8 lg:px-12 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <motion.div>
            <motion.div {...fadeUp(0)}>
              <Badge className="mb-8">Open source · Built for builders</Badge>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-text-primary"
            >
              Where developers
              <br />
              <span className="text-gradient">find their people.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-6 text-lg sm:text-xl text-text-secondary max-w-lg leading-relaxed font-normal"
            >
              Swipe through profiles. Match with co-founders, hackathon teammates,
              and open-source collaborators. Build something legendary together.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/register">
                <Button size="lg" magnetic className="w-full sm:w-auto min-w-[180px]">
                  Start for free
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[180px]">
                  See how it works
                </Button>
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="mt-12 flex items-center gap-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full ring-2 ring-white overflow-hidden bg-neutral-200"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=dev${i}`}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-text-muted">
                <span className="font-semibold text-text-primary">2,000+</span> developers networking
              </p>
            </motion.div>
          </motion.div>

          <div className="relative hidden lg:block h-[580px]">
            {floatingCards.map((card) => (
              <motion.div
                key={card.name}
                className="absolute w-44 premium-card p-4 shadow-lg"
                style={{ left: card.x, top: card.y }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay + 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + card.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${card.name}`}
                    alt=""
                    className="size-12 rounded-xl bg-neutral-100 mb-3"
                  />
                  <p className="font-semibold text-[14px]">{card.name}</p>
                  <p className="text-[12px] text-text-muted">{card.role}</p>
                </motion.div>
              </motion.div>
            ))}

            <MagneticWrap strength={0.08} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-[300px] premium-card overflow-hidden shadow-xl border-black/[0.08]"
              >
                <div className="relative aspect-[3/4] bg-linear-to-br from-brand-50 via-white to-brand-100/50">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=hero-dev"
                    alt="Developer profile"
                    className="absolute inset-0 size-full object-cover p-10"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">96% match</Badge>
                  </div>
                </div>
                <div className="p-5 border-t border-black/[0.06]">
                  <h3 className="font-bold text-[17px] tracking-tight">Sarah Chen</h3>
                  <p className="text-[13px] text-text-muted mt-0.5">Full Stack · Open to co-founding</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {["TypeScript", "React", "AWS"].map((s) => (
                      <Badge key={s} variant="neutral">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-5">
                    <div className="flex-1 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-text-muted text-sm">Pass</div>
                    <div className="flex-1 h-10 rounded-full bg-text-primary text-white flex items-center justify-center text-sm font-medium">Connect</div>
                  </div>
                </div>
              </motion.div>
            </MagneticWrap>
          </div>
        </div>
      </div>
    </section>
  );
}
