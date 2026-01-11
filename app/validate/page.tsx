import { ValidationWizard } from "@/components/validate/validation-wizard"
import { Navbar } from "@/components/landing/navbar"

export default function ValidatePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 sm:pt-20 md:pt-24 pb-6 sm:pb-8 md:pb-12">
        <ValidationWizard />
      </div>
    </main>
  )
}
