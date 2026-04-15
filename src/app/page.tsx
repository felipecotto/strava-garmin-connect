import { Hero } from "@/components/landing/hero"
import { LandingDeveloper } from "@/components/landing/landing-developer"
import { LandingExperience } from "@/components/landing/landing-experience"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingProject } from "@/components/landing/landing-project"

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(70%_55%_at_50%_0%,#f1f5f9,transparent)]"
      />
      <LandingHeader />
      <Hero />
      <LandingProject />
      <LandingExperience />
      <LandingDeveloper />
      <LandingFooter />
    </div>
  )
}
