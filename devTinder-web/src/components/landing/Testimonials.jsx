import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Reveal, { RevealStagger, RevealItem } from "../motion/Reveal";

const testimonials = [
  {
    quote: "Found my hackathon team in 20 minutes. We shipped a working demo and won 2nd place.",
    name: "Rahul Verma",
    role: "CS Student, IIT Bombay",
    avatar: "rahul",
  },
  {
    quote: "DevTinder helped me meet my co-founder. We're now building our SaaS full-time.",
    name: "Emily Nakamura",
    role: "Ex-Google · Startup Founder",
    avatar: "emily",
  },
  {
    quote: "As an OSS maintainer, I finally have a place to find serious contributors.",
    name: "Marcus Webb",
    role: "Maintainer, 3 npm packages",
    avatar: "marcus",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-surface-subtle">
      <div className="container-narrow">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="label-caps mb-4">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary leading-tight">
            Loved by developers worldwide
          </h2>
        </Reveal>

        <RevealStagger className="grid md:grid-cols-3 gap-4 lg:gap-5">
          {testimonials.map((t) => (
            <RevealItem key={t.name}>
              <Card hover className="h-full flex flex-col !p-6 lg:!p-7">
                <blockquote className="flex-1">
                  <p className="text-[15px] text-text-secondary leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <footer className="flex items-center gap-3 mt-8 pt-6 border-t border-black/[0.06]">
                  <Avatar src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.avatar}`} alt={t.name} size="md" />
                  <div>
                    <cite className="not-italic font-semibold text-[14px] text-text-primary">{t.name}</cite>
                    <p className="text-[12px] text-text-muted mt-0.5">{t.role}</p>
                  </div>
                </footer>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
