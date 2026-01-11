"use client"

import { Users } from "lucide-react"

interface Persona {
  name: string
  age: string
  description: string
}

const defaultPersonas: Persona[] = [
  {
    name: "Early Adopters",
    age: "25-35",
    description: "Tech-savvy professionals seeking innovation",
  },
  {
    name: "Enterprise Buyers",
    age: "35-50",
    description: "Decision makers at mid-size companies",
  },
]

interface TargetAudienceProps {
  data?: Persona[]
}

export function TargetAudience({ data }: TargetAudienceProps) {
  const personas = data || defaultPersonas

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Target Audience</h2>
      </div>
      <div className="space-y-4">
        {personas.map((persona, index) => (
          <div key={index} className="rounded-xl bg-secondary/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{persona.name}</span>
              <span className="text-xs text-muted-foreground">{persona.age}</span>
            </div>
            <p className="text-sm text-muted-foreground">{persona.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
