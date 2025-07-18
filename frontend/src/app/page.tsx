"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Users, Shield, Zap, Github } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center text-center gap-8 pb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center">
            Welcome to <span className="text-primary">VeluTalks</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px]">
            An open-source real-time chat application built with modern technologies.
            Connect, collaborate, and communicate with anyone, anywhere.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="https://github.com/sreyansu/velutalk" target="_blank">
              <Button size="lg" variant="outline">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8">
          <Card className="bg-background/60">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <MessageCircle className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Real-time Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Instant messaging with real-time updates and message delivery status.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Group Chats</h3>
                <p className="text-sm text-muted-foreground">
                  Create and join chat rooms for team collaboration or casual conversations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption and secure authentication to protect your privacy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Zap className="h-10 w-10 text-primary" />
                <h3 className="font-bold">Fast & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Built with modern tech stack for optimal performance and reliability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

