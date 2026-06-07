import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../motion/Reveal";
import { cn } from "../../lib/utils";

const faqs = [
  { q: "Is DevTinder really free?", a: "Yes. The core experience — swiping, matching, and chatting — is free forever." },
  { q: "Who is DevTinder for?", a: "Developers looking for co-founders, hackathon teammates, mentors, OSS collaborators, or coding partners." },
  { q: "How does matching work?", a: "Browse profiles, send interest. If they accept, you're matched and can chat securely." },
  { q: "Can I import my GitHub profile?", a: "GitHub integration is on our roadmap. Add skills and bio manually for now." },
  { q: "Is my data secure?", a: "HTTP-only cookies, bcrypt passwords, self-hostable stack. Your data stays yours." },
  { q: "Can I contribute?", a: "Absolutely. DevTinder is open source with good first issues on GitHub." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-padding bg-surface-subtle">
      <div className="container-narrow max-w-3xl">
        <Reveal className="text-center mb-14">
          <p className="label-caps mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.q} delay={index * 0.04}>
                <div className="rounded-2xl border border-border bg-surface-elevated overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-[15px] text-text-primary">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="shrink-0 size-6 flex items-center justify-center rounded-full bg-surface-subtle text-text-muted text-sm"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-[15px] text-text-secondary leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
