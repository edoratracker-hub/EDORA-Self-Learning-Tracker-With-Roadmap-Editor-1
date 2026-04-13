import React from "react"
import { Briefcase } from "lucide-react"

export function CareerHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-secondary">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Job Vacancies
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore the latest job vacancies and take the next step in your career.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
