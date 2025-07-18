"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const techStacks = [
  {
    category: "Frontend",
    technologies: [
      { name: "Next.js 14", description: "React framework for production" },
      { name: "TypeScript", description: "Type-safe JavaScript" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "shadcn/ui", description: "Re-usable components" },
    ],
  },
  {
    category: "Backend",
    technologies: [
      { name: "Node.js", description: "JavaScript runtime" },
      { name: "MongoDB", description: "NoSQL database" },
      { name: "Socket.io", description: "Real-time communication" },
    ],
  },
  {
    category: "Authentication",
    technologies: [
      { name: "JWT", description: "JSON Web Tokens for auth" },
      { name: "bcrypt", description: "Password hashing" },
    ],
  },
]

export default function TechStackPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Our Tech Stack</h1>
      <p className="text-lg text-muted-foreground mb-8">
        VeluTalks is built with modern and reliable technologies to provide the best user experience.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techStacks.map((stack) => (
          <Card key={stack.category}>
            <CardHeader>
              <CardTitle>{stack.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {stack.technologies.map((tech) => (
                  <li key={tech.name}>
                    <div className="font-medium">{tech.name}</div>
                    <CardDescription>{tech.description}</CardDescription>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
