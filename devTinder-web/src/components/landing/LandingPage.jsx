import { Link } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import Hero from "./Hero";
import Features from "./Features";
import Testimonials from "./Testimonials";
import CommunitySection from "./CommunitySection";
import OpenSourceSection from "./OpenSourceSection";
import PricingSection from "./PricingSection";
import FAQ from "./FAQ";
import LandingFooter from "./LandingFooter";
import Button from "../ui/Button";
import Reveal from "../motion/Reveal";

function CTASection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden promo-band px-8 py-16 sm:px-16 sm:py-24 text-center">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500 rounded-full blur-[100px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-neutral-50">
                Ready to find your next collaborator?
              </h2>
              <p className="mt-5 promo-band-subtext text-lg max-w-xl mx-auto">
                Join thousands of developers building meaningful connections every day.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="promo-band-btn w-full sm:w-auto min-w-[200px]" magnetic>
                    Create free account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="ghost" className="text-neutral-50 border border-white/25 hover:bg-white/10 w-full sm:w-auto min-w-[200px]">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CommunitySection />
        <OpenSourceSection />
        <PricingSection />
        <FAQ />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
