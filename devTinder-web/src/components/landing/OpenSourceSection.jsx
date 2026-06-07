import Reveal from "../motion/Reveal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const highlights = [
  "MIT licensed — free forever for personal use",
  "Self-hostable backend with MongoDB",
  "Modern React 19 + Express 5 stack",
  "Contributions welcome on GitHub",
];

export default function OpenSourceSection() {
  return (
    <section id="opensource" className="section-padding bg-surface-subtle">
      <div className="container-narrow">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden promo-band p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-6 promo-band-badge">Open Source</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-neutral-50">
                  Built in the open, for the community
                </h2>
                <p className="mt-5 promo-band-subtext text-lg leading-relaxed">
                  Inspect the code, contribute features, report bugs, or fork it for your own developer community.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="https://github.com/jayramgit94/dev_tinder_" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="promo-band-btn">
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>

              <ul className="space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] promo-band-list">
                    <span className="mt-1 size-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <svg className="size-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
