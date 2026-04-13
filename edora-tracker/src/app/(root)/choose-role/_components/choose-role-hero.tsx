import React from "react"
import { BookOpen } from "lucide-react"

export function ChooseRoleHero() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="p-3 rounded-lg bg-secondary">
            <BookOpen className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to EDORA
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Choose your role to get started on your personalized learning journey. You can always change your role later.
        </p>
      </div>
    </section>
  )
}
