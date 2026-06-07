import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card, { CardDescription, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Reveal, { RevealStagger, RevealItem } from "../motion/Reveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start networking as a developer.",
    features: ["Unlimited swipes", "Match & chat", "Profile & skills", "Community access"],
    cta: "Get started",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "For power networkers and serious collaborators.",
    features: ["AI match suggestions", "Advanced filters", "Priority visibility", "Profile analytics"],
    cta: "Coming soon",
    disabled: true,
  },
  {
    name: "Teams",
    price: "$29",
    period: "/mo",
    description: "For startups and hackathon organizers.",
    features: ["Team creation", "Bulk invites", "Admin dashboard", "Custom branding"],
    cta: "Coming soon",
    disabled: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-surface">
      <div className="container-narrow">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="label-caps mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-text-primary leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 text-lg text-text-secondary">Start free. Upgrade when you need more.</p>
        </Reveal>

        <RevealStagger className="grid md:grid-cols-3 gap-4 lg:gap-5 items-start">
          {plans.map((plan) => (
            <RevealItem key={plan.name}>
              <Card
                className={`h-full !p-6 lg:!p-8 ${plan.highlighted ? "ring-2 ring-brand-500/30 shadow-lg relative md:-mt-2 md:mb-2" : ""}`}
                hover={!plan.disabled}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-text-muted text-[14px]">{plan.period}</span>
                </div>
                <CardDescription className="mt-3">{plan.description}</CardDescription>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px] text-text-secondary">
                      <svg className="size-4 text-brand-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  {plan.disabled ? (
                    <Button variant="secondary" className="w-full" disabled>{plan.cta}</Button>
                  ) : (
                    <Link to={plan.href}>
                      <Button className="w-full" magnetic>{plan.cta}</Button>
                    </Link>
                  )}
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
