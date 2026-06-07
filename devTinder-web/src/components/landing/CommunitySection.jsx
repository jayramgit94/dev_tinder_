import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Reveal from "../motion/Reveal";

const stats = [
  { value: "2K+", label: "Active developers" },
  { value: "850+", label: "Matches made" },
  { value: "120+", label: "Projects started" },
  { value: "40+", label: "Countries" },
];

export default function CommunitySection() {
  return (
    <section id="community" className="section-padding bg-surface overflow-hidden">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <Badge variant="success" className="mb-6">Growing community</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary leading-tight">
              A global network of builders
            </h2>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed">
              Join developers from startups, FAANG, indie hackers, and students.
              Share skills, find mentors, and build the next big thing.
            </p>
            <Link to="/register" className="inline-block mt-10">
              <Button size="lg" magnetic>Join the community</Button>
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-black/[0.06] bg-surface-muted p-6 lg:p-8 text-center premium-card-hover"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">{stat.value}</p>
                  <p className="text-[13px] text-text-muted mt-2 font-medium">{stat.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
