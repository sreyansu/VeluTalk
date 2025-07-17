"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Users, Shield, Zap } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token validity
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true)
            router.push("/dashboard")
          } else {
            localStorage.removeItem("token")
          }
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ChatRoom</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => document.getElementById("login-tab")?.click()}>
                Sign In
              </Button>
              <Button onClick={() => document.getElementById("register-tab")?.click()}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Private Chat Rooms
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create secure, real-time chat rooms for your team, friends, or community. Up to 50 users per room with
            end-to-end encryption and modern features.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Messaging</h3>
              <p className="text-gray-600">Instant message delivery with typing indicators and online status</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">JWT authentication with encrypted connections and private rooms</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Create rooms for up to 50 users with invite codes and moderation</p>
            </div>
          </div>

          {/* Auth Section */}
          <div className="max-w-md mx-auto">
            <AuthTabs />
          </div>
        </div>
      </section>
    </div>
  )
}

function AuthTabs() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (endpoint: string, data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem("token", result.token)
        localStorage.setItem("user", JSON.stringify(result.user))
        router.push("/dashboard")
      } else {
        alert(result.error || "Authentication failed")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    handleAuth("login", {
      email: formData.get("email"),
      password: formData.get("password"),
    })
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    handleAuth("register", {
      username: formData.get("username"),
      email: formData.get("email"),
      password: password,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join ChatRoom</CardTitle>
        <CardDescription>Sign in to your account or create a new one</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" id="login-tab">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" id="register-tab">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>{" "}
        {/* Expected corresponding JSX closing tag for 'Tabs' */}
      </CardContent>
    </Card>
  )
}
