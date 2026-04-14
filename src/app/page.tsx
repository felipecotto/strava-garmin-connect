import { LandingDeveloper } from "@/components/landing/landing-developer"
import { LandingExperience } from "@/components/landing/landing-experience"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingProject } from "@/components/landing/landing-project"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <LandingHero />
      <LandingProject />
      <LandingExperience />
      <LandingDeveloper />
      <LandingFooter />
    </div>
  )
}
